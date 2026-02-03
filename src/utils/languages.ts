export const SUPPORTED_LEARNING_LANGUAGES = [
  'spanish',
  'french',
  'hindi',
  'mandarin',
  'arabic',
  'bengali',
  'portuguese',
  'russian',
  'japanese',
] as const;

export type LearningLanguage = (typeof SUPPORTED_LEARNING_LANGUAGES)[number];

export const DEFAULT_LEARNING_LANGUAGE: LearningLanguage = 'spanish';

export const LEARNING_LANGUAGE_OPTIONS: Array<{ value: LearningLanguage; label: string }> = [
  { value: 'spanish', label: 'Spanish' },
  { value: 'french', label: 'French' },
  { value: 'hindi', label: 'Hindi' },
  { value: 'mandarin', label: 'Mandarin Chinese' },
  { value: 'arabic', label: 'Arabic' },
  { value: 'bengali', label: 'Bengali' },
  { value: 'portuguese', label: 'Portuguese' },
  { value: 'russian', label: 'Russian' },
  { value: 'japanese', label: 'Japanese' },
];

export const LEARNING_LANGUAGE_META: Record<LearningLanguage, { bcp47: string; dir: 'ltr' | 'rtl' }> = {
  spanish: { bcp47: 'es', dir: 'ltr' },
  french: { bcp47: 'fr', dir: 'ltr' },
  hindi: { bcp47: 'hi', dir: 'ltr' },
  mandarin: { bcp47: 'zh', dir: 'ltr' },
  arabic: { bcp47: 'ar', dir: 'rtl' },
  bengali: { bcp47: 'bn', dir: 'ltr' },
  portuguese: { bcp47: 'pt', dir: 'ltr' },
  russian: { bcp47: 'ru', dir: 'ltr' },
  japanese: { bcp47: 'ja', dir: 'ltr' },
};

export function isLearningLanguage(value: string): value is LearningLanguage {
  return (SUPPORTED_LEARNING_LANGUAGES as readonly string[]).includes(value);
}

export function resolveLearningLanguage(value: string | undefined | null): LearningLanguage {
  if (!value) return DEFAULT_LEARNING_LANGUAGE;
  const normalized = value.trim().toLowerCase();
  if (isLearningLanguage(normalized)) return normalized;
  return DEFAULT_LEARNING_LANGUAGE;
}

export function getLearningLanguageLabel(value: string | undefined | null): string {
  if (!value) {
    const option = LEARNING_LANGUAGE_OPTIONS.find((lang) => lang.value === DEFAULT_LEARNING_LANGUAGE);
    return option?.label ?? 'Spanish';
  }

  const normalized = value.trim().toLowerCase();
  const option = LEARNING_LANGUAGE_OPTIONS.find((lang) => lang.value === normalized);
  if (option) return option.label;

  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

export function getLearningLanguageMeta(value: string | undefined | null): {
  language: LearningLanguage;
  bcp47: string;
  dir: 'ltr' | 'rtl';
} {
  const language = resolveLearningLanguage(value);
  return { language, ...LEARNING_LANGUAGE_META[language] };
}
