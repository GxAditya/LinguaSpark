import config from '../config/index.js';
import type { 
  GameType, 
  GameContent,
  ITranscriptionContent,
  IAudioJumbleContent,
  IImageInstinctContent,
  ITranslationMatchUpContent,
  ISecretWordContent,
  IWordDropContent,
  IConjugationContent,
  IContextConnectContent,
  ISyntaxScramblerContent,
  ITimeWarpContent,
} from '../models/GameSession.model.js';

type Difficulty = 'beginner' | 'intermediate' | 'advanced';

interface GenerateGameOptions {
  gameType: GameType;
  difficulty: Difficulty;
  language: string;
  targetLanguage: string;
  topic?: string;
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.1-8b-instant';
// Pollinations OpenAI-compatible endpoint: https://text.pollinations.ai/openai
const POLLINATIONS_CHAT_URL = 'https://text.pollinations.ai/openai';
// Pollinations Image Generation: https://image.pollinations.ai/prompt/{prompt}
const POLLINATIONS_IMAGE_URL = 'https://image.pollinations.ai/prompt';

// Helper function to generate Pollinations image URL
function generatePollinationsImageUrl(prompt: string, seed?: number): string {
  const encodedPrompt = encodeURIComponent(prompt);
  const seedParam = seed !== undefined ? `&seed=${seed}` : '';
  return `${POLLINATIONS_IMAGE_URL}/${encodedPrompt}?width=256&height=256&model=flux${seedParam}&nologo=true`;
}

// Helper function to enhance image prompt for better image generation
function enhanceImagePrompt(word: string, translation: string): string {
  return `simple icon of ${translation.toLowerCase()}, minimalist, clean background, flat design, colorful, cute illustration style`;
}

// Fallback game content for each game type
const FALLBACK_GAMES: Record<GameType, (opts: GenerateGameOptions) => GameContent> = {
  'transcription-station': (opts) => ({
    type: 'transcription-station',
    difficulty: opts.difficulty,
    language: opts.language,
    targetLanguage: opts.targetLanguage,
    rounds: [
      { audioText: 'Buenos días', correctAnswer: 'Buenos días', hint: 'Morning greeting' },
      { audioText: 'Gracias por tu ayuda', correctAnswer: 'Gracias por tu ayuda', hint: 'Thanking someone' },
      { audioText: 'Me llamo Juan', correctAnswer: 'Me llamo Juan', hint: 'Introducing yourself' },
      { audioText: '¿Cómo estás hoy?', correctAnswer: '¿Cómo estás hoy?', hint: 'Asking about wellbeing' },
      { audioText: 'El libro está en la mesa', correctAnswer: 'El libro está en la mesa', hint: 'Location of an object' },
    ],
  }),
  'audio-jumble': (opts) => ({
    type: 'audio-jumble',
    difficulty: opts.difficulty,
    language: opts.language,
    targetLanguage: opts.targetLanguage,
    rounds: [
      { sentence: 'Yo quiero un café', words: ['café', 'un', 'Yo', 'quiero'], correctOrder: [2, 3, 1, 0] },
      { sentence: 'Ella tiene dos gatos', words: ['gatos', 'tiene', 'dos', 'Ella'], correctOrder: [3, 1, 2, 0] },
      { sentence: 'Nosotros vamos a la playa', words: ['playa', 'a', 'la', 'vamos', 'Nosotros'], correctOrder: [4, 3, 1, 2, 0] },
    ],
  }),
  'image-instinct': (opts) => ({
    type: 'image-instinct',
    difficulty: opts.difficulty,
    language: opts.language,
    targetLanguage: opts.targetLanguage,
    rounds: [
      { 
        word: 'Perro', 
        translation: 'Dog', 
        correctImage: generatePollinationsImageUrl('simple icon of dog, minimalist, cute illustration', 1), 
        options: [
          generatePollinationsImageUrl('simple icon of dog, minimalist, cute illustration', 1),
          generatePollinationsImageUrl('simple icon of cat, minimalist, cute illustration', 2),
          generatePollinationsImageUrl('simple icon of bird, minimalist, cute illustration', 3),
          generatePollinationsImageUrl('simple icon of fish, minimalist, cute illustration', 4)
        ],
        isImageUrl: true,
        fallbackEmojis: ['🐕', '🐱', '🐦', '🐠']
      },
      { 
        word: 'Casa', 
        translation: 'House', 
        correctImage: generatePollinationsImageUrl('simple icon of house, minimalist, cute illustration', 5),
        options: [
          generatePollinationsImageUrl('simple icon of house, minimalist, cute illustration', 5),
          generatePollinationsImageUrl('simple icon of office building, minimalist, cute illustration', 6),
          generatePollinationsImageUrl('simple icon of school, minimalist, cute illustration', 7),
          generatePollinationsImageUrl('simple icon of hospital, minimalist, cute illustration', 8)
        ],
        isImageUrl: true,
        fallbackEmojis: ['🏠', '🏢', '🏫', '🏥']
      },
      { 
        word: 'Sol', 
        translation: 'Sun', 
        correctImage: generatePollinationsImageUrl('simple icon of sun, minimalist, bright yellow', 9),
        options: [
          generatePollinationsImageUrl('simple icon of sun, minimalist, bright yellow', 9),
          generatePollinationsImageUrl('simple icon of moon, minimalist, illustration', 10),
          generatePollinationsImageUrl('simple icon of star, minimalist, illustration', 11),
          generatePollinationsImageUrl('simple icon of rain cloud, minimalist, illustration', 12)
        ],
        isImageUrl: true,
        fallbackEmojis: ['☀️', '🌙', '⭐', '🌧️']
      },
      { 
        word: 'Árbol', 
        translation: 'Tree', 
        correctImage: generatePollinationsImageUrl('simple icon of green tree, minimalist, cute illustration', 13),
        options: [
          generatePollinationsImageUrl('simple icon of green tree, minimalist, cute illustration', 13),
          generatePollinationsImageUrl('simple icon of pink flower, minimalist, cute illustration', 14),
          generatePollinationsImageUrl('simple icon of cactus, minimalist, cute illustration', 15),
          generatePollinationsImageUrl('simple icon of mushroom, minimalist, cute illustration', 16)
        ],
        isImageUrl: true,
        fallbackEmojis: ['🌳', '🌸', '🌵', '🍄']
      },
    ],
  }),
  'translation-matchup': (opts) => ({
    type: 'translation-matchup',
    difficulty: opts.difficulty,
    language: opts.language,
    targetLanguage: opts.targetLanguage,
    pairs: [
      { original: 'Hola', translation: 'Hello' },
      { original: 'Agua', translation: 'Water' },
      { original: 'Pan', translation: 'Bread' },
      { original: 'Libro', translation: 'Book' },
      { original: 'Feliz', translation: 'Happy' },
      { original: 'Amigo', translation: 'Friend' },
    ],
  }),
  'secret-word-solver': (opts) => ({
    type: 'secret-word-solver',
    difficulty: opts.difficulty,
    language: opts.language,
    targetLanguage: opts.targetLanguage,
    words: [
      { word: 'MARIPOSA', hint: 'A colorful flying insect', category: 'Animals' },
      { word: 'BIBLIOTECA', hint: 'A place with many books', category: 'Places' },
      { word: 'COMPUTADORA', hint: 'Electronic device for work', category: 'Technology' },
      { word: 'CHOCOLATE', hint: 'Sweet brown treat', category: 'Food' },
    ],
  }),
  'word-drop-dash': (opts) => ({
    type: 'word-drop-dash',
    difficulty: opts.difficulty,
    language: opts.language,
    targetLanguage: opts.targetLanguage,
    rounds: [
      { words: [{ word: 'Gato', translation: 'Cat', emoji: '🐱' }, { word: 'Perro', translation: 'Dog', emoji: '🐕' }, { word: 'Pájaro', translation: 'Bird', emoji: '🐦' }], timeLimit: 30 },
      { words: [{ word: 'Rojo', translation: 'Red', emoji: '🔴' }, { word: 'Azul', translation: 'Blue', emoji: '🔵' }, { word: 'Verde', translation: 'Green', emoji: '🟢' }], timeLimit: 25 },
    ],
  }),
  'conjugation-coach': (opts) => ({
    type: 'conjugation-coach',
    difficulty: opts.difficulty,
    language: opts.language,
    targetLanguage: opts.targetLanguage,
    questions: [
      { sentence: 'Ayer, yo _____ un libro.', verb: 'leer', tense: 'past', subject: 'yo', options: ['leí', 'leo', 'leeré', 'leía'], correctIndex: 0, explanation: 'Past tense (pretérito) with "ayer"' },
      { sentence: 'Mañana, ella _____ a la tienda.', verb: 'ir', tense: 'future', subject: 'ella', options: ['fue', 'va', 'irá', 'iba'], correctIndex: 2, explanation: 'Future tense with "mañana"' },
      { sentence: 'Todos los días, nosotros _____ español.', verb: 'hablar', tense: 'present', subject: 'nosotros', options: ['hablamos', 'hablábamos', 'hablaremos', 'hablamos'], correctIndex: 0, explanation: 'Present tense with "todos los días"' },
      { sentence: 'En este momento, tú _____ la cena.', verb: 'preparar', tense: 'present progressive', subject: 'tú', options: ['preparas', 'estás preparando', 'preparaste', 'prepararás'], correctIndex: 1, explanation: 'Present progressive with "en este momento"' },
    ],
  }),
  'context-connect': (opts) => ({
    type: 'context-connect',
    difficulty: opts.difficulty,
    language: opts.language,
    targetLanguage: opts.targetLanguage,
    passages: [
      {
        text: 'María fue al _____ para comprar frutas. Ella necesitaba manzanas y _____. El vendedor era muy amable.',
        blanks: [
          { position: 0, correctWord: 'mercado', options: ['mercado', 'hospital', 'cine', 'parque'] },
          { position: 1, correctWord: 'naranjas', options: ['naranjas', 'libros', 'zapatos', 'coches'] },
        ],
      },
    ],
  }),
  'syntax-scrambler': (opts) => ({
    type: 'syntax-scrambler',
    difficulty: opts.difficulty,
    language: opts.language,
    targetLanguage: opts.targetLanguage,
    sentences: [
      { scrambled: ['perro', 'El', 'parque', 'el', 'corre', 'en'], correct: 'El perro corre en el parque', translation: 'The dog runs in the park' },
      { scrambled: ['gustan', 'libros', 'Me', 'los'], correct: 'Me gustan los libros', translation: 'I like books' },
      { scrambled: ['estudiante', 'La', 'mucho', 'estudia'], correct: 'La estudiante estudia mucho', translation: 'The student studies a lot' },
    ],
  }),
  'time-warp-tagger': (opts) => ({
    type: 'time-warp-tagger',
    difficulty: opts.difficulty,
    language: opts.language,
    targetLanguage: opts.targetLanguage,
    questions: [
      { sentence: 'El año pasado, mi familia _____ a México.', timeReference: 'El año pasado', verb: 'viajar', options: ['viaja', 'viajó', 'viajará', 'viajaba'], correctIndex: 1, explanation: 'Preterite tense for completed past actions' },
      { sentence: 'La próxima semana, yo _____ un examen.', timeReference: 'La próxima semana', verb: 'tener', options: ['tengo', 'tuve', 'tendré', 'tenía'], correctIndex: 2, explanation: 'Future tense for upcoming events' },
      { sentence: 'Ahora mismo, los niños _____ en el jardín.', timeReference: 'Ahora mismo', verb: 'jugar', options: ['juegan', 'jugaron', 'jugarán', 'están jugando'], correctIndex: 3, explanation: 'Present progressive for current actions' },
    ],
  }),
};

function getGamePrompt(gameType: GameType, difficulty: Difficulty, language: string, targetLanguage: string, topic?: string): string {
  const difficultyGuidelines = {
    beginner: 'Use simple, common vocabulary and short sentences. Focus on everyday words and basic grammar.',
    intermediate: 'Use moderate vocabulary with some complex sentences. Include common idioms and varied grammar.',
    advanced: 'Use sophisticated vocabulary, complex grammar structures, and nuanced expressions.',
  };

  const topicContext = topic ? `Focus the content around the topic: "${topic}".` : 'Choose varied topics like daily life, travel, food, nature, or culture.';

  const basePrompt = `You are a language learning game content generator. Generate content for a "${gameType}" game.
Target language: ${targetLanguage}
User's native language: ${language}
Difficulty: ${difficulty}
${difficultyGuidelines[difficulty]}
${topicContext}

IMPORTANT: Return ONLY valid JSON, no markdown, no explanations, no code blocks.`;

  const gameSpecificPrompts: Record<GameType, string> = {
    'transcription-station': `${basePrompt}

Generate 5 transcription exercises where users listen to audio and type what they hear.

Return JSON in this exact format:
{
  "rounds": [
    { "audioText": "${targetLanguage} phrase here", "correctAnswer": "${targetLanguage} phrase here", "hint": "English hint about the phrase" }
  ]
}`,
    'audio-jumble': `${basePrompt}

Generate 4 sentences where users must arrange scrambled words in correct order.

Return JSON in this exact format:
{
  "rounds": [
    { "sentence": "Correct complete sentence in ${targetLanguage}", "words": ["array", "of", "scrambled", "words"], "correctOrder": [2, 0, 3, 1] }
  ]
}
Note: correctOrder is the indices that rearrange words array into the correct sentence.`,
    'image-instinct': `${basePrompt}

Generate 5 vocabulary items for a visual word matching game. Each item needs a word, its translation, and 4 emoji options where one is the correct match.

Return JSON in this exact format:
{
  "rounds": [
    { 
      "word": "${targetLanguage} word", 
      "translation": "English translation", 
      "correctEmoji": "correct emoji that represents the word",
      "emojiOptions": ["emoji1", "emoji2", "emoji3", "emoji4"]
    }
  ]
}
Rules:
- Use common, easily recognizable emojis
- The correctEmoji must be included in emojiOptions
- Choose words that have clear visual representations
- Make the distractors similar but distinguishable (e.g., for "dog" use other animals)`,
    'translation-matchup': `${basePrompt}

Generate 8 word pairs for a memory matching game.

Return JSON in this exact format:
{
  "pairs": [
    { "original": "${targetLanguage} word", "translation": "English word" }
  ]
}`,
    'secret-word-solver': `${basePrompt}

Generate 5 words for a hangman-style guessing game.

Return JSON in this exact format:
{
  "words": [
    { "word": "${targetLanguage.toUpperCase()} WORD IN CAPS", "hint": "English hint to help guess", "category": "Category name" }
  ]
}
Use words that are 6-12 letters long.`,
    'word-drop-dash': `${basePrompt}

Generate 3 rounds of word-dropping game with 3-4 words each.

Return JSON in this exact format:
{
  "rounds": [
    { 
      "words": [
        { "word": "${targetLanguage} word", "translation": "English", "emoji": "relevant emoji" }
      ],
      "timeLimit": 30
    }
  ]
}`,
    'conjugation-coach': `${basePrompt}

Generate 5 verb conjugation questions with context clues.

Return JSON in this exact format:
{
  "questions": [
    { 
      "sentence": "${targetLanguage} sentence with _____ for blank", 
      "verb": "infinitive form", 
      "tense": "tense name",
      "subject": "subject pronoun",
      "options": ["option1", "option2", "option3", "option4"],
      "correctIndex": 0,
      "explanation": "Brief explanation why this is correct"
    }
  ]
}
Include time markers in sentences as context clues.`,
    'context-connect': `${basePrompt}

Generate 2 short passages with 2-3 blanks each for fill-in-the-blank exercises.

Return JSON in this exact format:
{
  "passages": [
    {
      "text": "Passage text with _____ for each blank",
      "blanks": [
        { "position": 0, "correctWord": "correct answer", "options": ["option1", "option2", "option3", "option4"] }
      ]
    }
  ]
}`,
    'syntax-scrambler': `${basePrompt}

Generate 4 sentences that users must unscramble.

Return JSON in this exact format:
{
  "sentences": [
    { "scrambled": ["array", "of", "scrambled", "words"], "correct": "Correct sentence in ${targetLanguage}", "translation": "English translation" }
  ]
}`,
    'time-warp-tagger': `${basePrompt}

Generate 5 sentences testing verb tense based on time references.

Return JSON in this exact format:
{
  "questions": [
    {
      "sentence": "${targetLanguage} sentence with _____ for blank and clear time reference",
      "timeReference": "the time word/phrase",
      "verb": "infinitive form",
      "options": ["option1", "option2", "option3", "option4"],
      "correctIndex": 0,
      "explanation": "Brief explanation of the tense rule"
    }
  ]
}`,
  };

  return gameSpecificPrompts[gameType];
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
      temperature: 0.7,
      max_tokens: 2000,
      messages,
    }),
  });

  const data = await response.json() as any;

  if (!response.ok) {
    throw new Error(data?.error?.message || 'Groq API error');
  }

  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('Empty response from Groq');
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
      temperature: 0.7,
      max_tokens: 2000,
      messages,
    }),
  });

  const data = await response.json() as any;

  if (!response.ok) {
    throw new Error(data?.error?.message || 'Pollinations API error');
  }

  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('Empty response from Pollinations');
  }

  return content.trim();
}

