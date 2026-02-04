import config from '../config/index.js';
import { pollinationsApi } from './pollinations.api.service.js';
import { contentCache } from './content.cache.service.js';
import type {
  GameType,
  GameContent,
  ITranscriptionContent,
  IAudioJumbleContent,

  ITranslationMatchUpContent,
  ISecretWordContent,
  IWordDropContent,
  IConjugationContent,
  IContextConnectContent,
  ISyntaxScramblerContent,
} from '../models/GameSession.model.js';

type Difficulty = 'beginner' | 'intermediate' | 'advanced';

interface GenerateGameOptions {
  gameType: GameType;
  difficulty: Difficulty;
  language: string;
  targetLanguage: string;
  topic?: string;
  forceNew?: boolean;
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.1-8b-instant';

type SupportedLearningLanguage =
  | 'spanish'
  | 'french'
  | 'hindi'
  | 'mandarin'
  | 'arabic'
  | 'bengali'
  | 'portuguese'
  | 'russian'
  | 'japanese';

const SUPPORTED_LEARNING_LANGUAGE_SET = new Set<SupportedLearningLanguage>([
  'spanish',
  'french',
  'hindi',
  'mandarin',
  'arabic',
  'bengali',
  'portuguese',
  'russian',
  'japanese',
]);

function resolveSupportedLearningLanguage(value: string): SupportedLearningLanguage {
  const normalized = value.trim().toLowerCase();
  if (SUPPORTED_LEARNING_LANGUAGE_SET.has(normalized as SupportedLearningLanguage)) {
    return normalized as SupportedLearningLanguage;
  }
  return 'spanish';
}

const TRANSLATION_MATCHUP_FALLBACK_PAIRS: Record<SupportedLearningLanguage, Array<{ original: string; translation: string }>> = {
  spanish: [
    { original: 'Hola', translation: 'Hello' },
    { original: 'Agua', translation: 'Water' },
    { original: 'Pan', translation: 'Bread' },
    { original: 'Libro', translation: 'Book' },
    { original: 'Feliz', translation: 'Happy' },
    { original: 'Amigo', translation: 'Friend' },
  ],
  french: [
    { original: 'Bonjour', translation: 'Hello' },
    { original: 'Eau', translation: 'Water' },
    { original: 'Pain', translation: 'Bread' },
    { original: 'Livre', translation: 'Book' },
    { original: 'Heureux', translation: 'Happy' },
    { original: 'Ami', translation: 'Friend' },
  ],
  hindi: [
    { original: 'नमस्ते', translation: 'Hello' },
    { original: 'पानी', translation: 'Water' },
    { original: 'रोटी', translation: 'Bread' },
    { original: 'किताब', translation: 'Book' },
    { original: 'खुश', translation: 'Happy' },
    { original: 'दोस्त', translation: 'Friend' },
  ],
  mandarin: [
    { original: '你好', translation: 'Hello' },
    { original: '水', translation: 'Water' },
    { original: '面包', translation: 'Bread' },
    { original: '书', translation: 'Book' },
    { original: '高兴', translation: 'Happy' },
    { original: '朋友', translation: 'Friend' },
  ],
  arabic: [
    { original: 'مرحباً', translation: 'Hello' },
    { original: 'ماء', translation: 'Water' },
    { original: 'خبز', translation: 'Bread' },
    { original: 'كتاب', translation: 'Book' },
    { original: 'سعيد', translation: 'Happy' },
    { original: 'صديق', translation: 'Friend' },
  ],
  bengali: [
    { original: 'নমস্কার', translation: 'Hello' },
    { original: 'পানি', translation: 'Water' },
    { original: 'রুটি', translation: 'Bread' },
    { original: 'বই', translation: 'Book' },
    { original: 'খুশি', translation: 'Happy' },
    { original: 'বন্ধু', translation: 'Friend' },
  ],
  portuguese: [
    { original: 'Olá', translation: 'Hello' },
    { original: 'Água', translation: 'Water' },
    { original: 'Pão', translation: 'Bread' },
    { original: 'Livro', translation: 'Book' },
    { original: 'Feliz', translation: 'Happy' },
    { original: 'Amigo', translation: 'Friend' },
  ],
  russian: [
    { original: 'Привет', translation: 'Hello' },
    { original: 'Вода', translation: 'Water' },
    { original: 'Хлеб', translation: 'Bread' },
    { original: 'Книга', translation: 'Book' },
    { original: 'Счастливый', translation: 'Happy' },
    { original: 'Друг', translation: 'Friend' },
  ],
  japanese: [
    { original: 'こんにちは', translation: 'Hello' },
    { original: '水', translation: 'Water' },
    { original: 'パン', translation: 'Bread' },
    { original: '本', translation: 'Book' },
    { original: 'うれしい', translation: 'Happy' },
    { original: '友達', translation: 'Friend' },
  ],
};

function getTranslationMatchupFallbackPairs(targetLanguage: string): Array<{ original: string; translation: string }> {
  const resolved = resolveSupportedLearningLanguage(targetLanguage);
  return TRANSLATION_MATCHUP_FALLBACK_PAIRS[resolved] ?? TRANSLATION_MATCHUP_FALLBACK_PAIRS.spanish;
}

const SECRET_WORD_FALLBACK_POOL: Record<SupportedLearningLanguage, Array<{ word: string; hint: string; category: string }>> = {
  spanish: [
    { word: 'MARIPOSA', hint: 'A colorful flying insect', category: 'Animals' },
    { word: 'BIBLIOTECA', hint: 'A place with many books', category: 'Places' },
    { word: 'COMPUTADORA', hint: 'Electronic device for work', category: 'Technology' },
    { word: 'CHOCOLATE', hint: 'Sweet brown treat', category: 'Food' },
    { word: 'AVENTURA', hint: 'An exciting journey', category: 'Activities' },
    { word: 'AMISTAD', hint: 'A bond between friends', category: 'Feelings' },
    { word: 'MONTAÑA', hint: 'A tall natural landform', category: 'Nature' },
    { word: 'JARDIN', hint: 'A place with plants and flowers', category: 'Places' },
  ],
  french: [
    { word: 'PAPILLON', hint: 'A colorful flying insect', category: 'Animals' },
    { word: 'BIBLIOTHEQUE', hint: 'A place with many books', category: 'Places' },
    { word: 'ORDINATEUR', hint: 'Electronic device for work', category: 'Technology' },
    { word: 'CHOCOLAT', hint: 'Sweet brown treat', category: 'Food' },
    { word: 'AVENTURE', hint: 'An exciting journey', category: 'Activities' },
    { word: 'FAMILLE', hint: 'Your closest relatives', category: 'People' },
    { word: 'MONTAGNE', hint: 'A tall natural landform', category: 'Nature' },
    { word: 'JARDIN', hint: 'A place with plants and flowers', category: 'Places' },
  ],
  hindi: [
    { word: 'घर', hint: 'A place where you live', category: 'Places' },
    { word: 'मन', hint: 'Mind or heart', category: 'Feelings' },
    { word: 'वन', hint: 'A forest', category: 'Nature' },
    { word: 'नगर', hint: 'A city or town', category: 'Places' },
    { word: 'कमल', hint: 'A lotus flower', category: 'Nature' },
    { word: 'पथ', hint: 'A path or way', category: 'Places' },
    { word: 'फल', hint: 'A fruit', category: 'Food' },
    { word: 'दल', hint: 'A group or team', category: 'People' },
  ],
  mandarin: [
    { word: '喜欢', hint: 'To like something', category: 'Feelings' },
    { word: '今天', hint: 'The current day', category: 'Time' },
    { word: '明天', hint: 'The day after today', category: 'Time' },
    { word: '昨天', hint: 'The day before today', category: 'Time' },
    { word: '听说', hint: 'To hear and say', category: 'Communication' },
    { word: '去看', hint: 'To go and see', category: 'Actions' },
    { word: '吃喝', hint: 'Food and drink', category: 'Food' },
    { word: '他说', hint: 'He said', category: 'Communication' },
  ],
  arabic: [
    { word: 'كتاب', hint: 'Something you read', category: 'Objects' },
    { word: 'قلم', hint: 'Used for writing', category: 'Objects' },
    { word: 'شمس', hint: 'The bright star in the sky', category: 'Nature' },
    { word: 'قمر', hint: 'Seen at night in the sky', category: 'Nature' },
    { word: 'بحر', hint: 'A large body of water', category: 'Nature' },
    { word: 'طريق', hint: 'A road or path', category: 'Places' },
    { word: 'مطر', hint: 'Water falling from the sky', category: 'Weather' },
    { word: 'نهر', hint: 'A flowing body of water', category: 'Nature' },
  ],
  bengali: [
    { word: 'মন', hint: 'Mind or heart', category: 'Feelings' },
    { word: 'বন', hint: 'A forest', category: 'Nature' },
    { word: 'পথ', hint: 'A path or way', category: 'Places' },
    { word: 'ঘর', hint: 'A place where you live', category: 'Places' },
    { word: 'কল', hint: 'A plantain or banana', category: 'Food' },
    { word: 'দল', hint: 'A group or team', category: 'People' },
    { word: 'বল', hint: 'A ball or strength', category: 'Objects' },
    { word: 'চল', hint: 'To move or go', category: 'Actions' },
  ],
  portuguese: [
    { word: 'BORBOLETA', hint: 'A colorful flying insect', category: 'Animals' },
    { word: 'BIBLIOTECA', hint: 'A place with many books', category: 'Places' },
    { word: 'COMPUTADOR', hint: 'Electronic device for work', category: 'Technology' },
    { word: 'CHOCOLATE', hint: 'Sweet brown treat', category: 'Food' },
    { word: 'AVENTURA', hint: 'An exciting journey', category: 'Activities' },
    { word: 'FAMILIA', hint: 'Your closest relatives', category: 'People' },
    { word: 'MONTANHA', hint: 'A tall natural landform', category: 'Nature' },
    { word: 'JARDIM', hint: 'A place with plants and flowers', category: 'Places' },
  ],
  russian: [
    { word: 'БАБОЧКА', hint: 'A colorful flying insect', category: 'Animals' },
    { word: 'БИБЛИОТЕКА', hint: 'A place with many books', category: 'Places' },
    { word: 'КОМПЬЮТЕР', hint: 'Electronic device for work', category: 'Technology' },
    { word: 'ШОКОЛАД', hint: 'Sweet brown treat', category: 'Food' },
    { word: 'ПУТЕШЕСТВИЕ', hint: 'An exciting journey', category: 'Activities' },
    { word: 'СЕМЬЯ', hint: 'Your closest relatives', category: 'People' },
    { word: 'ПРИРОДА', hint: 'The natural world', category: 'Nature' },
    { word: 'МУЗЫКА', hint: 'Organized sound art', category: 'Arts' },
  ],
  japanese: [
    { word: 'さくら', hint: 'A famous spring flower', category: 'Nature' },
    { word: 'ひこうき', hint: 'It flies in the sky', category: 'Travel' },
    { word: 'ほし', hint: 'A bright light in the night sky', category: 'Nature' },
    { word: 'やま', hint: 'A tall natural landform', category: 'Nature' },
    { word: 'うみ', hint: 'A large body of water', category: 'Nature' },
    { word: 'くるま', hint: 'A common vehicle', category: 'Travel' },
    { word: 'さかな', hint: 'It swims in water', category: 'Animals' },
    { word: 'ねこ', hint: 'A common pet', category: 'Animals' },
  ],
};

function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getSecretWordFallbackWords(targetLanguage: string, count: number = 5): Array<{ word: string; hint: string; category: string }> {
  const resolved = resolveSupportedLearningLanguage(targetLanguage);
  const pool = SECRET_WORD_FALLBACK_POOL[resolved] ?? SECRET_WORD_FALLBACK_POOL.spanish;
  const selection = shuffleArray(pool).slice(0, Math.min(count, pool.length));
  return selection.length > 0 ? selection : SECRET_WORD_FALLBACK_POOL.spanish.slice(0, count);
}

const WORD_DROP_FALLBACK_POOL: Record<SupportedLearningLanguage, Array<{ word: string; translation: string; emoji: string }>> = {
  spanish: [
    { word: 'Gato', translation: 'Cat', emoji: '🐱' },
    { word: 'Perro', translation: 'Dog', emoji: '🐕' },
    { word: 'Pájaro', translation: 'Bird', emoji: '🐦' },
    { word: 'Rojo', translation: 'Red', emoji: '🔴' },
    { word: 'Azul', translation: 'Blue', emoji: '🔵' },
    { word: 'Verde', translation: 'Green', emoji: '🟢' },
    { word: 'Casa', translation: 'House', emoji: '🏠' },
    { word: 'Libro', translation: 'Book', emoji: '📘' },
    { word: 'Agua', translation: 'Water', emoji: '💧' },
  ],
  french: [
    { word: 'Chat', translation: 'Cat', emoji: '🐱' },
    { word: 'Chien', translation: 'Dog', emoji: '🐕' },
    { word: 'Oiseau', translation: 'Bird', emoji: '🐦' },
    { word: 'Rouge', translation: 'Red', emoji: '🔴' },
    { word: 'Bleu', translation: 'Blue', emoji: '🔵' },
    { word: 'Vert', translation: 'Green', emoji: '🟢' },
    { word: 'Maison', translation: 'House', emoji: '🏠' },
    { word: 'Livre', translation: 'Book', emoji: '📘' },
    { word: 'Eau', translation: 'Water', emoji: '💧' },
  ],
  hindi: [
    { word: 'बिल्ली', translation: 'Cat', emoji: '🐱' },
    { word: 'कुत्ता', translation: 'Dog', emoji: '🐕' },
    { word: 'पक्षी', translation: 'Bird', emoji: '🐦' },
    { word: 'लाल', translation: 'Red', emoji: '🔴' },
    { word: 'नीला', translation: 'Blue', emoji: '🔵' },
    { word: 'हरा', translation: 'Green', emoji: '🟢' },
    { word: 'घर', translation: 'House', emoji: '🏠' },
    { word: 'किताब', translation: 'Book', emoji: '📘' },
    { word: 'पानी', translation: 'Water', emoji: '💧' },
  ],
  mandarin: [
    { word: '猫', translation: 'Cat', emoji: '🐱' },
    { word: '狗', translation: 'Dog', emoji: '🐕' },
    { word: '鸟', translation: 'Bird', emoji: '🐦' },
    { word: '红色', translation: 'Red', emoji: '🔴' },
    { word: '蓝色', translation: 'Blue', emoji: '🔵' },
    { word: '绿色', translation: 'Green', emoji: '🟢' },
    { word: '家', translation: 'House', emoji: '🏠' },
    { word: '书', translation: 'Book', emoji: '📘' },
    { word: '水', translation: 'Water', emoji: '💧' },
  ],
  arabic: [
    { word: 'قط', translation: 'Cat', emoji: '🐱' },
    { word: 'كلب', translation: 'Dog', emoji: '🐕' },
    { word: 'طائر', translation: 'Bird', emoji: '🐦' },
    { word: 'أحمر', translation: 'Red', emoji: '🔴' },
    { word: 'أزرق', translation: 'Blue', emoji: '🔵' },
    { word: 'أخضر', translation: 'Green', emoji: '🟢' },
    { word: 'بيت', translation: 'House', emoji: '🏠' },
    { word: 'كتاب', translation: 'Book', emoji: '📘' },
    { word: 'ماء', translation: 'Water', emoji: '💧' },
  ],
  bengali: [
    { word: 'বিড়াল', translation: 'Cat', emoji: '🐱' },
    { word: 'কুকুর', translation: 'Dog', emoji: '🐕' },
    { word: 'পাখি', translation: 'Bird', emoji: '🐦' },
    { word: 'লাল', translation: 'Red', emoji: '🔴' },
    { word: 'নীল', translation: 'Blue', emoji: '🔵' },
    { word: 'সবুজ', translation: 'Green', emoji: '🟢' },
    { word: 'বাড়ি', translation: 'House', emoji: '🏠' },
    { word: 'বই', translation: 'Book', emoji: '📘' },
    { word: 'পানি', translation: 'Water', emoji: '💧' },
  ],
  portuguese: [
    { word: 'Gato', translation: 'Cat', emoji: '🐱' },
    { word: 'Cachorro', translation: 'Dog', emoji: '🐕' },
    { word: 'Pássaro', translation: 'Bird', emoji: '🐦' },
    { word: 'Vermelho', translation: 'Red', emoji: '🔴' },
    { word: 'Azul', translation: 'Blue', emoji: '🔵' },
    { word: 'Verde', translation: 'Green', emoji: '🟢' },
    { word: 'Casa', translation: 'House', emoji: '🏠' },
    { word: 'Livro', translation: 'Book', emoji: '📘' },
    { word: 'Água', translation: 'Water', emoji: '💧' },
  ],
  russian: [
    { word: 'КОТ', translation: 'Cat', emoji: '🐱' },
    { word: 'СОБАКА', translation: 'Dog', emoji: '🐕' },
    { word: 'ПТИЦА', translation: 'Bird', emoji: '🐦' },
    { word: 'КРАСНЫЙ', translation: 'Red', emoji: '🔴' },
    { word: 'СИНИЙ', translation: 'Blue', emoji: '🔵' },
    { word: 'ЗЕЛЕНЫЙ', translation: 'Green', emoji: '🟢' },
    { word: 'ДОМ', translation: 'House', emoji: '🏠' },
    { word: 'КНИГА', translation: 'Book', emoji: '📘' },
    { word: 'ВОДА', translation: 'Water', emoji: '💧' },
  ],
  japanese: [
    { word: 'ねこ', translation: 'Cat', emoji: '🐱' },
    { word: 'いぬ', translation: 'Dog', emoji: '🐕' },
    { word: 'とり', translation: 'Bird', emoji: '🐦' },
    { word: 'あか', translation: 'Red', emoji: '🔴' },
    { word: 'あお', translation: 'Blue', emoji: '🔵' },
    { word: 'みどり', translation: 'Green', emoji: '🟢' },
    { word: 'いえ', translation: 'House', emoji: '🏠' },
    { word: 'ほん', translation: 'Book', emoji: '📘' },
    { word: 'みず', translation: 'Water', emoji: '💧' },
  ],
};

function getWordDropFallbackRounds(targetLanguage: string): Array<{ words: Array<{ word: string; translation: string; emoji: string }>; timeLimit: number }> {
  const resolved = resolveSupportedLearningLanguage(targetLanguage);
  const pool = shuffleArray(WORD_DROP_FALLBACK_POOL[resolved] ?? WORD_DROP_FALLBACK_POOL.spanish);
  const rounds = [];
  for (let i = 0; i < pool.length; i += 3) {
    const group = pool.slice(i, i + 3);
    if (group.length === 0) continue;
    rounds.push({ words: group, timeLimit: 30 - Math.min(10, rounds.length * 5) });
  }
  return rounds.length > 0 ? rounds : [{ words: WORD_DROP_FALLBACK_POOL.spanish.slice(0, 3), timeLimit: 30 }];
}

const CONTEXT_CONNECT_FALLBACK_PASSAGES: Record<SupportedLearningLanguage, Array<{ text: string; blanks: Array<{ position: number; correctWord: string; options: string[] }> }>> = {
  spanish: [
    {
      text: 'María fue al _____ para comprar frutas. Ella necesitaba manzanas y _____.',
      blanks: [
        { position: 0, correctWord: 'mercado', options: ['mercado', 'hospital', 'cine', 'parque'] },
        { position: 1, correctWord: 'naranjas', options: ['naranjas', 'libros', 'zapatos', 'coches'] },
      ],
    },
  ],
  french: [
    {
      text: 'Luc va au _____ pour acheter des fruits. Il prend des pommes et des _____.',
      blanks: [
        { position: 0, correctWord: 'marché', options: ['marché', 'hôpital', 'cinéma', 'parc'] },
        { position: 1, correctWord: 'oranges', options: ['oranges', 'livres', 'chaussures', 'voitures'] },
      ],
    },
  ],
  hindi: [
    {
      text: 'राहुल _____ जाता है और वह _____ खरीदता है।',
      blanks: [
        { position: 0, correctWord: 'बाज़ार', options: ['बाज़ार', 'अस्पताल', 'स्कूल', 'पार्क'] },
        { position: 1, correctWord: 'फल', options: ['फल', 'किताबें', 'जूते', 'खिलौने'] },
      ],
    },
  ],
  mandarin: [
    {
      text: '小明去_____买_____。',
      blanks: [
        { position: 0, correctWord: '市场', options: ['市场', '医院', '学校', '公园'] },
        { position: 1, correctWord: '水果', options: ['水果', '书', '鞋子', '玩具'] },
      ],
    },
  ],
  arabic: [
    {
      text: 'ذهبت سارة إلى _____ لشراء _____.',
      blanks: [
        { position: 0, correctWord: 'السوق', options: ['السوق', 'المستشفى', 'المدرسة', 'الحديقة'] },
        { position: 1, correctWord: 'الفواكه', options: ['الفواكه', 'الكتب', 'الأحذية', 'الألعاب'] },
      ],
    },
  ],
  bengali: [
    {
      text: 'রিমা _____ যায় এবং সে _____ কেনে।',
      blanks: [
        { position: 0, correctWord: 'বাজারে', options: ['বাজারে', 'হাসপাতালে', 'স্কুলে', 'পার্কে'] },
        { position: 1, correctWord: 'ফল', options: ['ফল', 'বই', 'জুতো', 'খেলনা'] },
      ],
    },
  ],
  portuguese: [
    {
      text: 'João vai ao _____ para comprar _____.',
      blanks: [
        { position: 0, correctWord: 'mercado', options: ['mercado', 'hospital', 'cinema', 'parque'] },
        { position: 1, correctWord: 'frutas', options: ['frutas', 'livros', 'sapatos', 'carros'] },
      ],
    },
  ],
  russian: [
    {
      text: 'Ольга пошла в _____ купить _____.',
      blanks: [
        { position: 0, correctWord: 'магазин', options: ['магазин', 'больницу', 'школу', 'парк'] },
        { position: 1, correctWord: 'фрукты', options: ['фрукты', 'книги', 'обувь', 'игрушки'] },
      ],
    },
  ],
  japanese: [
    {
      text: 'ユウタは_____へ行って_____を買います。',
      blanks: [
        { position: 0, correctWord: '市場', options: ['市場', '病院', '学校', '公園'] },
        { position: 1, correctWord: '果物', options: ['果物', '本', '靴', 'おもちゃ'] },
      ],
    },
  ],
};

function getContextConnectFallbackPassages(targetLanguage: string): Array<{ text: string; blanks: Array<{ position: number; correctWord: string; options: string[] }> }> {
  const resolved = resolveSupportedLearningLanguage(targetLanguage);
  return CONTEXT_CONNECT_FALLBACK_PASSAGES[resolved] ?? CONTEXT_CONNECT_FALLBACK_PASSAGES.spanish;
}



// Per-language fallback content (ensures language selection works even if generation fails)
// Fallback game content for each game type
const FALLBACK_GAMES: Record<GameType, (opts: GenerateGameOptions) => Promise<GameContent> | GameContent> = {
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

  'translation-matchup': (opts) => ({
    type: 'translation-matchup',
    difficulty: opts.difficulty,
    language: opts.language,
    targetLanguage: opts.targetLanguage,
    pairs: getTranslationMatchupFallbackPairs(opts.targetLanguage),
  }),
  'secret-word-solver': (opts) => ({
    type: 'secret-word-solver',
    difficulty: opts.difficulty,
    language: opts.language,
    targetLanguage: opts.targetLanguage,
    words: getSecretWordFallbackWords(opts.targetLanguage, 5),
  }),
  'word-drop-dash': (opts) => ({
    type: 'word-drop-dash',
    difficulty: opts.difficulty,
    language: opts.language,
    targetLanguage: opts.targetLanguage,
    rounds: getWordDropFallbackRounds(opts.targetLanguage),
  }),
  'conjugation-coach': (opts) => ({
    type: 'conjugation-coach',
    difficulty: opts.difficulty,
    language: opts.language,
    targetLanguage: opts.targetLanguage,
    questions: [
      { sentence: 'Ayer, yo leí un libro.', blankedSentence: 'Ayer, yo _____ un libro.', answer: 'leí', verb: 'leer', tense: 'past', subject: 'yo', options: ['leí', 'leo', 'leeré', 'leía'], correctIndex: 0, explanation: 'Past tense (pretérito) with "ayer"' },
      { sentence: 'Mañana, ella irá a la tienda.', blankedSentence: 'Mañana, ella _____ a la tienda.', answer: 'irá', verb: 'ir', tense: 'future', subject: 'ella', options: ['fue', 'va', 'irá', 'iba'], correctIndex: 2, explanation: 'Future tense with "mañana"' },
      { sentence: 'Todos los días, nosotros hablamos español.', blankedSentence: 'Todos los días, nosotros _____ español.', answer: 'hablamos', verb: 'hablar', tense: 'present', subject: 'nosotros', options: ['hablamos', 'hablábamos', 'hablaremos', 'hablamos'], correctIndex: 0, explanation: 'Present tense with "todos los días"' },
      { sentence: 'En este momento, tú estás preparando la cena.', blankedSentence: 'En este momento, tú _____ la cena.', answer: 'estás preparando', verb: 'preparar', tense: 'present progressive', subject: 'tú', options: ['preparas', 'estás preparando', 'preparaste', 'prepararás'], correctIndex: 1, explanation: 'Present progressive with "en este momento"' },
    ],
  }),
  'context-connect': (opts) => ({
    type: 'context-connect',
    difficulty: opts.difficulty,
    language: opts.language,
    targetLanguage: opts.targetLanguage,
    passages: getContextConnectFallbackPassages(opts.targetLanguage),
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
};

function getGamePrompt(gameType: GameType, difficulty: Difficulty, language: string, targetLanguage: string, topic?: string): string {
  const difficultyGuidelines = {
    beginner: 'Use simple, common vocabulary (A1-A2 level) and short sentences. Focus on everyday words, basic grammar, and high-frequency vocabulary. Avoid complex tenses or abstract concepts.',
    intermediate: 'Use moderate vocabulary (B1-B2 level) with some complex sentences. Include common idioms, varied grammar structures, and practical expressions. Mix simple and compound sentences.',
    advanced: 'Use sophisticated vocabulary (C1-C2 level), complex grammar structures, and nuanced expressions. Include idiomatic expressions, subjunctive mood, and advanced linguistic concepts.',
  };

  const topicContext = topic ? `Focus the content around the topic: "${topic}". Ensure all vocabulary and examples relate to this theme.` : 'Choose varied topics like daily life, travel, food, nature, culture, work, or family. Mix themes for variety.';

  // Enhanced base prompt optimized for nova-fast model
  const basePrompt = `You are an expert language learning content generator specializing in ${targetLanguage} education. Create engaging, pedagogically sound content for a "${gameType}" game.

CONTEXT:
- Target language: ${targetLanguage}
- User's native language: ${language}
- Difficulty level: ${difficulty}
- Learning guidelines: ${difficultyGuidelines[difficulty]}
- Content theme: ${topicContext}

QUALITY REQUIREMENTS:
- Ensure cultural authenticity and natural language usage
- Use the target language's standard writing system (no romanization/transliteration)
- Use age-appropriate and inclusive content
- Provide clear, unambiguous correct answers
- Create engaging, memorable examples
- Maintain consistent difficulty throughout
- Include practical, real-world vocabulary

OUTPUT FORMAT: Return ONLY valid JSON without markdown formatting, explanations, or code blocks. Ensure proper JSON syntax with correct quotes and brackets.`;

  const gameSpecificPrompts: Record<GameType, string> = {
    'transcription-station': `${basePrompt}

TASK: Generate 5 transcription exercises where users listen to audio and type what they hear.

CONTENT GUIDELINES:
- Use natural, conversational phrases that native speakers would actually say
- Include common greetings, questions, statements, and expressions
- Vary sentence length and complexity based on difficulty level
- Ensure phrases are phonetically clear and distinct
- Include helpful context hints that guide without giving away the answer

JSON STRUCTURE:
{
  "rounds": [
    { 
      "audioText": "Natural ${targetLanguage} phrase", 
      "correctAnswer": "Exact same phrase for validation", 
      "hint": "Contextual hint in English (e.g., 'A common greeting', 'Asking about location')" 
    }
  ]
}

EXAMPLE QUALITY:
- Good: "¿Dónde está la biblioteca?" (Where is the library?)
- Avoid: "La biblioteca está ubicada en el centro" (too formal/complex for beginners)`,

    'audio-jumble': `${basePrompt}

TASK: Generate 4 sentences where users arrange scrambled words in correct order.

CONTENT GUIDELINES:
- Create grammatically correct, natural-sounding sentences
- Use proper word order rules for ${targetLanguage}
- Include a mix of sentence types (statements, questions, commands)
- Ensure scrambled words can only form one logical sentence
- Test understanding of syntax, not just vocabulary

JSON STRUCTURE:
{
  "rounds": [
    { 
      "sentence": "Complete grammatically correct sentence in ${targetLanguage}", 
      "words": ["individual", "words", "from", "sentence"], 
      "correctOrder": [2, 0, 3, 1] 
    }
  ]
}

VALIDATION: The correctOrder array indices must rearrange the words array to form the exact sentence.`,



    'translation-matchup': `${basePrompt}

TASK: Generate 8 word pairs for a memory matching game.

CONTENT GUIDELINES:
- Use high-frequency vocabulary that learners encounter regularly
- Include a mix of word types: nouns, verbs, adjectives, common phrases
- Ensure translations are the most common/standard equivalents
- Avoid words with multiple meanings unless context is clear
- Create thematically related groups for better learning

JSON STRUCTURE:
{
  "pairs": [
    { "original": "${targetLanguage} word/phrase", "translation": "Most common English equivalent" }
  ]
}

WORD SELECTION:
- Prioritize practical, everyday vocabulary
- Include words from different semantic fields
- Ensure cultural appropriateness and inclusivity`,

    'secret-word-solver': `${basePrompt}

TASK: Generate 5 words for a hangman-style guessing game.

CONTENT GUIDELINES:
- Use words 6-12 letters long for optimal gameplay
- Choose vocabulary that's challenging but fair for the difficulty level
- Create helpful but not obvious hints
- Include words from various categories (animals, objects, actions, etc.)
- Ensure words use common letter patterns in ${targetLanguage}

JSON STRUCTURE:
{
  "words": [
    { 
      "word": "${targetLanguage.toUpperCase()} WORD IN CAPITALS", 
      "hint": "Descriptive hint that helps without being too obvious", 
      "category": "Semantic category (Animals, Food, Actions, etc.)" 
    }
  ]
}

HINT QUALITY:
- Provide functional or descriptive clues
- Avoid direct translations
- Use context or usage examples when helpful`,

    'word-drop-dash': `${basePrompt}

TASK: Generate 3 rounds of fast-paced vocabulary matching with 3-4 words each.

CONTENT GUIDELINES:
- Use vocabulary that can be quickly recognized and processed
- Include relevant emojis that clearly represent each word
- Vary time limits based on difficulty (30s for beginners, 20s for advanced)
- Group words thematically within each round for coherence
- Ensure rapid visual-linguistic association

JSON STRUCTURE:
{
  "rounds": [
    { 
      "words": [
        { "word": "${targetLanguage} word", "translation": "English", "emoji": "🎯" }
      ],
      "timeLimit": 30
    }
  ]
}

TIMING GUIDELINES:
- Beginner: 30-35 seconds per round
- Intermediate: 25-30 seconds per round  
- Advanced: 20-25 seconds per round`,

    'conjugation-coach': `${basePrompt}

TASK: Generate 5 verb conjugation questions with contextual clues.

CONTENT GUIDELINES:
- Include clear temporal markers (ayer, mañana, ahora, etc.)
- Use common, irregular verbs that learners need to master
- Provide context that naturally requires the target tense
- Create plausible distractors from different tenses of the same verb
- Include brief explanations that reinforce the grammar rule

JSON STRUCTURE:
{
  "questions": [
    { 
      "sentence": "${targetLanguage} full sentence with the conjugated verb included (no blanks)", 
      "blankedSentence": "${targetLanguage} sentence with _____ blank in correct word order",
      "answer": "correct conjugated verb for the blank",
      "verb": "infinitive form", 
      "tense": "specific tense name",
      "subject": "subject pronoun",
      "options": ["correct_form", "distractor1", "distractor2", "distractor3"],
      "correctIndex": 0,
      "explanation": "Brief rule explanation (e.g., 'Preterite tense for completed past actions')"
    }
  ]
}

BLANKING RULES:
- "sentence" must be a complete sentence with the conjugated verb in place.
- The sentence must include exactly one blank token (_____ or ___) for the conjugated verb.
- Place the blank exactly where the conjugated verb appears in natural ${targetLanguage} word order.
- Provide the conjugated verb in "answer" and ensure it matches options[correctIndex].

CONTEXT CLUES:
- Use time expressions that clearly indicate the required tense
- Include situational context that supports the grammar choice`,

    'context-connect': `${basePrompt}

TASK: Generate 2 short passages with 2-3 blanks each for contextual fill-in-the-blank.

CONTENT GUIDELINES:
- Create coherent, realistic scenarios (shopping, travel, daily routines)
- Use context clues that help determine the correct answers
- Ensure blanks test vocabulary in meaningful contexts
- Create logical distractors that are grammatically possible but contextually wrong
- Make passages engaging and relatable

JSON STRUCTURE:
{
  "passages": [
    {
      "text": "Coherent passage with _____ blanks that tell a story",
      "blanks": [
        { 
          "position": 0, 
          "correctWord": "contextually appropriate word", 
          "options": ["correct", "plausible_wrong1", "plausible_wrong2", "clearly_wrong"] 
        }
      ]
    }
  ]
}

PASSAGE QUALITY:
- Tell mini-stories that learners can relate to
- Use vocabulary and grammar appropriate for the level
- Ensure logical flow and coherence`,

    'syntax-scrambler': `${basePrompt}

TASK: Generate 4 sentences that users must unscramble to practice word order.

CONTENT GUIDELINES:
- Focus on common word order patterns in ${targetLanguage}
- Include various sentence types (declarative, interrogative, imperative)
- Test understanding of syntax rules, not just vocabulary
- Use natural, conversational language
- Ensure only one logical arrangement is possible

JSON STRUCTURE:
{
  "sentences": [
    { 
      "scrambled": ["array", "of", "individual", "words"], 
      "correct": "Properly ordered sentence in ${targetLanguage}", 
      "translation": "Natural English translation" 
    }
  ]
}

SYNTAX FOCUS:
- Subject-verb-object order
- Adjective placement rules
- Question formation patterns
- Prepositional phrase positioning`,
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

async function callPollinations(messages: ChatMessage[], seed?: number): Promise<string> {
  try {
    const systemMessage = messages.find((message) => message.role === 'system')?.content;
    const userMessage = messages.find((message) => message.role === 'user')?.content ?? '';

    const response = await pollinationsApi.generateText(userMessage, {
      temperature: 0.7,
      max_tokens: 2000,
      seed,
      system: systemMessage
    });

    return response.content;
  } catch (error: any) {
    console.error('Pollinations API error:', error);
    throw new Error(error.message || 'Pollinations API error');
  }
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



function validateGameContent(parsed: any, gameType: GameType): boolean {
  // Basic structure validation
  if (!parsed || typeof parsed !== 'object') {
    console.warn('Content validation failed: Invalid or missing content object');
    return false;
  }

  try {
    switch (gameType) {
      case 'transcription-station':
        if (!Array.isArray(parsed.rounds) || parsed.rounds.length === 0) {
          console.warn('Transcription validation failed: Missing or empty rounds array');
          return false;
        }
        return parsed.rounds.every((r: any, index: number) => {
          const isValid = r.audioText && typeof r.audioText === 'string' &&
            r.correctAnswer && typeof r.correctAnswer === 'string' &&
            r.audioText.trim().length > 0 && r.correctAnswer.trim().length > 0 &&
            r.audioText === r.correctAnswer; // Must match exactly for transcription
          if (!isValid) {
            console.warn(`Transcription round ${index} validation failed:`, r);
          }
          return isValid;
        });

      case 'audio-jumble':
        if (!Array.isArray(parsed.rounds) || parsed.rounds.length === 0) {
          console.warn('Audio jumble validation failed: Missing or empty rounds array');
          return false;
        }
        return parsed.rounds.every((r: any, index: number) => {
          const hasValidStructure = r.sentence && typeof r.sentence === 'string' &&
            Array.isArray(r.words) && Array.isArray(r.correctOrder) &&
            r.words.length > 0 && r.correctOrder.length === r.words.length;

          if (!hasValidStructure) {
            console.warn(`Audio jumble round ${index} structure validation failed:`, r);
            return false;
          }

          // Validate that correctOrder indices are valid and unique
          const validIndices = r.correctOrder.every((idx: number) =>
            Number.isInteger(idx) && idx >= 0 && idx < r.words.length
          );
          const uniqueIndices = new Set(r.correctOrder).size === r.correctOrder.length;

          if (!validIndices || !uniqueIndices) {
            console.warn(`Audio jumble round ${index} indices validation failed:`, r);
            return false;
          }

          // Validate that reordered words form the sentence
          const reorderedWords = r.correctOrder.map((idx: number) => r.words[idx]);
          const reconstructed = reorderedWords.join(' ');
          const isValidReconstruction = reconstructed === r.sentence;

          if (!isValidReconstruction) {
            console.warn(`Audio jumble round ${index} reconstruction failed. Expected: "${r.sentence}", Got: "${reconstructed}"`);
            return false;
          }

          return true;
        });



      case 'translation-matchup':
        if (!Array.isArray(parsed.pairs) || parsed.pairs.length === 0) {
          console.warn('Translation matchup validation failed: Missing or empty pairs array');
          return false;
        }
        return parsed.pairs.every((p: any, index: number) => {
          const isValid = p.original && typeof p.original === 'string' &&
            p.translation && typeof p.translation === 'string' &&
            p.original.trim().length > 0 && p.translation.trim().length > 0;
          if (!isValid) {
            console.warn(`Translation pair ${index} validation failed:`, p);
          }
          return isValid;
        });

      case 'secret-word-solver':
        if (!Array.isArray(parsed.words) || parsed.words.length === 0) {
          console.warn('Secret word solver validation failed: Missing or empty words array');
          return false;
        }
        return parsed.words.every((w: any, index: number) => {
          const isValid = w.word && typeof w.word === 'string' &&
            w.hint && typeof w.hint === 'string' &&
            w.word.trim().length >= 2 && w.word.trim().length <= 20 && // Allow shorter words for non-Latin scripts
            w.hint.trim().length > 0;
          if (!isValid) {
            console.warn(`Secret word ${index} validation failed:`, w);
          }
          return isValid;
        });

      case 'word-drop-dash':
        if (!Array.isArray(parsed.rounds) || parsed.rounds.length === 0) {
          console.warn('Word drop dash validation failed: Missing or empty rounds array');
          return false;
        }
        return parsed.rounds.every((r: any, index: number) => {
          const hasValidStructure = Array.isArray(r.words) && r.words.length > 0 &&
            typeof r.timeLimit === 'number' && r.timeLimit > 0;

          if (!hasValidStructure) {
            console.warn(`Word drop round ${index} structure validation failed:`, r);
            return false;
          }

          const wordsValid = r.words.every((w: any, wordIndex: number) => {
            const isValid = w.word && typeof w.word === 'string' &&
              w.translation && typeof w.translation === 'string' &&
              w.emoji && typeof w.emoji === 'string';
            if (!isValid) {
              console.warn(`Word drop round ${index}, word ${wordIndex} validation failed:`, w);
            }
            return isValid;
          });

          return wordsValid;
        });

      case 'conjugation-coach':
        if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
          console.warn('Conjugation coach validation failed: Missing or empty questions array');
          return false;
        }
        return parsed.questions.every((q: any, index: number) => {
          const hasValidStructure = q.sentence && typeof q.sentence === 'string' &&
            Array.isArray(q.options) && q.options.length >= 2 &&
            typeof q.correctIndex === 'number' &&
            q.correctIndex >= 0 && q.correctIndex < q.options.length;

          if (!hasValidStructure) {
            console.warn(`Conjugation question ${index} structure validation failed:`, q);
            return false;
          }

          const hasBlank = q.sentence.includes('_____') || q.sentence.includes('___');
          const hasBlankedSentence = typeof q.blankedSentence === 'string' &&
            (q.blankedSentence.includes('_____') || q.blankedSentence.includes('___'));
          const hasAnswer = typeof q.answer === 'string' && q.answer.trim().length > 0;

          if (!hasBlank && !hasBlankedSentence && !hasAnswer) {
            console.warn(`Conjugation question ${index} missing blank and answer:`, q);
            return false;
          }

          // Validate that all options are strings
          const optionsValid = q.options.every((opt: any) => typeof opt === 'string' && opt.trim().length > 0);
          if (!optionsValid) {
            console.warn(`Conjugation question ${index} invalid options:`, q);
            return false;
          }

          if (hasAnswer) {
            const expected = q.options[q.correctIndex];
            if (typeof expected === 'string' && q.answer.trim() !== expected.trim()) {
              console.warn(`Conjugation question ${index} answer mismatch:`, q);
              return false;
            }
          }

          return true;
        });

      case 'context-connect':
        if (!Array.isArray(parsed.passages) || parsed.passages.length === 0) {
          console.warn('Context connect validation failed: Missing or empty passages array');
          return false;
        }
        return parsed.passages.every((p: any, index: number) => {
          const hasValidStructure = p.text && typeof p.text === 'string' &&
            Array.isArray(p.blanks) && p.blanks.length > 0;

          if (!hasValidStructure) {
            console.warn(`Context passage ${index} structure validation failed:`, p);
            return false;
          }

          // Count blanks in text
          const blankCount = (p.text.match(/_____/g) || []).length;
          if (blankCount !== p.blanks.length) {
            console.warn(`Context passage ${index} blank count mismatch. Text has ${blankCount}, blanks array has ${p.blanks.length}`);
            return false;
          }

          // Validate each blank
          const blanksValid = p.blanks.every((b: any, blankIndex: number) => {
            const isValid = typeof b.position === 'number' && b.position >= 0 &&
              b.correctWord && typeof b.correctWord === 'string' &&
              Array.isArray(b.options) && b.options.length >= 2 &&
              b.options.includes(b.correctWord);
            if (!isValid) {
              console.warn(`Context passage ${index}, blank ${blankIndex} validation failed:`, b);
            }
            return isValid;
          });

          return blanksValid;
        });

      case 'syntax-scrambler':
        if (!Array.isArray(parsed.sentences) || parsed.sentences.length === 0) {
          console.warn('Syntax scrambler validation failed: Missing or empty sentences array');
          return false;
        }
        return parsed.sentences.every((s: any, index: number) => {
          const hasValidStructure = Array.isArray(s.scrambled) && s.scrambled.length > 0 &&
            s.correct && typeof s.correct === 'string';

          if (!hasValidStructure) {
            console.warn(`Syntax sentence ${index} structure validation failed:`, s);
            return false;
          }

          // Validate that scrambled words can form the correct sentence
          const scrambledSet = new Set(s.scrambled.map((w: string) => w.toLowerCase().trim()));
          const correctWords = s.correct.split(/\s+/).map((w: string) => w.toLowerCase().trim());
          const correctSet = new Set(correctWords);

          const wordsMatch = scrambledSet.size === correctSet.size &&
            [...scrambledSet].every(word => correctSet.has(word));

          if (!wordsMatch) {
            console.warn(`Syntax sentence ${index} word mismatch. Scrambled:`, s.scrambled, 'Correct:', correctWords);
            return false;
          }

          return true;
        });

      default:
        console.warn(`Unknown game type for validation: ${gameType}`);
        return false;
    }
  } catch (error) {
    console.error(`Content validation error for ${gameType}:`, error);
    return false;
  }
}

/**
 * Perform quality checks on generated game content
 * @param content - The generated game content
 * @param gameType - Type of game
 * @param difficulty - Difficulty level
 * @returns Quality assessment with score and issues
 */
function assessContentQuality(content: any, gameType: GameType, difficulty: string): {
  score: number;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let qualityScore = 100;

  try {
    // Common quality checks across all game types

    // 1. Content diversity check
    const contentItems = extractContentItems(content, gameType);
    if (contentItems.length > 0) {
      const uniqueItems = new Set(contentItems.map(item => item.toLowerCase().trim()));
      const diversityRatio = uniqueItems.size / contentItems.length;

      if (diversityRatio < 0.8) {
        issues.push(`Low content diversity: ${Math.round(diversityRatio * 100)}% unique items`);
        recommendations.push('Ensure more varied vocabulary and avoid repetition');
        qualityScore -= 15;
      }
    }

    // 2. Difficulty appropriateness check
    const difficultyIssues = checkDifficultyAppropriate(content, gameType, difficulty);
    issues.push(...difficultyIssues.issues);
    recommendations.push(...difficultyIssues.recommendations);
    qualityScore -= difficultyIssues.penalty;

    // 3. Language quality check
    const languageIssues = checkLanguageQuality(content, gameType);
    issues.push(...languageIssues.issues);
    recommendations.push(...languageIssues.recommendations);
    qualityScore -= languageIssues.penalty;

    // 4. Game-specific quality checks
    const gameSpecificIssues = checkGameSpecificQuality(content, gameType);
    issues.push(...gameSpecificIssues.issues);
    recommendations.push(...gameSpecificIssues.recommendations);
    qualityScore -= gameSpecificIssues.penalty;

    // Ensure score doesn't go below 0
    qualityScore = Math.max(0, qualityScore);

    return {
      score: qualityScore,
      issues,
      recommendations
    };

  } catch (error) {
    console.error('Quality assessment error:', error);
    return {
      score: 50,
      issues: ['Quality assessment failed due to unexpected error'],
      recommendations: ['Manual review recommended']
    };
  }
}

/**
 * Extract content items for diversity analysis
 */
function extractContentItems(content: any, gameType: GameType): string[] {
  const items: string[] = [];

  try {
    switch (gameType) {
      case 'transcription-station':
        content.rounds?.forEach((r: any) => {
          if (r.audioText) items.push(r.audioText);
        });
        break;
      case 'audio-jumble':
        content.rounds?.forEach((r: any) => {
          if (r.sentence) items.push(r.sentence);
        });
        break;

      case 'translation-matchup':
        content.pairs?.forEach((p: any) => {
          if (p.original) items.push(p.original);
          if (p.translation) items.push(p.translation);
        });
        break;
      case 'secret-word-solver':
        content.words?.forEach((w: any) => {
          if (w.word) items.push(w.word);
        });
        break;
      case 'word-drop-dash':
        content.rounds?.forEach((r: any) => {
          r.words?.forEach((w: any) => {
            if (w.word) items.push(w.word);
          });
        });
        break;
      case 'conjugation-coach':
        content.questions?.forEach((q: any) => {
          if (q.sentence) items.push(q.sentence);
        });
        break;
      case 'context-connect':
        content.passages?.forEach((p: any) => {
          if (p.text) items.push(p.text);
        });
        break;
      case 'syntax-scrambler':
        content.sentences?.forEach((s: any) => {
          if (s.correct) items.push(s.correct);
        });
        break;
    }
  } catch (error) {
    console.warn('Error extracting content items:', error);
  }

  return items;
}

/**
 * Check if content difficulty is appropriate
 */
function checkDifficultyAppropriate(content: any, gameType: GameType, difficulty: string): {
  issues: string[];
  recommendations: string[];
  penalty: number;
} {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let penalty = 0;

  // Simple heuristics for difficulty assessment
  const items = extractContentItems(content, gameType);

  if (items.length > 0) {
    const avgLength = items.reduce((sum, item) => sum + item.length, 0) / items.length;

    // Length-based difficulty heuristics
    const expectedLengths = {
      beginner: { min: 5, max: 30 },
      intermediate: { min: 15, max: 60 },
      advanced: { min: 25, max: 100 }
    };

    const expected = expectedLengths[difficulty as keyof typeof expectedLengths];
    if (expected) {
      if (avgLength < expected.min) {
        issues.push(`Content may be too simple for ${difficulty} level (avg length: ${Math.round(avgLength)})`);
        recommendations.push(`Increase complexity and length for ${difficulty} learners`);
        penalty += 10;
      } else if (avgLength > expected.max) {
        issues.push(`Content may be too complex for ${difficulty} level (avg length: ${Math.round(avgLength)})`);
        recommendations.push(`Simplify content for ${difficulty} learners`);
        penalty += 10;
      }
    }
  }

  return { issues, recommendations, penalty };
}

/**
 * Check language quality and naturalness
 */
function checkLanguageQuality(content: any, gameType: GameType): {
  issues: string[];
  recommendations: string[];
  penalty: number;
} {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let penalty = 0;

  const items = extractContentItems(content, gameType);

  // Check for common language issues
  items.forEach((item, index) => {
    // Check for excessive repetition of words
    const words = item.toLowerCase().split(/\s+/);
    const wordCounts = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const maxRepetition = Math.max(...Object.values(wordCounts));
    if (maxRepetition > 3 && words.length > 5) {
      issues.push(`Excessive word repetition in item ${index + 1}`);
      penalty += 5;
    }

    // Check for very short or very long items
    if (item.trim().length < 3) {
      issues.push(`Item ${index + 1} is too short`);
      penalty += 5;
    } else if (item.trim().length > 200) {
      issues.push(`Item ${index + 1} may be too long`);
      penalty += 3;
    }
  });

  if (issues.length > 0) {
    recommendations.push('Review content for natural language flow and appropriate length');
  }

  return { issues, recommendations, penalty };
}

/**
 * Game-specific quality checks
 */
function checkGameSpecificQuality(content: any, gameType: GameType): {
  issues: string[];
  recommendations: string[];
  penalty: number;
} {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let penalty = 0;

  try {
    switch (gameType) {
      case 'conjugation-coach':
        // Check that questions have varied tenses
        if (content.questions && Array.isArray(content.questions)) {
          const tenses = content.questions.map((q: any) => q.tense).filter(Boolean);
          const uniqueTenses = new Set(tenses);

          if (tenses.length > 2 && uniqueTenses.size === 1) {
            issues.push('All conjugation questions use the same tense');
            recommendations.push('Include variety in verb tenses for better learning');
            penalty += 15;
          }
        }
        break;



      case 'translation-matchup':
        // Check for balanced word types
        if (content.pairs && Array.isArray(content.pairs)) {
          const words = content.pairs.map((p: any) => p.original).filter(Boolean);

          // Simple heuristic: check if all words are very similar in length
          if (words.length > 3) {
            const lengths = words.map((w: string) => w.length);
            const avgLength = lengths.reduce((a: number, b: number) => a + b, 0) / lengths.length;
            const variance = lengths.reduce((acc: number, len: number) => acc + Math.pow(len - avgLength, 2), 0) / lengths.length;

            if (variance < 2) {
              issues.push('All translation words are very similar in length');
              recommendations.push('Include variety in word lengths and types');
              penalty += 5;
            }
          }
        }
        break;

      case 'word-drop-dash':
        // Check time limits are reasonable
        if (content.rounds && Array.isArray(content.rounds)) {
          content.rounds.forEach((round: any, index: number) => {
            if (round.timeLimit && round.words) {
              const wordsPerSecond = round.words.length / round.timeLimit;

              if (wordsPerSecond > 0.5) {
                issues.push(`Round ${index + 1} may be too fast (${wordsPerSecond.toFixed(1)} words/sec)`);
                penalty += 5;
              } else if (wordsPerSecond < 0.1) {
                issues.push(`Round ${index + 1} may be too slow (${wordsPerSecond.toFixed(1)} words/sec)`);
                penalty += 3;
              }
            }
          });

          if (issues.length > 0) {
            recommendations.push('Adjust time limits for optimal challenge level');
          }
        }
        break;
    }
  } catch (error) {
    console.warn('Game-specific quality check error:', error);
  }

  return { issues, recommendations, penalty };
}

export async function generateGameContent(options: GenerateGameOptions): Promise<{
  content: GameContent;
  usedFallback: boolean;
  qualityScore?: number;
  qualityIssues?: string[];
  fromCache?: boolean;
  generationTime?: number;
}> {
  const { gameType, difficulty, language, targetLanguage, topic, forceNew = false } = options;

  try {
    const generateFresh = async () => {
      // Content generation logic
      const prompt = getGamePrompt(gameType, difficulty, language, targetLanguage, topic);
      const messages: ChatMessage[] = [
        { role: 'system', content: 'You are a helpful assistant that generates language learning game content. Always respond with valid JSON only.' },
        { role: 'user', content: prompt },
      ];

      const seed = forceNew ? Math.floor(Math.random() * 1_000_000_000) : undefined;

      const generateWithProvider = async (provider: 'groq' | 'pollinations') => {
        const response = provider === 'groq'
          ? await callGroq(messages)
          : await callPollinations(messages, seed);

        const parsed = parseGameContent(response, gameType);
        if (!validateGameContent(parsed, gameType)) {
          throw new Error(`${provider} generated content failed validation`);
        }

        return parsed;
      };

      let parsed: any;

      // Use Groq as primary, Pollinations as fallback (including validation failures)
      try {
        parsed = await generateWithProvider('groq');
      } catch (groqError) {
        console.error('Groq generation failed, trying Pollinations:', groqError);
        parsed = await generateWithProvider('pollinations');
      }

      // Perform quality assessment
      const qualityAssessment = assessContentQuality(parsed, gameType, difficulty);
      console.log(`Content quality score: ${qualityAssessment.score}/100 for ${gameType}`);

      if (qualityAssessment.issues.length > 0) {
        console.warn('Content quality issues:', qualityAssessment.issues);
      }

      // If quality is very poor (below 40), consider using fallback
      if (qualityAssessment.score < 40) {
        console.warn(`Quality score too low (${qualityAssessment.score}), using fallback content`);
        throw new Error('Content quality below acceptable threshold');
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
        qualityScore: qualityAssessment.score,
        qualityIssues: qualityAssessment.issues,
      };
    };

    if (forceNew) {
      const startTime = Date.now();
      const fresh = await generateFresh();
      return {
        content: fresh.content,
        usedFallback: false,
        qualityScore: fresh.qualityScore,
        qualityIssues: fresh.qualityIssues,
        fromCache: false,
        generationTime: Date.now() - startTime,
      };
    }

    // Try to get content from cache first
    const cacheResult = await contentCache.getOrGenerate(
      { gameType, difficulty, language, targetLanguage, topic },
      generateFresh,
      // Cache for 2 hours for generated content
      7200000
    );

    // If content was generated (not from cache), return with generation info
    if (!cacheResult.fromCache) {
      return {
        content: cacheResult.data.content,
        usedFallback: false,
        qualityScore: cacheResult.data.qualityScore,
        qualityIssues: cacheResult.data.qualityIssues,
        fromCache: false,
        generationTime: cacheResult.generationTime
      };
    } else {
      // Content was from cache
      return {
        content: cacheResult.data.content,
        usedFallback: false,
        qualityScore: cacheResult.data.qualityScore,
        qualityIssues: cacheResult.data.qualityIssues,
        fromCache: true
      };
    }

  } catch (error) {
    console.error('Game generation failed, using fallback:', error);

    // Try to get fallback content from cache first (skip when forceNew is requested)
    const fallbackCacheKey = {
      gameType: `${gameType}_fallback` as GameType,
      difficulty,
      language,
      targetLanguage,
      topic: 'fallback'
    };

    if (!forceNew) {
      try {
        const cachedFallback = await contentCache.get(fallbackCacheKey);
        if (cachedFallback) {
          console.log('Using cached fallback content');
          return {
            content: cachedFallback as GameContent,
            usedFallback: true,
            qualityScore: 75,
            qualityIssues: ['Used cached fallback content'],
            fromCache: true
          };
        }
      } catch (cacheError) {
        console.warn('Failed to retrieve cached fallback:', cacheError);
      }
    }

    // Generate fresh fallback content
    const fallbackGenerator = FALLBACK_GAMES[gameType];
    const fallbackContent = await fallbackGenerator(options);

    // Cache the fallback content for future use (skip when forceNew is requested)
    if (!forceNew) {
      try {
        await contentCache.set(fallbackCacheKey, fallbackContent, 86400000); // Cache for 24 hours
      } catch (cacheError) {
        console.warn('Failed to cache fallback content:', cacheError);
      }
    }

    return {
      content: fallbackContent,
      usedFallback: true,
      qualityScore: 75, // Fallback content gets a decent score
      qualityIssues: ['Used fallback content due to generation failure'],
      fromCache: false
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
    default:
      return 1;
  }
}
