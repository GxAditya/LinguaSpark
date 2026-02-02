import { useState, useEffect, useCallback } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { Globe, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  speakers: string;
  script: 'latin' | 'devanagari' | 'arabic' | 'cyrillic' | 'cjk' | 'japanese';
  greeting: string;
  greetingTranslation: string;
  phrase: string;
  phraseTranslation: string;
  color: string;
  gradient: string;
}

const languages: Language[] = [
  {
    code: 'spanish',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    speakers: '580M+',
    script: 'latin',
    greeting: '¡Hola!',
    greetingTranslation: 'Hello!',
    phrase: '¿Cómo estás?',
    phraseTranslation: 'How are you?',
    color: 'ember',
    gradient: '--gradient-sunrise',
  },
  {
    code: 'french',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    speakers: '310M+',
    script: 'latin',
    greeting: 'Bonjour!',
    greetingTranslation: 'Hello!',
    phrase: 'Comment ça va?',
    phraseTranslation: 'How are you?',
    color: 'royal',
    gradient: '--gradient-royal',
  },
  {
    code: 'japanese',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    speakers: '125M+',
    script: 'japanese',
    greeting: 'こんにちは!',
    greetingTranslation: 'Hello!',
    phrase: 'お元気ですか？',
    phraseTranslation: 'How are you?',
    color: 'berry',
    gradient: '--gradient-berry',
  },
  {
    code: 'mandarin',
    name: 'Mandarin',
    nativeName: '中文',
    flag: '🇨🇳',
    speakers: '1.1B+',
    script: 'cjk',
    greeting: '你好!',
    greetingTranslation: 'Hello!',
    phrase: '你好吗？',
    phraseTranslation: 'How are you?',
    color: 'ember',
    gradient: '--gradient-ember',
  },
  {
    code: 'hindi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    speakers: '600M+',
    script: 'devanagari',
    greeting: 'नमस्ते!',
    greetingTranslation: 'Hello!',
    phrase: 'आप कैसे हैं?',
    phraseTranslation: 'How are you?',
    color: 'sand',
    gradient: '--gradient-sand',
  },
  {
    code: 'arabic',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    speakers: '420M+',
    script: 'arabic',
    greeting: 'مرحبا!',
    greetingTranslation: 'Hello!',
    phrase: 'كيف حالك؟',
    phraseTranslation: 'How are you?',
    color: 'mint',
    gradient: '--gradient-mint',
  },
  {
    code: 'portuguese',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇧🇷',
    speakers: '260M+',
    script: 'latin',
    greeting: 'Olá!',
    greetingTranslation: 'Hello!',
    phrase: 'Como você está?',
    phraseTranslation: 'How are you?',
    color: 'forest',
    gradient: '--gradient-forest',
  },
  {
    code: 'russian',
    name: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
    speakers: '255M+',
    script: 'cyrillic',
    greeting: 'Привет!',
    greetingTranslation: 'Hello!',
    phrase: 'Как дела?',
    phraseTranslation: 'How are you?',
    color: 'royal',
    gradient: '--gradient-royal',
  },
  {
    code: 'bengali',
    name: 'Bengali',
    nativeName: 'বাংলা',
    flag: '🇧🇩',
    speakers: '270M+',
    script: 'devanagari',
    greeting: 'নমস্কার!',
    greetingTranslation: 'Hello!',
    phrase: 'আপনি কেমন আছেন?',
    phraseTranslation: 'How are you?',
    color: 'berry',
    gradient: '--gradient-berry',
  },
];

export default function Languages() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const [activeLanguageIndex, setActiveLanguageIndex] = useState<number | null>(null);

  // Auto-cycle through languages when section is visible
  useEffect(() => {
    if (!isVisible) return;

    // Start with first language after a delay
    const startTimer = setTimeout(() => {
      setActiveLanguageIndex(0);
    }, 1000);

    // Auto-cycle every 8 seconds
    const cycleInterval = setInterval(() => {
      setActiveLanguageIndex((prev) => {
        if (prev === null) return 0;
        return (prev + 1) % languages.length;
      });
    }, 8000);

    return () => {
      clearTimeout(startTimer);
      clearInterval(cycleInterval);
    };
  }, [isVisible]);

  const handleLanguageClick = useCallback((index: number) => {
    setActiveLanguageIndex(index);
  }, []);

  const activeLanguage = activeLanguageIndex !== null ? languages[activeLanguageIndex] : null;
  const displayLanguage = activeLanguage ?? languages[0];

  return (
    <section
      id="languages"
      ref={ref}
      className="py-32 bg-page overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div
            className={`section-kicker mx-auto mb-6 shadow-sm transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Globe className="w-4 h-4 text-accent" />
            <span>9 Languages & Growing</span>
          </div>

          <h2
            className={`text-5xl md:text-6xl font-bold mb-6 text-primary tracking-tight transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Learn Any Language
            <span className="block text-gradient">Your Way</span>
          </h2>

          <p
            className={`text-xl text-muted max-w-3xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            From Spanish to Japanese, our AI adapts to each language's unique patterns.
            <span className="text-primary font-medium block mt-2">
              Click any language to see the learning flow in action.
            </span>
          </p>
        </div>

        {/* New layout */}
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 mb-12 items-stretch">
          <div className="bg-surface border border-default rounded-3xl p-8 shadow-soft flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-soft">Active Language</p>
                <h3 className="text-3xl font-semibold text-primary mt-2">
                  {displayLanguage.name}
                  <span className="text-muted font-medium ml-2">({displayLanguage.nativeName})</span>
                </h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-surface-2 border border-default flex items-center justify-center text-2xl">
                {displayLanguage.flag}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-surface-2 border border-default rounded-2xl p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-soft">Greeting</p>
                <p className="text-2xl font-semibold text-primary mt-3">{displayLanguage.greeting}</p>
                <p className="text-sm text-muted mt-2">{displayLanguage.greetingTranslation}</p>
              </div>
              <div className="bg-surface-2 border border-default rounded-2xl p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-soft">Core Phrase</p>
                <p className="text-xl font-semibold text-primary mt-3">{displayLanguage.phrase}</p>
                <p className="text-sm text-muted mt-2">{displayLanguage.phraseTranslation}</p>
              </div>
            </div>

            <div className="mt-6 grid sm:grid-cols-3 gap-4">
              {[
                { label: 'Speakers', value: displayLanguage.speakers },
                { label: 'Script', value: displayLanguage.script.toUpperCase() },
                { label: 'Session', value: '18 min' },
              ].map((item) => (
                <div key={item.label} className="bg-surface-2 border border-default rounded-2xl p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-soft">{item.label}</p>
                  <p className="text-lg font-semibold text-primary mt-2">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface border border-default rounded-3xl p-6 shadow-soft flex flex-col">
            <p className="text-xs uppercase tracking-[0.2em] text-soft">Choose a language</p>
            <div className="grid grid-cols-2 gap-3 mt-4 flex-1">
              {languages.map((lang, index) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageClick(index)}
                  className={`flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border transition-all duration-300 text-left ${
                    activeLanguageIndex === index
                      ? 'border-strong bg-surface-2 shadow-soft'
                      : 'border-default bg-surface'
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold text-primary">{lang.name}</p>
                    <p className="text-xs text-muted">{lang.nativeName}</p>
                  </div>
                  <span className="text-lg">{lang.flag}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div
          className={`text-center transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 btn-primary px-8 py-4 rounded-xl font-semibold text-lg group"
          >
            Start Learning for Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="text-sm text-muted mt-4">No credit card required • Free forever plan</p>
        </div>
      </div>
    </section>
  );
}
