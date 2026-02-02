import { Compass, Headphones, Sparkles, Target } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const ritualCards = [
    {
        title: 'Set the Intent',
        description: 'Choose a goal and let the session shape itself around your day.',
        icon: Compass,
        tone: 'tone-ember',
    },
    {
        title: 'Listen & Shadow',
        description: 'Hear native pacing, then echo with instant feedback on tone.',
        icon: Headphones,
        tone: 'tone-iris',
    },
    {
        title: 'Anchor the Memory',
        description: 'Turn the lesson into a micro-story you can recall later.',
        icon: Sparkles,
        tone: 'tone-mint',
    },
];

export default function InteractiveDemo() {
    const { ref, isVisible } = useScrollAnimation({ threshold: 0.2, triggerOnce: true });

    return (
        <section ref={ref} className="relative py-32 bg-page border-t border-default overflow-hidden">
            <div className="absolute inset-0 hero-grid opacity-40" />

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <div className="section-kicker mx-auto mb-6">Momentum Studio</div>
                    <h2 className="section-title mb-4">
                        Build a learning ritual that
                        <span className="block text-gradient">feels effortless.</span>
                    </h2>
                    <p className="section-subtitle mx-auto">
                        Each session blends intent, rhythm, and recall. Nothing flashy—just a calm loop that
                        makes progress inevitable.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-10 items-stretch">
                    <div className="grid gap-6">
                        {ritualCards.map((card, index) => {
                            const Icon = card.icon;
                            return (
                                <div
                                    key={card.title}
                                    className={`card-interactive p-6 flex items-start gap-4 transition-all duration-700 ${
                                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                                    }`}
                                    style={{ transitionDelay: `${index * 120}ms` }}
                                >
                                    <div className={`p-3 rounded-xl border ${card.tone}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-primary mb-2">{card.title}</h3>
                                        <p className="text-muted">{card.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div
                        className={`glass-card rounded-3xl p-8 transition-all duration-700 ${
                            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                        }`}
                        style={{ transitionDelay: '200ms' }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-soft">Session Composer</p>
                                <h3 className="text-2xl font-semibold text-primary">Evening Focus • 18 min</h3>
                            </div>
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-surface-2 border border-default">
                                <Target className="w-6 h-6 text-accent" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[
                                { label: 'Warm-up', value: '2 mins', detail: 'Pronunciation mirror' },
                                { label: 'Dialogue', value: '8 mins', detail: 'Restaurant ordering flow' },
                                { label: 'Recall', value: '5 mins', detail: 'Story recap + prompts' },
                                { label: 'Reflection', value: '3 mins', detail: 'Notes + next step' },
                            ].map((item, index) => (
                                <div
                                    key={item.label}
                                    className="flex items-center justify-between p-4 rounded-2xl bg-surface-2 border border-default"
                                >
                                    <div>
                                        <p className="text-sm text-soft">{item.label}</p>
                                        <p className="text-base font-semibold text-primary">{item.detail}</p>
                                    </div>
                                    <span className="text-sm font-semibold text-accent">{item.value}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 flex items-center justify-between text-xs text-muted">
                            <span>Auto-adapts as you improve.</span>
                            <span className="text-accent">Preview next session →</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
