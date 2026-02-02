import { useState } from 'react';
import { Play, Sparkles, Volume2 } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { Link } from 'react-router-dom';

const studioModes = [
    {
        title: 'Story Studio',
        description: 'Learn inside short narratives that mirror real life.',
        tone: 'tone-ember',
    },
    {
        title: 'Sound Lab',
        description: 'Practice cadence and rhythm with guided listening.',
        tone: 'tone-iris',
    },
    {
        title: 'Recall Sprint',
        description: 'Tight review loops that lock new words in place.',
        tone: 'tone-mint',
    },
];

const studioScreens = [
    {
        title: 'Café Morning',
        subtitle: 'Ordering breakfast in Madrid',
        prompt: '“¿Me trae un café con leche?”',
        highlight: 'Natural pacing + cultural tip',
    },
    {
        title: 'Sound Lab',
        subtitle: 'Shadow the rhythm',
        prompt: 'Listen → Repeat → Refine',
        highlight: 'Tone feedback in 6 seconds',
    },
    {
        title: 'Recall Sprint',
        subtitle: '90-second review',
        prompt: 'Rapid prompts & fast recall',
        highlight: 'Streaks built from focus',
    },
];

export default function AppShowcase() {
    const { ref, isVisible } = useScrollAnimation({ threshold: 0.3 });
    const [activeMode, setActiveMode] = useState(0);

    return (
        <section ref={ref} className="relative py-32 bg-page border-t border-default">
            {/* Gradient overlay at bottom to blend into footer */}
            <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none" style={{ 
                background: 'linear-gradient(to bottom, rgba(246, 246, 244, 0) 0%, #d5d8de 100%)'
            }} />
            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <div className="section-kicker mx-auto mb-6">Story Studio</div>
                    <h2 className="section-title mb-4">
                        A studio for speaking,
                        <span className="block text-gradient">not just memorizing.</span>
                    </h2>
                    <p className="section-subtitle mx-auto">
                        Every mode is designed to keep your brain in motion: audio, memory, and context all
                        moving together.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-stretch">
                    {/* Mode list */}
                    <div className={`space-y-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'}`}>
                        {studioModes.map((mode, index) => (
                            <button
                                key={mode.title}
                                onClick={() => setActiveMode(index)}
                                className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 ${
                                    activeMode === index
                                        ? 'border-strong bg-surface shadow-soft scale-[1.02]'
                                        : 'border-default bg-surface-2 hover:border-strong'
                                }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${mode.tone}`}>
                                        <Sparkles className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-primary mb-1">{mode.title}</h3>
                                        <p className="text-muted">{mode.description}</p>
                                    </div>
                                </div>
                            </button>
                        ))}

                        <Link to="/signin" className="w-full btn-primary px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3">
                            <Play className="w-5 h-5" />
                            Launch a Session
                        </Link>
                    </div>

                    {/* Studio preview */}
                    <div className={`relative transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'}`}>
                        <div className="glass-card rounded-3xl p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.2em] text-soft">Live Preview</p>
                                    <h3 className="text-2xl font-semibold text-primary">{studioScreens[activeMode].title}</h3>
                                    <p className="text-sm text-muted">{studioScreens[activeMode].subtitle}</p>
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-surface-2 border border-default flex items-center justify-center">
                                    <Volume2 className="w-5 h-5 text-accent" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-surface-2 border border-default rounded-2xl p-5">
                                    <p className="text-xs uppercase tracking-[0.2em] text-soft">Prompt</p>
                                    <p className="text-xl font-semibold text-primary mt-2">{studioScreens[activeMode].prompt}</p>
                                </div>

                                <div className="bg-surface-2 border border-default rounded-2xl p-5 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.2em] text-soft">Insight</p>
                                        <p className="text-base font-semibold text-primary mt-2">{studioScreens[activeMode].highlight}</p>
                                    </div>
                                    <div className="flex gap-1">
                                        {[0, 1, 2].map((index) => (
                                            <span
                                                key={index}
                                                className="w-2 h-2 rounded-full bg-accent"
                                                style={{ opacity: 0.3 + index * 0.25 }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-surface-2 border border-default rounded-2xl p-5">
                                    <div className="flex items-center justify-between text-sm text-muted">
                                        <span>Session energy</span>
                                        <span className="text-accent">Smooth + Focused</span>
                                    </div>
                                    <div className="mt-3 h-2 bg-surface-3 rounded-full overflow-hidden">
                                        <div className="h-full bg-accent rounded-full" style={{ width: '68%' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