function parseGameContent(content: string, gameType: GameType): any {
  // Remove markdown code blocks if present
  let cleaned = content
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();

  // Try to extract JSON from the response
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  }

  return JSON.parse(cleaned);
}

// Transform image-instinct content to add Pollinations image URLs with emoji fallbacks
function transformImageInstinctContent(parsed: any): any {
  if (!parsed.rounds || !Array.isArray(parsed.rounds)) {
    return parsed;
  }

  // Generate a base seed from current timestamp for consistent images within a game
  const baseSeed = Date.now() % 10000;

  parsed.rounds = parsed.rounds.map((round: any, roundIndex: number) => {
    // Handle both new format (correctEmoji/emojiOptions) and old format (correctImage/options)
    const emojis = round.emojiOptions || round.options || [];
    const correctEmoji = round.correctEmoji || round.correctImage;

    // Generate image URLs for each option
    const imageOptions = emojis.map((emoji: string, optionIndex: number) => {
      // Create a descriptive prompt based on what the emoji represents
      const emojiDescription = getEmojiDescription(emoji);
      const seed = baseSeed + (roundIndex * 10) + optionIndex;
      return generatePollinationsImageUrl(enhanceImagePrompt(emoji, emojiDescription), seed);
    });

    // Find the correct image URL
    const correctIndex = emojis.indexOf(correctEmoji);
    const correctImageUrl = correctIndex >= 0 ? imageOptions[correctIndex] : imageOptions[0];

    return {
      word: round.word,
      translation: round.translation,
      correctImage: correctImageUrl,
      options: imageOptions,
      isImageUrl: true,
      fallbackEmojis: emojis,
    };
  });

  return parsed;
}

