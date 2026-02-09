import React, { useEffect, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { getStaggerStyle } from '../utils/animationHelpers';

export default function Hero() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const [demoStep, setDemoStep] = useState(0);

  // Narrative micro-demo: AI conversation flow
  useEffect(() => {
    if (!isVisible) return;

    const steps = [0, 1, 2, 3];
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep = (currentStep + 1) % steps.length;
      setDemoStep(currentStep);
    }, 2400);

    return () => clearInterval(interval);
  }, [isVisible]);

  const words = ['Master', 'Any', 'Language'];
  const highlightWords = ['Faster', 'Than', 'Ever'];

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-page pt-24"
    >
      {/* Animated Grid Background */}
      <div className="absolute inset-0 hero-grid opacity-60" ></div>

      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        {/* Badge with sparkle */}
        <div
          className={`section-kicker mb-8 shadow-sm transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
        >
          <Sparkles className="w-4 h-4 text-accent" />
          <span>AI-Powered Language Learning</span>
        </div>

        {/* Animated Headline with word reveals */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-primary leading-tight tracking-tight">
          <div className="mb-2">
            {words.map((word, index) => (
              <span
                key={index}
                className="inline-block mr-4"
                style={{
                  ...getStaggerStyle(index, 120),
                  animation: isVisible ? 'word-reveal 0.8s var(--ease-expressive) forwards' : 'none',
                  opacity: isVisible ? 1 : 0,
                }}
              >
                {word}
              </span>
            ))}
          </div>
          <div className="block">
            {highlightWords.map((word, index) => (
              <span
                key={index}
                className="inline-block mr-4 text-gradient"
                style={{
                  ...getStaggerStyle(index + words.length, 120),
                  animation: isVisible ? 'word-reveal 0.8s var(--ease-expressive) forwards' : 'none',
                  opacity: isVisible ? 1 : 0,
                }}
              >
                {word}
              </span>
            ))}
          </div>
        </h1>

        {/* Subheadline */}
        <p
          className={`text-xl md:text-2xl text-muted mb-10 max-w-3xl mx-auto leading-relaxed transition-all duration-700 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
        >
          <span className="sm:whitespace-nowrap">AI-powered conversations, personalized lessons, and real-world practice.</span>
          <span className="text-primary font-medium block mt-2">
            Go from zero to fluent in record time.
          </span>
        </p>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 transition-all duration-700 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
        >
          <Link
            to="/signup"
            className="group btn-primary px-8 py-4 text-lg flex items-center gap-2 justify-center"
          >
            Start Learning Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <button 
            onClick={() => {
              const featuresSection = document.getElementById('features');
              featuresSection?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="btn-secondary px-8 py-4 text-lg"
          >
            Know More
          </button>
        </div>

        {/* Narrative Micro-Demo: AI Conversation Flow */}
        <div
          className={`narrative-demo max-w-2xl mx-auto transition-all duration-700 delay-1200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
        >
          <div className="glass-card p-8 rounded-2xl">
            <div className="space-y-4">
              {/* User message */}
              <div
                className={`transition-all duration-500 ${demoStep >= 0 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                  }`}
              >
                <div className="bg-surface-2 p-4 rounded-xl rounded-br-none border border-default max-w-xs">
                  <p className="text-primary text-sm">
                    "I want to learn how to order food in Spanish"
                  </p>
                </div>
              </div>

              {/* AI analyzing */}
              <div
                className={`transition-all duration-500 ${demoStep >= 1 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                  }`}
              >
                <div className="bg-accent text-on-accent p-4 rounded-xl rounded-bl-none max-w-md ml-auto">
                  <p className="text-sm mb-2">
                    ¡Perfecto! Let's start with: <strong>"Quisiera ordenar..."</strong>
                  </p>
                  <div className="flex items-center gap-2 text-xs opacity-90">
                    <div className="w-1.5 h-1.5 bg-surface rounded-full animate-pulse"></div>
                    <span>AI analyzing your level...</span>
                  </div>
                </div>
              </div>

              {/* Correction highlight */}
              <div
                className={`transition-all duration-500 ${demoStep >= 2 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                  }`}
              >
                <div className="bg-surface-2 p-4 rounded-xl rounded-br-none border border-default max-w-xs">
                  <p className="text-primary text-sm">
                    "Quisiera <span className="bg-warning-soft px-1 rounded">ordenar</span> una pizza"
                  </p>
                </div>
              </div>

              {/* AI feedback */}
              <div
                className={`transition-all duration-500 ${demoStep >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  }`}
              >
                <div className="bg-success-soft border border-success p-4 rounded-xl flex items-start gap-3">
                  <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="text-sm">
                    <p className="text-success font-medium mb-1">Perfect pronunciation! 🎉</p>
                    <p className="text-muted">You're ready for the next phrase.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Value Props - No fake statistics */}
        <div
          className={`mt-16 flex flex-wrap justify-center items-center gap-8 text-sm text-muted font-medium transition-all duration-700 delay-1400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent-4 rounded-full"></div>
            <span>Personalized AI Tutor</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            <span>Real-Time Feedback</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent-3 rounded-full"></div>
            <span>Adaptive Learning Path</span>
          </div>
        </div>
      </div>
    </section >
  );
}
