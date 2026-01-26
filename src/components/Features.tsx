import React, { useEffect, useState } from 'react';
import { MessageCircle, Mic, TrendingUp, Languages, Brain, Zap } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

// Breadcrumb Flow Component
function BreadcrumbFlow({ steps, active }: { steps: string[]; active: number }) {
  return (
    <div className="breadcrumb-flow justify-center mt-4">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`breadcrumb-step px-3 py-1.5 rounded-lg text-xs font-medium border ${index === active
              ? 'active bg-orange-100 border-orange-300 text-orange-700'
              : 'bg-gray-50 border-gray-200 text-gray-500'
            }`}
        >
          {step}
        </div>
      ))}
    </div>
  );
}

// Feature Card with Narrative Demo
function FeatureCard({
  icon: Icon,
  color,
  title,
  description,
  demo,
  delay = 0,
}: {
  icon: any;
  color: string;
  title: string;
  description: string;
  demo: React.ReactNode;
  delay?: number;
}) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.3, triggerOnce: true });

  const colorClasses = {
    orange: 'bg-orange-50 border-orange-100 text-orange-600',
    pink: 'bg-pink-50 border-pink-100 text-pink-600',
    purple: 'bg-purple-50 border-purple-100 text-purple-600',
    blue: 'bg-blue-50 border-blue-100 text-blue-600',
    green: 'bg-green-50 border-green-100 text-green-600',
    amber: 'bg-amber-50 border-amber-100 text-amber-600',
  };

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${isVisible ? 'is-visible' : ''} card p-8 hover:shadow-lg`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className={`${colorClasses[color as keyof typeof colorClasses]} inline-flex p-3 rounded-xl mb-6 border`}>
        <Icon className="w-7 h-7" />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>

      {/* Narrative Demo */}
      <div className="narrative-demo bg-gray-50 rounded-xl p-6 border border-gray-100">
        {demo}
      </div>
    </div>
  );
}

export default function Features() {
  // Demo states for each feature
  const [conversationStep, setConversationStep] = useState(0);
  const [pronunciationStep, setPronunciationStep] = useState(0);
  const [lessonStep, setLessonStep] = useState(0);
  const [translationStep, setTranslationStep] = useState(0);
  const [progressStep, setProgressStep] = useState(0);
  const [vocabStep, setVocabStep] = useState(0);

  // Animate conversation demo
  useEffect(() => {
    const interval = setInterval(() => {
      setConversationStep((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Animate pronunciation demo
  useEffect(() => {
    const interval = setInterval(() => {
      setPronunciationStep((prev) => (prev + 1) % 4);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  // Animate lesson flow demo
  useEffect(() => {
    const interval = setInterval(() => {
      setLessonStep((prev) => (prev + 1) % 4);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  // Animate translation demo
  useEffect(() => {
    const interval = setInterval(() => {
      setTranslationStep((prev) => (prev + 1) % 3);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  // Animate progress demo
  useEffect(() => {
    const interval = setInterval(() => {
      setProgressStep((prev) => (prev + 1) % 5);
    }, 1600);
    return () => clearInterval(interval);
  }, []);

  // Animate vocab demo
  useEffect(() => {
    const interval = setInterval(() => {
      setVocabStep((prev) => (prev + 1) % 5);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="features" className="py-32 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 tracking-tight">
            Features That Actually
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-pink-600">
              Make Learning Fun
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Every feature is designed to demonstrate how it works through meaningful animations.
            <span className="text-gray-900 font-medium block mt-2">Watch them come to life.</span>
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1: AI Conversation Tutor */}
          <FeatureCard
            icon={MessageCircle}
            color="orange"
            title="AI Conversation Tutor"
            description="Chat with an AI that suggests corrections and highlights improvements in real-time."
            delay={0}
            demo={
              <>
                <div className="space-y-3">
                  <div
                    className={`transition-all duration-500 ${conversationStep >= 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                      }`}
                  >
                    <div className="bg-white p-3 rounded-lg text-sm text-gray-700 border border-gray-200">
                      "Como estas?"
                    </div>
                  </div>

                  <div
                    className={`transition-all duration-500 ${conversationStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                      }`}
                  >
                    <div className="bg-orange-500 text-white p-3 rounded-lg text-sm">
                      Try: "<span className="font-semibold">¿Cómo estás?</span>" with accents!
                    </div>
                  </div>

                  <div
                    className={`transition-all duration-500 ${conversationStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                      }`}
                  >
                    <div className="bg-white p-3 rounded-lg text-sm border border-gray-200">
                      <span className="text-gray-400 line-through">Como estas?</span>
                      <span className="ml-2 text-gray-700">→ ¿Cómo estás?</span>
                    </div>
                  </div>

                  <div
                    className={`transition-all duration-500 ${conversationStep >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                      }`}
                  >
                    <div className="bg-green-50 border border-green-200 p-3 rounded-lg flex items-center gap-2">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm text-green-700 font-medium">Perfect! 🎉</span>
                    </div>
                  </div>
                </div>

                <BreadcrumbFlow
                  steps={['Input', 'Analyze', 'Correct', 'Celebrate']}
                  active={conversationStep}
                />
              </>
            }
          />

          {/* Feature 2: Pronunciation Coach */}
          <FeatureCard
            icon={Mic}
            color="pink"
            title="Pronunciation Coach"
            description="Real-time waveform analysis with instant feedback on your pronunciation accuracy."
            delay={100}
            demo={
              <>
                <div className="space-y-4">
                  {/* Waveform visualization */}
                  <div className="flex items-end justify-center gap-1 h-16">
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 bg-pink-500 rounded-full transition-all duration-300 ${pronunciationStep >= 1 ? 'animate-waveform' : ''
                          }`}
                        style={{
                          height: pronunciationStep >= 1 ? `${Math.random() * 60 + 20}%` : '20%',
                          animationDelay: `${i * 50}ms`,
                        }}
                      ></div>
                    ))}
                  </div>

                  {/* Phoneme highlighting */}
                  <div
                    className={`transition-all duration-500 ${pronunciationStep >= 2 ? 'opacity-100' : 'opacity-40'
                      }`}
                  >
                    <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                      <span className="text-lg font-medium">
                        <span className={pronunciationStep >= 2 ? 'bg-pink-200 px-1 rounded' : ''}>Bo</span>
                        <span className={pronunciationStep >= 3 ? 'bg-pink-200 px-1 rounded' : ''}>njour</span>
                      </span>
                    </div>
                  </div>

                  {/* Score bubble */}
                  <div
                    className={`transition-all duration-500 ${pronunciationStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                      }`}
                  >
                    <div className="bg-pink-500 text-white rounded-full px-4 py-2 text-center font-bold">
                      Score: 94%
                    </div>
                  </div>
                </div>

                <BreadcrumbFlow
                  steps={['Speak', 'Analyze', 'Highlight', 'Score']}
                  active={pronunciationStep}
                />
              </>
            }
          />

          {/* Feature 3: Adaptive Lesson Flow */}
          <FeatureCard
            icon={TrendingUp}
            color="purple"
            title="Adaptive Lesson Flow"
            description="Personalized learning path that adapts to your progress and skill level."
            delay={200}
            demo={
              <>
                <div className="space-y-3">
                  {['Beginner', 'Practice', 'Quiz', 'Reward'].map((tile, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border-2 transition-all duration-500 ${index === lessonStep
                          ? 'bg-purple-100 border-purple-400 scale-105 shadow-lg'
                          : index < lessonStep
                            ? 'bg-green-50 border-green-300'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">{tile}</span>
                        {index < lessonStep && (
                          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                        {index === lessonStep && (
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <BreadcrumbFlow
                  steps={['Beginner', 'Practice', 'Quiz', 'Reward']}
                  active={lessonStep}
                />
              </>
            }
          />

          {/* Feature 4: Instant Translation */}
          <FeatureCard
            icon={Languages}
            color="blue"
            title="Instant Translation"
            description="Source text morphs into translation with contextual examples that slide into view."
            delay={300}
            demo={
              <>
                <div className="space-y-4">
                  {/* Morphing text */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200 text-center min-h-[60px] flex items-center justify-center">
                    <p
                      className={`text-lg font-medium transition-all duration-700 ${translationStep === 1 ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'
                        }`}
                    >
                      {translationStep < 1 ? 'Hello, how are you?' : 'Bonjour, comment allez-vous?'}
                    </p>
                  </div>

                  {/* Contextual examples slide up */}
                  <div
                    className={`transition-all duration-500 ${translationStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                      }`}
                  >
                    <div className="space-y-2">
                      <div className="bg-blue-50 border border-blue-200 p-2 rounded-lg text-xs">
                        <span className="font-medium text-blue-700">Formal:</span> Comment allez-vous?
                      </div>
                      <div className="bg-blue-50 border border-blue-200 p-2 rounded-lg text-xs">
                        <span className="font-medium text-blue-700">Casual:</span> Ça va?
                      </div>
                    </div>
                  </div>
                </div>

                <BreadcrumbFlow
                  steps={['Original', 'Morph', 'Context']}
                  active={translationStep}
                />
              </>
            }
          />

          {/* Feature 5: Progress Visualization */}
          <FeatureCard
            icon={Zap}
            color="amber"
            title="Progress Visualization"
            description="Animated journey path that lights up as you achieve milestones."
            delay={400}
            demo={
              <>
                <div className="space-y-4">
                  {/* Progress path */}
                  <div className="flex items-center justify-between">
                    {[...Array(5)].map((_, index) => (
                      <React.Fragment key={index}>
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-500 ${index <= progressStep
                              ? 'bg-amber-500 text-white scale-110'
                              : 'bg-gray-200 text-gray-400'
                            }`}
                        >
                          {index + 1}
                        </div>
                        {index < 4 && (
                          <div
                            className={`flex-1 h-1 mx-1 rounded-full transition-all duration-500 ${index < progressStep ? 'bg-amber-500' : 'bg-gray-200'
                              }`}
                          ></div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Milestone celebration */}
                  <div
                    className={`transition-all duration-500 ${progressStep === 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                      }`}
                  >
                    <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-center">
                      <span className="text-2xl">🎉</span>
                      <p className="text-sm font-medium text-amber-700 mt-1">Milestone Reached!</p>
                    </div>
                  </div>
                </div>

                <BreadcrumbFlow
                  steps={['Start', 'Learn', 'Practice', 'Master', 'Celebrate']}
                  active={progressStep}
                />
              </>
            }
          />

          {/* Feature 6: Vocabulary Builder */}
          <FeatureCard
            icon={Brain}
            color="green"
            title="Vocabulary Builder"
            description="Interactive word cards with layered information that reveals context and usage."
            delay={500}
            demo={
              <>
                <div className="relative h-48">
                  {/* Card flip animation */}
                  <div
                    className={`absolute inset-0 transition-all duration-700 ${vocabStep % 2 === 0 ? 'opacity-100 rotate-0' : 'opacity-0 rotate-y-180'
                      }`}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <div className="bg-white border-2 border-green-300 rounded-xl p-6 h-full flex flex-col items-center justify-center">
                      <p className="text-3xl font-bold text-gray-900 mb-2">Bonjour</p>
                      <p className="text-sm text-gray-500">French</p>
                    </div>
                  </div>

                  <div
                    className={`absolute inset-0 transition-all duration-700 ${vocabStep % 2 === 1 ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-y-180'
                      }`}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <div className="bg-green-50 border-2 border-green-300 rounded-xl p-6 h-full flex flex-col justify-between">
                      <div>
                        <p className="text-lg font-bold text-green-700 mb-2">Hello</p>
                        <p className="text-sm text-gray-600 mb-3">
                          "Bonjour madame, comment allez-vous?"
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Formal greeting</span>
                      </div>
                    </div>
                  </div>
                </div>

                <BreadcrumbFlow
                  steps={['Word', 'Definition', 'Example', 'Context', 'Memory']}
                  active={vocabStep}
                />
              </>
            }
          />
        </div>
      </div>
    </section>
  );
}