// Helper to get a description for common emojis
function getEmojiDescription(emoji: string): string {
  const emojiDescriptions: Record<string, string> = {
    // Animals
    '🐕': 'dog', '🐶': 'dog', '🐩': 'poodle',
    '🐱': 'cat', '🐈': 'cat',
    '🐦': 'bird', '🐤': 'chick', '🐧': 'penguin',
    '🐠': 'fish', '🐟': 'fish', '🐡': 'pufferfish',
    '🐴': 'horse', '🦁': 'lion', '🐯': 'tiger',
    '🐘': 'elephant', '🐻': 'bear', '🐼': 'panda',
    '🐰': 'rabbit', '🐭': 'mouse', '🐹': 'hamster',
    '🦊': 'fox', '🐺': 'wolf', '🦝': 'raccoon',
    '🐮': 'cow', '🐷': 'pig', '🐔': 'chicken',
    '🦆': 'duck', '🦅': 'eagle', '🦉': 'owl',
    '🦋': 'butterfly', '🐝': 'bee', '🐞': 'ladybug',
    '🐢': 'turtle', '🐍': 'snake', '🦎': 'lizard',
    '🦈': 'shark', '🐳': 'whale', '🐙': 'octopus',
    
    // Buildings & Places
    '🏠': 'house', '🏡': 'house with garden',
    '🏢': 'office building', '🏣': 'post office',
    '🏫': 'school', '🏥': 'hospital',
    '🏪': 'convenience store', '🏨': 'hotel',
    '⛪': 'church', '🕌': 'mosque',
    '🏰': 'castle', '🏯': 'japanese castle',
    
    // Nature & Weather
    '☀️': 'sun', '🌙': 'moon', '⭐': 'star',
    '🌧️': 'rain', '☁️': 'cloud', '⛈️': 'storm',
    '🌈': 'rainbow', '❄️': 'snow', '🔥': 'fire',
    '🌳': 'tree', '🌲': 'evergreen tree', '🌴': 'palm tree',
    '🌸': 'cherry blossom', '🌺': 'flower', '🌻': 'sunflower',
    '🌵': 'cactus', '🍄': 'mushroom', '🍀': 'clover',
    '🌊': 'wave', '⛰️': 'mountain', '🏔️': 'snow mountain',
    
    // Food
    '🍎': 'apple', '🍊': 'orange', '🍋': 'lemon',
    '🍌': 'banana', '🍇': 'grapes', '🍓': 'strawberry',
    '🍕': 'pizza', '🍔': 'burger', '🌭': 'hot dog',
    '🍞': 'bread', '🧀': 'cheese', '🥚': 'egg',
    '🍰': 'cake', '🍪': 'cookie', '🍩': 'donut',
    '☕': 'coffee', '🍵': 'tea', '🥤': 'drink',
    
    // Objects
    '📚': 'books', '📖': 'book', '✏️': 'pencil',
    '💻': 'laptop', '📱': 'phone', '⌚': 'watch',
    '🚗': 'car', '🚌': 'bus', '✈️': 'airplane',
    '🚲': 'bicycle', '🛵': 'scooter', '🚂': 'train',
    '⚽': 'soccer ball', '🏀': 'basketball', '🎾': 'tennis',
    '🎸': 'guitar', '🎹': 'piano', '🥁': 'drums',
  };

  return emojiDescriptions[emoji] || emoji;
}

