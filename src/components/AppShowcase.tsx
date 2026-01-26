import { useState } from 'react';
import { MessageSquare, Mic, BookOpen, Trophy, Play } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const features = [
    {
        icon: MessageSquare,
        title: 'AI Conversations',
        description: 'Practice real dialogues with instant feedback',
        color: 'from-orange-500 to-pink-500',
    },
    {
        icon: Mic,
        title: 'Pronunciation',
        description: 'Perfect your accent with AI analysis',
        color: 'from-purple-500 to-pink-500',
    },
    {
        icon: BookOpen,
        title: 'Adaptive Lessons',
        description: 'Personalized learning paths',
        color: 'from-blue-500 to-cyan-500',
    },
    {
        icon: Trophy,
        title: 'Gamified Progress',
        description: 'Track achievements and streaks',
        color: 'from-green-500 to-emerald-500',
    },
];

export default function AppShowcase() {
    const { ref, isVisible } = useScrollAnimation({ threshold: 0.3 });
    const [activeFeature, setActiveFeature] = useState(0);

    return (
        <section ref={ref} className="py-32 bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 tracking-tight">
                        Experience
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-pink-600">
                            LinguaSpark
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        A complete language learning platform designed for real-world fluency
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* App Preview */}
                    <div className={`relative transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                        <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-2xl">
                            {/* Phone mockup */}
                            <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
                                <div className="bg-gray-100 px-4 py-3 flex items-center gap-2">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                    </div>
                                    <div className="flex-1 text-center text-xs text-gray-500 font-medium">LinguaSpark</div>
                                </div>

                                <div className="p-6 min-h-[500px] bg-gradient-to-br from-orange-50 to-pink-50">
                                    {/* Dynamic content based on active feature */}
                                    {activeFeature === 0 && (
                                        <div className="space-y-4">
                                            <div className="bg-white p-4 rounded-xl shadow-sm">
                                                <p className="text-gray-700">¿Cómo estás?</p>
                                            </div>
                                            <div className="bg-orange-500 text-white p-4 rounded-xl ml-8">
                                                <p>¡Muy bien, gracias!</p>
                                            </div>
                                            <div className="bg-green-50 border border-green-200 p-3 rounded-lg text-sm text-green-700">
                                                ✓ Perfect grammar and pronunciation!
                                            </div>
                                        </div>
                                    )}

                                    {activeFeature === 1 && (
                                        <div className="space-y-6">
                                            <div className="text-center">
                                                <div className="w-20 h-20 bg-pink-500 rounded-full mx-auto flex items-center justify-center mb-4">
                                                    <Mic className="w-10 h-10 text-white" />
                                                </div>
                                                <p className="text-gray-700 text-lg font-medium mb-2">Say: "Bonjour"</p>
                                            </div>
                                            <div className="flex items-end justify-center gap-1 h-24">
                                                {[...Array(10)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className="w-3 bg-pink-500 rounded-full animate-waveform"
                                                        style={{ height: `${Math.random() * 80 + 20}%`, animationDelay: `${i * 50}ms` }}
                                                    ></div>
                                                ))}
                                            </div>
                                            <div className="bg-pink-500 text-white rounded-full px-6 py-3 text-center font-bold">
                                                Score: 96%
                                            </div>
                                        </div>
                                    )}

                                    {activeFeature === 2 && (
                                        <div className="space-y-3">
                                            <div className="bg-blue-100 border-2 border-blue-400 p-4 rounded-xl">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium text-gray-800">Lesson 1: Greetings</span>
                                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-purple-100 border-2 border-purple-400 p-4 rounded-xl scale-105">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium text-gray-800">Lesson 2: Numbers</span>
                                                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                                                </div>
                                            </div>
                                            <div className="bg-gray-100 border-2 border-gray-300 p-4 rounded-xl opacity-60">
                                                <span className="font-medium text-gray-600">Lesson 3: Food</span>
                                            </div>
                                        </div>
                                    )}

                                    {activeFeature === 3 && (
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between">
                                                {[...Array(5)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${i < 3 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                                                            }`}
                                                    >
                                                        {i + 1}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="bg-green-50 border border-green-200 p-6 rounded-xl text-center">
                                                <Trophy className="w-16 h-16 text-green-500 mx-auto mb-3" />
                                                <p className="text-2xl font-bold text-gray-900">3-Day Streak!</p>
                                                <p className="text-gray-600 mt-2">Keep it up!</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl blur-2xl opacity-20 -z-10"></div>
                        </div>
                    </div>

                    {/* Feature List */}
                    <div className={`space-y-4 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            const isActive = index === activeFeature;

                            return (
                                <button
                                    key={index}
                                    onClick={() => setActiveFeature(index)}
                                    className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 ${isActive
                                        ? 'border-orange-500 bg-orange-50 shadow-lg scale-105'
                                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                                        }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0`}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-900 mb-1">{feature.title}</h3>
                                            <p className="text-gray-600">{feature.description}</p>
                                        </div>
                                        {isActive && (
                                            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                                        )}
                                    </div>
                                </button>
                            );
                        })}

                        <div className="pt-6">
                            <button className="w-full bg-gradient-to-r from-orange-600 to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-orange-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-105">
                                <Play className="w-5 h-5" />
                                Try It Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
