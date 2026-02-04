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
const GROQ_MODEL = 'llama-3.1-8b-instant';
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
  const fallbackLanguage = scenario.language?.toLowerCase?.() ?? 'spanish';
  const persona = scenario.aiPersona.replace(/\.$/, '');

  const fallbackCopy: Record<string, { opening: (personaText: string) => string; followUp: (message?: string) => string }> = {
    spanish: {
      opening: (personaText) => `Hola, bienvenido/a a ${personaText}. ¿En qué puedo ayudarte hoy?`,
      followUp: (message) =>
        `${message ? `Gracias por decir: "${message}". ` : ''}Aquí tienes una respuesta de ejemplo. ¿Qué te gustaría hacer después?`,
    },
    french: {
      opening: (personaText) => `Bonjour, bienvenue chez ${personaText}. Comment puis-je vous aider aujourd'hui ?`,
      followUp: (message) =>
        `${message ? `Merci pour votre message : "${message}". ` : ''}Voici une réponse d'exemple. Que souhaitez-vous faire ensuite ?`,
    },
    hindi: {
      opening: (personaText) => `नमस्ते, ${personaText} में आपका स्वागत है। आज मैं आपकी कैसे मदद कर सकता हूँ?`,
      followUp: (message) =>
        `${message ? `आपके संदेश के लिए धन्यवाद: "${message}"। ` : ''}यह एक उदाहरण उत्तर है। आप आगे क्या करना चाहेंगे?`,
    },
    mandarin: {
      opening: (personaText) => `你好，欢迎来到${personaText}。今天我能帮你什么？`,
      followUp: (message) =>
        `${message ? `谢谢你的分享：“${message}”。` : ''}这是一个示例回答。接下来你想做什么？`,
    },
    arabic: {
      opening: (personaText) => `مرحباً، أهلاً بك في ${personaText}. كيف يمكنني مساعدتك اليوم؟`,
      followUp: (message) =>
        `${message ? `شكراً لرسالتك: "${message}". ` : ''}إليك ردّاً نموذجياً. ماذا تود أن تفعل بعد ذلك؟`,
    },
    bengali: {
      opening: (personaText) => `নমস্কার, ${personaText}-এ আপনাকে স্বাগতম। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?`,
      followUp: (message) =>
        `${message ? `আপনার বার্তার জন্য ধন্যবাদ: "${message}"। ` : ''}এটি একটি উদাহরণ উত্তর। আপনি এরপর কী করতে চান?`,
    },
    portuguese: {
      opening: (personaText) => `Olá, bem-vindo(a) ao ${personaText}. Como posso ajudar você hoje?`,
      followUp: (message) =>
        `${message ? `Obrigado pela mensagem: "${message}". ` : ''}Aqui vai uma resposta de exemplo. O que você gostaria de fazer em seguida?`,
    },
    russian: {
      opening: (personaText) => `Здравствуйте, добро пожаловать в ${personaText}. Чем могу помочь сегодня?`,
      followUp: (message) =>
        `${message ? `Спасибо за сообщение: "${message}". ` : ''}Вот пример ответа. Что бы вы хотели сделать дальше?`,
    },
    japanese: {
      opening: (personaText) => `こんにちは、${personaText}へようこそ。今日はどのようにお手伝いしましょうか？`,
      followUp: (message) =>
        `${message ? `メッセージありがとう：「${message}」。` : ''}これは例の返答です。次に何をしたいですか？`,
    },
  };

  const fallback = fallbackCopy[fallbackLanguage] ?? fallbackCopy.spanish;
  const response = isOpening ? fallback.opening(persona) : fallback.followUp(userMessage);
  const tip = isOpening
    ? 'Tip: Respond with at least two sentences to keep the conversation going.'
    : 'Tip: Use connectors like "also" or "however" to sound more natural.';
  return `${response}\n\n${tip}`;
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
      content: `${scenario.starterPrompt} Do not translate into English in this first reply.`,
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
      content: `${userMessage}\n\nRespond following the scenario. Then add "Tip:" in English with a concrete correction.`,
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