function validateGameContent(parsed: any, gameType: GameType): boolean {
  switch (gameType) {
    case 'transcription-station':
      return Array.isArray(parsed.rounds) && parsed.rounds.length > 0 &&
        parsed.rounds.every((r: any) => r.audioText && r.correctAnswer);
    case 'audio-jumble':
      return Array.isArray(parsed.rounds) && parsed.rounds.length > 0 &&
        parsed.rounds.every((r: any) => r.sentence && Array.isArray(r.words) && Array.isArray(r.correctOrder));
    case 'image-instinct':
      return Array.isArray(parsed.rounds) && parsed.rounds.length > 0 &&
        parsed.rounds.every((r: any) => 
          r.word && r.translation && 
          // Support both new format (correctEmoji/emojiOptions) and old format (correctImage/options)
          ((r.correctEmoji && Array.isArray(r.emojiOptions)) || (r.correctImage && Array.isArray(r.options)))
        );
    case 'translation-matchup':
      return Array.isArray(parsed.pairs) && parsed.pairs.length > 0 &&
        parsed.pairs.every((p: any) => p.original && p.translation);
    case 'secret-word-solver':
      return Array.isArray(parsed.words) && parsed.words.length > 0 &&
        parsed.words.every((w: any) => w.word && w.hint);
    case 'word-drop-dash':
      return Array.isArray(parsed.rounds) && parsed.rounds.length > 0 &&
        parsed.rounds.every((r: any) => Array.isArray(r.words) && r.words.length > 0);
    case 'conjugation-coach':
      return Array.isArray(parsed.questions) && parsed.questions.length > 0 &&
        parsed.questions.every((q: any) => q.sentence && Array.isArray(q.options) && typeof q.correctIndex === 'number');
    case 'context-connect':
      return Array.isArray(parsed.passages) && parsed.passages.length > 0 &&
        parsed.passages.every((p: any) => p.text && Array.isArray(p.blanks));
    case 'syntax-scrambler':
      return Array.isArray(parsed.sentences) && parsed.sentences.length > 0 &&
        parsed.sentences.every((s: any) => Array.isArray(s.scrambled) && s.correct);
    case 'time-warp-tagger':
      return Array.isArray(parsed.questions) && parsed.questions.length > 0 &&
        parsed.questions.every((q: any) => q.sentence && q.timeReference && Array.isArray(q.options));
    default:
      return false;
  }
}

