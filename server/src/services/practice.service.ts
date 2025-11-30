import config from '../config/index.js';
import type { PracticeScenario } from '../data/practice.scenarios.js';
import type { IPracticeMessage } from '../models/PracticeSession.model.js';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export type PracticeAIProvider = 'groq' | 'pollinations';

interface ScenarioOpeningResult {
  systemPrompt: string;
  assistantMessage: string;
  conversationId?: string;
  usedFallback?: boolean;
}

interface ScenarioTurnResult {
  assistantMessage: string;
  usedFallback?: boolean;
}

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama3-70b-8192';
// Pollinations OpenAI-compatible endpoint: https://text.pollinations.ai/openai
const POLLINATIONS_CHAT_URL = 'https://text.pollinations.ai/openai';

interface GroqChatCompletionResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
  };
}

function buildScenarioSystemPrompt(scenario: PracticeScenario, sessionSeed: string): string {
  const objectives = scenario.objectives.map((obj, index) => `${index + 1}. ${obj}`).join('\n');
  const guidelines = scenario.conversationGuidelines.map((guide, index) => `${index + 1}. ${guide}`).join('\n');

  return [
    `Your name is Aurora and you are an extremely patient conversation tutor.`,
    `You speak in ${scenario.language} and help people practice real-life situations.`,
    `The learner's native language is English, so provide tips and corrections in English.`,
    `Scenario: ${scenario.title}.`,
    `Context to keep sessions unique (seed ${sessionSeed}): ${scenario.aiPersona}`,
    `Learner persona: ${scenario.learnerPersona}.`,
    `Objectives:`,
    objectives,
    `Interaction guidelines:`,
    guidelines,
    'Keep responses brief (2-4 sentences) and end with a question to invite the other person to continue.',
    'Include a final line in English starting with "Tip:" offering a specific correction or suggestion.',
  ].join('\n');
}

async function callGroq(messages: ChatMessage[]): Promise<string> {
  if (!config.groq?.apiKey) {
    throw new Error('Groq API key is not configured');
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.groq.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      temperature: 0.8,
      max_tokens: 400,
      messages,
    }),
  });

  const data = (await response.json()) as GroqChatCompletionResponse;

  if (!response.ok) {
    const message = data?.error?.message || 'Unable to contact Groq API';
    throw new Error(message);
  }

  const content: string | undefined = data?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('Groq API returned an empty response');
  }

  return content.trim();
}

async function callPollinations(messages: ChatMessage[]): Promise<string> {
  const response = await fetch(POLLINATIONS_CHAT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'openai',
      temperature: 0.85,
      max_tokens: 400,
      messages,
    }),
  });

  const data = (await response.json()) as GroqChatCompletionResponse;

  if (!response.ok) {
    const message = data?.error?.message || 'Pollinations API unavailable';
    throw new Error(message);
  }

  const content: string | undefined = data?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('Pollinations API returned an empty response');
  }

  return content.trim();
}

async function getAIResponse(provider: PracticeAIProvider, messages: ChatMessage[]): Promise<string> {
  switch (provider) {
    case 'pollinations':
      return callPollinations(messages);
    case 'groq':
    default:
      return callGroq(messages);
  }
}

function buildFallbackResponse(options: {
  scenario: PracticeScenario;
  userMessage?: string;
  isOpening?: boolean;
}): string {
  const { scenario, userMessage, isOpening } = options;
  if (isOpening) {
    return `Hola, bienvenido/a a ${scenario.aiPersona.replace(/\.$/, '')}. ¿En qué puedo ayudarte hoy?\n\nTip: Responde con al menos dos frases para mantener la conversación viva.`;
  }

  const userSnippet = userMessage ? `Gracias por decir: "${userMessage}".` : '';
  return `${userSnippet} Aquí tienes una respuesta ejemplo dentro del escenario ${scenario.title}. ¿Qué piensas hacer después?\n\nTip: Usa conectores como "además" o "sin embargo" para sonar más natural.`;
}

export async function generateScenarioOpening(options: {
  scenario: PracticeScenario;
  sessionSeed: string;
  provider: PracticeAIProvider;
}): Promise<ScenarioOpeningResult> {
  const { scenario, sessionSeed, provider } = options;
  const systemPrompt = buildScenarioSystemPrompt(scenario, sessionSeed);
  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    {
      role: 'user',
      content: `${scenario.starterPrompt} Evita traducir al inglés en esta primera intervención.`,
    },
  ];

  try {
    const assistantMessage = await getAIResponse(provider, messages);
    return { systemPrompt, assistantMessage };
  } catch (error) {
    console.error('generateScenarioOpening error:', error);
    return {
      systemPrompt,
      assistantMessage: buildFallbackResponse({ scenario, isOpening: true }),
      usedFallback: true,
    };
  }
}

export async function generateScenarioTurn(options: {
  scenario: PracticeScenario;
  sessionSeed: string;
  systemPrompt: string;
  history: IPracticeMessage[];
  userMessage: string;
  provider: PracticeAIProvider;
}): Promise<ScenarioTurnResult> {
  const { scenario, sessionSeed, systemPrompt, history, userMessage, provider } = options;
  const messageHistory: ChatMessage[] = [
    { role: 'system', content: systemPrompt || buildScenarioSystemPrompt(scenario, sessionSeed) },
    ...history.map((msg) => ({ role: msg.role, content: msg.content })),
    {
      role: 'user',
      content: `${userMessage}\n\nResponde siguiendo el escenario. Después añade "Tip:" en inglés con una corrección concreta.`,
    },
  ];

  try {
    const assistantMessage = await getAIResponse(provider, messageHistory);
    return { assistantMessage };
  } catch (error) {
    console.error('generateScenarioTurn error:', error);
    return {
      assistantMessage: buildFallbackResponse({ scenario, userMessage }),
      usedFallback: true,
    };
  }
}
