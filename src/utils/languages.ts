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