export async function generateGameContent(options: GenerateGameOptions): Promise<{
  content: GameContent;
  usedFallback: boolean;
}> {
  const { gameType, difficulty, language, targetLanguage, topic } = options;

  try {
    const prompt = getGamePrompt(gameType, difficulty, language, targetLanguage, topic);
    const messages: ChatMessage[] = [
      { role: 'system', content: 'You are a helpful assistant that generates language learning game content. Always respond with valid JSON only.' },
      { role: 'user', content: prompt },
    ];

    let response: string;
    // For image-instinct, use Pollinations only (for image generation compatibility)
    // For all other games, use Groq as primary with Pollinations as fallback
    if (gameType === 'image-instinct') {
      try {
        response = await callPollinations(messages);
      } catch (pollinationsError) {
        console.error('Pollinations API failed for image-instinct:', pollinationsError);
        throw pollinationsError; // Will fall through to fallback content
      }
    } else {
      // Use Groq as primary, Pollinations as fallback for all other games
      try {
        response = await callGroq(messages);
      } catch (groqError) {
        console.error('Groq API failed, trying Pollinations:', groqError);
        response = await callPollinations(messages);
      }
    }

    let parsed = parseGameContent(response, gameType);

    if (!validateGameContent(parsed, gameType)) {
      throw new Error('Generated content failed validation');
    }

    // Transform image-instinct content to add Pollinations image URLs
    if (gameType === 'image-instinct') {
      parsed = transformImageInstinctContent(parsed);
    }

    // Construct the full GameContent object
    const baseContent = {
      type: gameType,
      difficulty,
      language,
      targetLanguage,
    };

    return {
      content: { ...baseContent, ...parsed } as GameContent,
      usedFallback: false,
    };
  } catch (error) {
    console.error('Game generation failed, using fallback:', error);
    return {
      content: FALLBACK_GAMES[gameType](options),
      usedFallback: true,
    };
  }
}

