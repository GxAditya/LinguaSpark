import React, { useEffect, useState } from 'react';
import { MessageCircle, Mic, TrendingUp, Languages, Brain, Zap } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

// Breadcrumb Flow Component
function BreadcrumbFlow({ steps, active, compact }: { steps: string[]; active: number; compact?: boolean }) {
  return (
    <div className={`breadcrumb-flow justify-center ${compact ? 'mt-2' : 'mt-4'}`}>
      {steps.map((step, index) => (
        <div
          key={index}
          className={`breadcrumb-step ${compact ? 'px-2 py-1 text-[11px]' : 'px-3 py-1.5 text-xs'} rounded-lg font-medium border ${index === active
              ? 'active bg-warning-soft border-warning text-warning'
              : 'bg-surface-2 border-default text-muted'
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
  title,
  description,
  demo,
  demoClassName,
  delay = 0,
}: {
  icon: any;
  title: string;
  description: string;
  demo: React.ReactNode;
  demoClassName?: string;
  delay?: number;
}) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.3, triggerOnce: true });

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${isVisible ? 'is-visible' : ''} card-interactive p-8 h-full flex flex-col`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="inline-flex p-3 rounded-xl mb-6 border border-default bg-surface-2 self-start">
        <Icon className="w-7 h-7 text-accent" />
      </div>

      <h3 className="text-2xl font-bold text-primary mb-3">{title}</h3>
      <p className="text-muted mb-6 leading-relaxed">{description}</p>

      {/* Narrative Demo */}
      <div className={`narrative-demo bg-surface-2 rounded-xl p-6 border border-default flex flex-col ${demoClassName ?? 'sm:h-64'}`}>
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
    <section id="features" className="py-32 bg-page border-t border-default">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="section-kicker mx-auto mb-6">Crafted for momentum</div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-primary tracking-tight">
            Features That Actually
            <span className="block text-gradient">
              Make Learning Fun
            </span>
          </h2>
          <p className="text-xl text-muted max-w-3xl mx-auto leading-relaxed">
            Every feature is designed to demonstrate how it works through meaningful animations.
            <span className="text-primary font-medium block mt-2">Watch them come to life.</span>
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1: AI Conversation Tutor */}
          <FeatureCard
            icon={MessageCircle}
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
                    <div className="bg-surface p-3 rounded-lg text-sm text-muted border border-default">
                      "Como estas?"
                    </div>
                  </div>

                  <div
                    className={`transition-all duration-500 ${conversationStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                      }`}
                  >
                    <div className="bg-accent text-on-accent p-3 rounded-lg text-sm">
                      Try: "<span className="font-semibold">¿Cómo estás?</span>" with accents!
                    </div>
                  </div>

                  <div
                    className={`transition-all duration-500 ${conversationStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                      }`}
                  >
                    <div className="bg-surface p-3 rounded-lg text-sm border border-default">
                      <span className="text-soft line-through">Como estas?</span>
                      <span className="ml-2 text-primary">→ ¿Cómo estás?</span>
                    </div>
                  </div>

                  <div
                    className={`transition-all duration-500 ${conversationStep >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                      }`}
                  >
                    <div className="bg-success-soft border border-success p-3 rounded-lg flex items-center gap-2">
                      <div className="w-5 h-5 bg-success rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm text-success font-medium">Perfect! 🎉</span>
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
            title="Pronunciation Coach"
            description="Real-time waveform analysis with instant feedback on your pronunciation accuracy."
            demoClassName="sm:h-72"
            delay={100}
            demo={
              <>
                <div className="space-y-4">
                  {/* Waveform visualization */}
                  <div className="flex items-end justify-center gap-1 h-16">
                    {[28, 42, 36, 52, 40, 58, 46, 38, 54, 44, 50, 34].map((height, i) => (
                      <div
                        key={i}
                        className={`w-2 bg-accent-3 rounded-full wave-bar ${pronunciationStep >= 1 ? '' : 'opacity-60'}`}
                        style={{
                          height: `${height}px`,
                          animationDelay: `${i * 80}ms`,
                        }}
                      ></div>
                    ))}
                  </div>

                  {/* Phoneme highlighting */}
                  <div
                    className={`transition-all duration-500 ${pronunciationStep >= 2 ? 'opacity-100' : 'opacity-40'
                      }`}
                  >
                    <div className="bg-surface p-3 rounded-lg border border-default text-center">
                      <span className="text-lg font-medium">
                        <span className={pronunciationStep >= 2 ? 'bg-info-soft px-1 rounded' : ''}>Bo</span>
                        <span className={pronunciationStep >= 3 ? 'bg-info-soft px-1 rounded' : ''}>njour</span>
                      </span>
                    </div>
                  </div>

                  {/* Score bubble */}
                  <div
                    className={`transition-all duration-500 ${pronunciationStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                      }`}
                  >
                    <div className="bg-accent-3 text-on-accent rounded-full px-4 py-2 text-center font-bold">
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
                          ? 'bg-info-soft border-info scale-105 shadow-lg'
                          : index < lessonStep
                            ? 'bg-success-soft border-success'
                            : 'bg-surface-2 border-default'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-primary">{tile}</span>
                        {index < lessonStep && (
                          <div className="w-5 h-5 bg-success rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                        {index === lessonStep && (
                          <div className="w-2 h-2 bg-accent-3 rounded-full animate-pulse"></div>
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
            title="Instant Translation"
            description="Source text morphs into translation with contextual examples that slide into view."
            delay={300}
            demo={
              <>
                <div className="space-y-4">
                  {/* Morphing text */}
                  <div className="bg-surface p-4 rounded-lg border border-default text-center min-h-[60px] flex items-center justify-center">
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
                      <div className="bg-info-soft border border-info p-2 rounded-lg text-xs">
                        <span className="font-medium text-info">Formal:</span> Comment allez-vous?
                      </div>
                      <div className="bg-info-soft border border-info p-2 rounded-lg text-xs">
                        <span className="font-medium text-info">Casual:</span> Ça va?
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
            title="Progress Visualization"
            description="Animated journey path that lights up as you achieve milestones."
            delay={400}
            demo={
              <>
                <div className="flex-1 flex flex-col justify-center min-h-0">
                  {/* Progress path */}
                  <div className="flex items-center justify-between mb-3">
                    {[...Array(5)].map((_, index) => (
                      <React.Fragment key={index}>
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-500 ${index <= progressStep
                                ? 'bg-accent-2 text-on-accent scale-110'
                                : 'bg-surface-3 text-soft'
                              }`}
                        >
                          {index + 1}
                        </div>
                        {index < 4 && (
                          <div
                            className={`flex-1 h-1 mx-1 rounded-full transition-all duration-500 ${index < progressStep ? 'bg-accent-2' : 'bg-surface-3'
                                }`}
                          ></div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Milestone celebration */}
                  <div
                    className={`transition-all duration-500 mt-3 ${progressStep === 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                      }`}
                  >
                    <div className="bg-warning-soft border border-warning p-2 rounded-lg text-center">
                      <span className="text-2xl">🎉</span>
                      <p className="text-xs font-semibold text-warning mt-1">Milestone Reached!</p>
                    </div>
                  </div>
                </div>

                <BreadcrumbFlow
                  steps={['Start', 'Learn', 'Practice', 'Master', 'Celebrate']}
                  active={progressStep}
                  compact
                />
              </>
            }
          />

          {/* Feature 6: Vocabulary Builder */}
          <FeatureCard
            icon={Brain}
            title="Vocabulary Builder"
            description="Interactive word cards with layered information that reveals context and usage."
            delay={500}
            demo={
              <>
                <div className="relative flex-1 min-h-0 mb-2">
                  {/* Card flip animation */}
                  <div
                    className={`absolute inset-0 transition-all duration-700 ${vocabStep % 2 === 0 ? 'opacity-100 rotate-0' : 'opacity-0 rotate-y-180'
                      }`}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <div className="bg-surface border-2 border-success rounded-xl p-3 h-full flex flex-col items-center justify-center">
                      <p className="text-3xl font-bold text-primary mb-2">Bonjour</p>
                      <p className="text-sm text-muted">French</p>
                    </div>
                  </div>

                  <div
                    className={`absolute inset-0 transition-all duration-700 ${vocabStep % 2 === 1 ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-y-180'
                      }`}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <div className="bg-success-soft border-2 border-success rounded-xl p-3 h-full flex flex-col justify-between">
                      <div>
                        <p className="text-base font-bold text-success mb-1">Hello</p>
                        <p className="text-xs text-muted mb-2">
                          "Bonjour madame, comment allez-vous?"
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-success">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <span>Formal greeting</span>
                      </div>
                    </div>
                  </div>
                </div>

                <BreadcrumbFlow
                  steps={['Word', 'Definition', 'Example', 'Context', 'Memory']}
                  active={vocabStep}
                  compact
                />
              </>
            }
          />
        </div>
      </div>
    </section>
  );
}
