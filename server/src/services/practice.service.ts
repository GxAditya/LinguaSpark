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
const POLLINATIONS_CHAT_URL = 'https://text.pollinations.ai/openai/chat/completions';

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
    `Tu nombre es Aurora y eres una tutora de conversación extremadamente paciente.`,
    `Hablas en ${scenario.language} y ayudas a las personas a practicar situaciones reales.`,
    `Escenario: ${scenario.title}.`,
    `Contexto para mantener las sesiones únicas (semilla ${sessionSeed}): ${scenario.aiPersona}`,
    `Persona del aprendiz: ${scenario.learnerPersona}.`,
    `Objetivos:`,
    objectives,
    `Guías de interacción:`,
    guidelines,
    'Mantén las respuestas breves (2-4 frases) y termina con una pregunta para invitar a la otra persona a continuar.',
    'Incluye una línea final en inglés que empiece con "Tip:" ofreciendo una corrección o sugerencia concreta.',
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
      model: 'gpt-4o-mini',
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