export function calculateMaxScore(content: GameContent): number {
  const pointsPerItem = 10;

  switch (content.type) {
    case 'transcription-station':
      return content.rounds.length * pointsPerItem;
    case 'audio-jumble':
      return content.rounds.length * pointsPerItem;
    case 'image-instinct':
      return content.rounds.length * pointsPerItem;
    case 'translation-matchup':
      return content.pairs.length * pointsPerItem;
    case 'secret-word-solver':
      return content.words.length * pointsPerItem;
    case 'word-drop-dash':
      return content.rounds.reduce((sum, r) => sum + r.words.length * pointsPerItem, 0);
    case 'conjugation-coach':
      return content.questions.length * pointsPerItem;
    case 'context-connect':
      return content.passages.reduce((sum, p) => sum + p.blanks.length * pointsPerItem, 0);
    case 'syntax-scrambler':
      return content.sentences.length * pointsPerItem;
    case 'time-warp-tagger':
      return content.questions.length * pointsPerItem;
    default:
      return 100;
  }
}

export function calculateTotalRounds(content: GameContent): number {
  switch (content.type) {
    case 'transcription-station':
      return content.rounds.length;
    case 'audio-jumble':
      return content.rounds.length;
    case 'image-instinct':
      return content.rounds.length;
    case 'translation-matchup':
      return 1; // It's a single matching round
    case 'secret-word-solver':
      return content.words.length;
    case 'word-drop-dash':
      return content.rounds.length;
    case 'conjugation-coach':
      return content.questions.length;
    case 'context-connect':
      return content.passages.length;
    case 'syntax-scrambler':
      return content.sentences.length;
    case 'time-warp-tagger':
      return content.questions.length;
    default:
      return 1;
  }
}
