import { useState, useEffect, useCallback } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { Globe, Volume2, MessageCircle, BookOpen, Sparkles, ArrowRight } from 'lucide-react';
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
    color: 'orange',
    gradient: 'from-orange-500 to-red-500',
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
    color: 'blue',
    gradient: 'from-blue-500 to-indigo-500',
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
    color: 'rose',
    gradient: 'from-rose-500 to-pink-500',
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
    color: 'red',
    gradient: 'from-red-500 to-orange-500',
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
    color: 'amber',
    gradient: 'from-amber-500 to-orange-500',
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
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-500',
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
    color: 'green',
    gradient: 'from-green-500 to-emerald-500',
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
    color: 'sky',
    gradient: 'from-sky-500 to-blue-500',
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
    color: 'teal',
    gradient: 'from-teal-500 to-cyan-500',
  },
];

// Animated language card with learning flow demo
function LanguageCard({
  language,
  isActive,
  onClick,
  delay = 0,
}: {
  language: Language;
  isActive: boolean;
  onClick: () => void;
  delay?: number;
}) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2, triggerOnce: true });
  const [animationPhase, setAnimationPhase] = useState(0);

  // Animate through learning phases when active
  useEffect(() => {
    if (!isActive) {
      setAnimationPhase(0);
      return;
    }

    const phases = [0, 1, 2, 3, 4];
    let currentPhase = 0;

    const interval = setInterval(() => {
      currentPhase = (currentPhase + 1) % phases.length;
      setAnimationPhase(currentPhase);
    }, 1200);

    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`
        relative cursor-pointer transition-all duration-500
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div
        className={`
          relative bg-white rounded-2xl border overflow-hidden
          transition-all duration-500 group
          ${isActive
            ? 'border-orange-200 shadow-xl shadow-orange-500/10 scale-[1.02] ring-1 ring-orange-100'
            : 'border-gray-100 hover:border-gray-200 hover:shadow-lg'
          }
        `}
      >
        {/* Active indicator glow */}
        {isActive && (
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-pink-50/30 pointer-events-none" />
        )}

        {/* Main content */}
        <div className="relative p-6">
          {/* Header with flag and name */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{language.flag}</span>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{language.name}</h3>
                <p className="text-sm text-gray-500">{language.nativeName}</p>
              </div>
            </div>
            <div className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
              {language.speakers} speakers
            </div>
          </div>

          {/* Learning Flow Animation Demo */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 h-[220px] relative overflow-hidden">
            {!isActive ? (
              // Static preview - show greeting
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className={`text-2xl font-bold bg-gradient-to-r ${language.gradient} bg-clip-text text-transparent`}>
                    {language.greeting}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{language.greetingTranslation}</p>
                </div>
              </div>
            ) : (
              // Animated learning flow
              <div className="space-y-3">
                {/* Phase 0: User types in English */}
                <div
                  className={`transition-all duration-500 ${
                    animationPhase >= 0 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xs">👤</span>
                    </div>
                    <div className="bg-white border border-gray-200 px-3 py-2 rounded-lg rounded-bl-none text-sm">
                      <span className="text-gray-600">"{language.phraseTranslation}"</span>
                      {animationPhase === 0 && (
                        <span className="inline-block w-0.5 h-4 bg-gray-400 ml-1 animate-pulse" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Phase 1: AI analyzes */}
                <div
                  className={`transition-all duration-500 ${
                    animationPhase >= 1 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                  }`}
                >
                  <div className="flex items-center gap-2 justify-end">
                    <div className={`bg-gradient-to-r ${language.gradient} text-white px-3 py-2 rounded-lg rounded-br-none text-sm`}>
                      <div className="flex items-center gap-2">
                        {animationPhase === 1 && (
                          <div className="flex gap-0.5">
                            <span className="w-1.5 h-1.5 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1.5 h-1.5 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        )}
                        {animationPhase > 1 && <Sparkles className="w-3 h-3" />}
                        <span>Translating...</span>
                      </div>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center">
                      <span className="text-xs text-white">AI</span>
                    </div>
                  </div>
                </div>

                {/* Phase 2: Translation revealed with character morphing */}
                <div
                  className={`transition-all duration-700 ${
                    animationPhase >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  }`}
                >
                  <div className="bg-white border-2 border-green-200 rounded-lg p-3 relative">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className={`text-xl font-bold bg-gradient-to-r ${language.gradient} bg-clip-text text-transparent`}>
                          {language.phrase.split('').map((char, i) => (
                            <span
                              key={i}
                              className="inline-block transition-all duration-300"
                              style={{
                                animationDelay: `${i * 50}ms`,
                                opacity: animationPhase >= 2 ? 1 : 0,
                                transform: animationPhase >= 2 ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.8)',
                                transitionDelay: `${i * 30}ms`,
                              }}
                            >
                              {char}
                            </span>
                          ))}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{language.phraseTranslation}</p>
                      </div>
                      {animationPhase >= 3 && (
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                          <Volume2 className="w-4 h-4 text-gray-500" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Phase 3: Pronunciation feedback with waveform */}
                {animationPhase >= 3 && (
                  <div className="flex items-center gap-2 transition-all duration-500 opacity-100">
                    <div className="flex items-center gap-1">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1 bg-gradient-to-t ${language.gradient} rounded-full`}
                          style={{
                            height: `${Math.random() * 16 + 8}px`,
                            animation: animationPhase === 3 ? 'waveform-pulse 0.5s ease-in-out infinite' : 'none',
                            animationDelay: `${i * 100}ms`,
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">Listen & practice</span>
                  </div>
                )}

                {/* Phase 4: Success with cultural tip */}
                {animationPhase >= 4 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-2 flex items-center gap-2 transition-all duration-500">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-xs text-green-700">Perfect pronunciation! 🎉</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Click to explore hint */}
          <div className={`
            flex items-center justify-center gap-1 mt-3 text-xs transition-all duration-300
            ${isActive ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-600'}
          `}>
            {isActive ? (
              <>
                <Sparkles className="w-3 h-3" />
                <span>Learning flow in action</span>
              </>
            ) : (
              <>
                <span>Click to explore</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Animated script showcase demonstrating different writing systems
function ScriptShowcase({ activeLanguage }: { activeLanguage: Language | null }) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.3, triggerOnce: true });
  const [morphPhase, setMorphPhase] = useState(0);

  const scriptExamples = {
    latin: { chars: 'A B C D E', description: 'Latin Alphabet' },
    devanagari: { chars: 'अ आ इ ई उ', description: 'Devanagari Script' },
    arabic: { chars: 'ا ب ت ث ج', description: 'Arabic Script' },
    cyrillic: { chars: 'А Б В Г Д', description: 'Cyrillic Alphabet' },
    cjk: { chars: '我 你 他 是 好', description: 'Chinese Characters' },
    japanese: { chars: 'あ い う え お', description: 'Hiragana Script' },
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setMorphPhase((prev) => (prev + 1) % 3);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const currentScript = activeLanguage ? scriptExamples[activeLanguage.script] : scriptExamples.latin;

  return (
    <div
      ref={ref}
      className={`h-full transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <div className="h-full bg-white rounded-2xl border border-gray-100 p-6 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className={`p-2 rounded-xl bg-gradient-to-br ${activeLanguage?.gradient || 'from-orange-500 to-pink-500'} text-white`}>
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">Writing Systems</h3>
              <p className="text-sm text-gray-500">Experience different scripts</p>
            </div>
          </div>

          {/* Animated script display */}
          <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-100">
            <div className="text-4xl font-bold tracking-widest mb-4 transition-all duration-700">
              {currentScript.chars.split(' ').map((char, i) => (
                <span
                  key={`${activeLanguage?.code}-${char}-${i}`}
                  className={`inline-block mx-1.5 transition-all duration-500 text-gray-800`}
                  style={{
                    transform: morphPhase === 1 ? 'scale(1.1) translateY(-4px)' : 'scale(1) translateY(0)',
                    opacity: morphPhase === 2 ? 0.7 : 1,
                    transitionDelay: `${i * 80}ms`,
                  }}
                >
                  {char}
                </span>
              ))}
            </div>
            <p className="text-gray-500 text-sm">
              {currentScript.description}
              {activeLanguage && (
                <span className="text-gray-700 font-medium ml-2">• {activeLanguage.name}</span>
              )}
            </p>
          </div>

          {/* Script feature indicators */}
          <div className="flex justify-center gap-8 mt-6">
            <div className="text-center">
              <div className={`w-3 h-3 rounded-full mx-auto mb-2 transition-all duration-500 ${
                activeLanguage?.script === 'arabic' ? 'bg-emerald-500 scale-125 shadow-lg shadow-emerald-500/30' : 'bg-gray-200'
              }`} />
              <p className="text-xs text-gray-500">RTL Script</p>
            </div>
            <div className="text-center">
              <div className={`w-3 h-3 rounded-full mx-auto mb-2 transition-all duration-500 ${
                activeLanguage?.script === 'cjk' || activeLanguage?.script === 'japanese' ? 'bg-rose-500 scale-125 shadow-lg shadow-rose-500/30' : 'bg-gray-200'
              }`} />
              <p className="text-xs text-gray-500">Character-based</p>
            </div>
            <div className="text-center">
              <div className={`w-3 h-3 rounded-full mx-auto mb-2 transition-all duration-500 ${
                activeLanguage?.script === 'devanagari' ? 'bg-amber-500 scale-125 shadow-lg shadow-amber-500/30' : 'bg-gray-200'
              }`} />
              <p className="text-xs text-gray-500">Syllabic</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Learning journey visualization
function LearningPathVisual({ activeLanguage }: { activeLanguage: Language | null }) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.3, triggerOnce: true });
  const [pathProgress, setPathProgress] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setPathProgress((prev) => (prev + 1) % 5);
    }, 1500);

    return () => clearInterval(interval);
  }, [isVisible]);

  const stages = [
    { icon: BookOpen, label: 'Learn', description: 'Structured lessons' },
    { icon: MessageCircle, label: 'Practice', description: 'AI conversations' },
    { icon: Volume2, label: 'Speak', description: 'Pronunciation training' },
    { icon: Sparkles, label: 'Master', description: 'Fluent expression' },
  ];

  return (
    <div
      ref={ref}
      className={`h-full transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <div className="h-full bg-white rounded-2xl border border-gray-100 p-5 overflow-hidden flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-xl bg-gradient-to-br ${activeLanguage?.gradient || 'from-orange-500 to-pink-500'} text-white`}>
            <ArrowRight className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-gray-900">Your Learning Path</h3>
            <p className="text-xs text-gray-500">
              {activeLanguage ? `Master ${activeLanguage.name} step by step` : 'Choose a language to begin'}
            </p>
          </div>
        </div>

        {/* Journey path visualization */}
        <div className="relative px-2">
          {/* Connecting line */}
          <div className="absolute top-6 left-6 right-6 h-1 bg-gray-100 rounded-full">
            <div
              className={`h-full bg-gradient-to-r ${activeLanguage?.gradient || 'from-orange-500 to-pink-500'} rounded-full transition-all duration-700`}
              style={{ width: `${(pathProgress / (stages.length - 1)) * 100}%` }}
            />
          </div>

          {/* Stage nodes */}
          <div className="flex justify-between relative">
            {stages.map((stage, index) => {
              const Icon = stage.icon;
              const isActive = index === pathProgress;
              const isPassed = index < pathProgress;

              return (
                <div
                  key={stage.label}
                  className="flex flex-col items-center relative"
                  style={{ width: '60px' }}
                >
                  {/* Node container with overflow hidden for pulse */}
                  <div className="relative w-12 h-12">
                    {/* Active pulse effect - contained */}
                    {isActive && (
                      <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${activeLanguage?.gradient || 'from-orange-500 to-pink-500'} opacity-30 animate-ping`} />
                    )}
                    {/* Node */}
                    <div
                      className={`
                        relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 z-10
                        ${isActive
                          ? `bg-gradient-to-br ${activeLanguage?.gradient || 'from-orange-500 to-pink-500'} text-white shadow-lg`
                          : isPassed
                            ? 'bg-green-100 text-green-600 border border-green-200'
                            : 'bg-gray-50 text-gray-400 border border-gray-100'
                        }
                      `}
                    >
                      <Icon className={`w-5 h-5 transition-transform duration-500 ${isActive ? 'scale-110' : ''}`} />
                    </div>
                  </div>

                  {/* Label */}
                  <p className={`
                    mt-2 font-semibold text-xs transition-all duration-500
                    ${isActive ? 'text-gray-900' : isPassed ? 'text-green-600' : 'text-gray-400'}
                  `}>
                    {stage.label}
                  </p>
                  <p className={`
                    text-[10px] transition-all duration-500 text-center leading-tight
                    ${isActive ? 'text-gray-600' : 'text-gray-400'}
                  `}>
                    {stage.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Quick Phrases component - shows animated common phrases
function QuickPhrases({ activeLanguage }: { activeLanguage: Language | null }) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.3, triggerOnce: true });
  const [phraseIndex, setPhraseIndex] = useState(0);

  const phrasesByLanguage: Record<string, { phrase: string; translation: string; context: string }[]> = {
    spanish: [
      { phrase: '¡Buenos días!', translation: 'Good morning!', context: 'Greeting' },
      { phrase: 'Gracias', translation: 'Thank you', context: 'Politeness' },
      { phrase: '¿Cuánto cuesta?', translation: 'How much?', context: 'Shopping' },
    ],
    french: [
      { phrase: 'Merci beaucoup', translation: 'Thank you very much', context: 'Politeness' },
      { phrase: "S'il vous plaît", translation: 'Please', context: 'Politeness' },
      { phrase: "L'addition", translation: 'The bill', context: 'Restaurant' },
    ],
    japanese: [
      { phrase: 'ありがとう', translation: 'Thank you', context: 'Politeness' },
      { phrase: 'すみません', translation: 'Excuse me', context: 'Apology' },
      { phrase: 'おいしい', translation: 'Delicious', context: 'Food' },
    ],
    mandarin: [
      { phrase: '谢谢', translation: 'Thank you', context: 'Politeness' },
      { phrase: '对不起', translation: 'Sorry', context: 'Apology' },
      { phrase: '多少钱', translation: 'How much?', context: 'Shopping' },
    ],
    hindi: [
      { phrase: 'धन्यवाद', translation: 'Thank you', context: 'Politeness' },
      { phrase: 'कृपया', translation: 'Please', context: 'Politeness' },
      { phrase: 'माफ़ कीजिए', translation: 'Excuse me', context: 'Apology' },
    ],
    arabic: [
      { phrase: 'شكراً', translation: 'Thank you', context: 'Politeness' },
      { phrase: 'من فضلك', translation: 'Please', context: 'Politeness' },
      { phrase: 'مع السلامة', translation: 'Goodbye', context: 'Farewell' },
    ],
    portuguese: [
      { phrase: 'Obrigado', translation: 'Thank you', context: 'Politeness' },
      { phrase: 'Por favor', translation: 'Please', context: 'Politeness' },
      { phrase: 'Com licença', translation: 'Excuse me', context: 'Apology' },
    ],
    russian: [
      { phrase: 'Спасибо', translation: 'Thank you', context: 'Politeness' },
      { phrase: 'Пожалуйста', translation: 'Please', context: 'Politeness' },
      { phrase: 'Извините', translation: 'Excuse me', context: 'Apology' },
    ],
    bengali: [
      { phrase: 'ধন্যবাদ', translation: 'Thank you', context: 'Politeness' },
      { phrase: 'দয়া করে', translation: 'Please', context: 'Politeness' },
      { phrase: 'মাফ করবেন', translation: 'Excuse me', context: 'Apology' },
    ],
  };

  const phrases = activeLanguage ? phrasesByLanguage[activeLanguage.code] : phrasesByLanguage.spanish;

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [phrases.length]);

  return (
    <div
      ref={ref}
      className={`h-full transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <div className="h-full bg-white rounded-2xl border border-gray-100 p-5 overflow-hidden flex flex-col">
        <div className="flex items-center gap-3 mb-3">
          <div className={`p-2 rounded-xl bg-gradient-to-br ${activeLanguage?.gradient || 'from-orange-500 to-pink-500'} text-white`}>
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-gray-900">Essential Phrases</h3>
            <p className="text-xs text-gray-500">Learn the most useful expressions</p>
          </div>
        </div>

        {/* Animated phrase display */}
        <div className="space-y-3">
          {phrases.map((phrase, index) => (
            <div
              key={phrase.phrase}
              className={`
                p-3 rounded-xl border transition-all duration-500
                ${index === phraseIndex
                  ? 'bg-orange-50 border-orange-200 scale-[1.02]'
                  : 'bg-gray-50 border-gray-100 opacity-60'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm truncate ${
                    index === phraseIndex ? 'text-gray-900' : 'text-gray-600'
                  }`}>
                    {phrase.phrase}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{phrase.translation}</p>
                </div>
                <span className={`
                  text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 ml-2
                  ${index === phraseIndex
                    ? 'bg-orange-100 text-orange-600'
                    : 'bg-gray-100 text-gray-500'
                  }
                `}>
                  {phrase.context}
                </span>
              </div>
              {index === phraseIndex && (
                <div className="mt-2 flex items-center gap-1">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-0.5 bg-gradient-to-t ${activeLanguage?.gradient || 'from-orange-500 to-pink-500'} rounded-full`}
                        style={{
                          height: `${8 + Math.sin(Date.now() / 200 + i) * 6}px`,
                          animation: 'waveform-pulse 0.6s ease-in-out infinite',
                          animationDelay: `${i * 80}ms`,
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-400 ml-1">Tap to listen</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Learning Stats component - shows animated progress metrics
function LearningStats({ activeLanguage }: { activeLanguage: Language | null }) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.3, triggerOnce: true });
  const [animatedStats, setAnimatedStats] = useState({ words: 0, streak: 0, minutes: 0 });

  const targetStats = { words: 247, streak: 12, minutes: 45 };

  useEffect(() => {
    if (!isVisible) return;

    const duration = 1500;
    const steps = 30;
    const stepDuration = duration / steps;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic

      setAnimatedStats({
        words: Math.round(targetStats.words * eased),
        streak: Math.round(targetStats.streak * eased),
        minutes: Math.round(targetStats.minutes * eased),
      });

      if (step >= steps) {
        clearInterval(interval);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [isVisible]);

  const stats = [
    { label: 'Words Learned', value: animatedStats.words, icon: '📚', color: 'orange' },
    { label: 'Day Streak', value: animatedStats.streak, icon: '🔥', color: 'pink' },
    { label: 'Minutes Today', value: animatedStats.minutes, icon: '⏱️', color: 'purple' },
  ];

  return (
    <div
      ref={ref}
      className={`h-full transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <div className="h-full bg-white rounded-2xl border border-gray-100 p-5 overflow-hidden flex flex-col">
        <div className="flex items-center gap-3 mb-3">
          <div className={`p-2 rounded-xl bg-gradient-to-br ${activeLanguage?.gradient || 'from-orange-500 to-pink-500'} text-white`}>
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-gray-900">Your Progress</h3>
            <p className="text-xs text-gray-500">
              {activeLanguage ? `Learning ${activeLanguage.name}` : 'Start your journey'}
            </p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center p-3 bg-gray-50 rounded-xl border border-gray-100 transition-all duration-500"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <p className={`text-xl font-bold bg-gradient-to-r ${activeLanguage?.gradient || 'from-orange-500 to-pink-500'} bg-clip-text text-transparent`}>
                {stat.value}
              </p>
              <p className="text-[10px] text-gray-500 leading-tight">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Daily Goal</span>
            <span className="font-medium text-gray-700">75%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${activeLanguage?.gradient || 'from-orange-500 to-pink-500'} rounded-full transition-all duration-1000`}
              style={{ width: isVisible ? '75%' : '0%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

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

  return (
    <section
      id="languages"
      ref={ref}
      className="py-32 bg-gradient-to-b from-white to-gray-50 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div
            className={`inline-flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full text-sm font-medium text-gray-700 mb-6 shadow-sm transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Globe className="w-4 h-4 text-orange-500" />
            <span>9 Languages & Growing</span>
          </div>

          <h2
            className={`text-5xl md:text-6xl font-bold mb-6 text-gray-900 tracking-tight transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Learn Any Language
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-pink-600">
              Your Way
            </span>
          </h2>

          <p
            className={`text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            From Spanish to Japanese, our AI adapts to each language's unique patterns.
            <span className="text-gray-900 font-medium block mt-2">
              Click any language to see the learning flow in action.
            </span>
          </p>
        </div>

        {/* Main grid layout */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12 items-stretch">
          {/* Language cards grid - 2 columns */}
          <div className="lg:col-span-2 grid sm:grid-cols-2 md:grid-cols-3 gap-4 content-start">
            {languages.map((lang, index) => (
              <LanguageCard
                key={lang.code}
                language={lang}
                isActive={activeLanguageIndex === index}
                onClick={() => handleLanguageClick(index)}
                delay={index * 80}
              />
            ))}
          </div>

          {/* Side panel with script showcase and learning path */}
          <div className="flex flex-col gap-4">
            <div className="flex-1">
              <ScriptShowcase activeLanguage={activeLanguage} />
            </div>
            <div className="flex-1">
              <LearningPathVisual activeLanguage={activeLanguage} />
            </div>
            <div className="flex-1">
              <QuickPhrases activeLanguage={activeLanguage} />
            </div>
            <div className="flex-1">
              <LearningStats activeLanguage={activeLanguage} />
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
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-all duration-200 hover:scale-105 active:scale-95 group"
          >
            Start Learning for Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="text-sm text-gray-500 mt-4">No credit card required • Free forever plan</p>
        </div>
      </div>
    </section>
  );
}
