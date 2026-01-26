import { useEffect, useState } from 'react';
import { BookOpen, MessageSquare, Award, Sparkles, TrendingUp } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface JourneyStage {
    id: number;
    title: string;
    icon: any;
    description: string;
    color: string;
    activities: string[];
}

const journeyStages: JourneyStage[] = [
    {
        id: 1,
        title: 'Beginner',
        icon: BookOpen,
        description: 'Start with fundamentals',
        color: 'from-blue-500 to-cyan-500',
        activities: ['Learn alphabet', 'Basic phrases', 'Simple greetings'],
    },
    {
        id: 2,
        title: 'Practice',
        icon: MessageSquare,
        description: 'Build confidence',
        color: 'from-purple-500 to-pink-500',
        activities: ['Daily conversations', 'Pronunciation drills', 'Vocabulary games'],
    },
    {
        id: 3,
        title: 'Fluent',
        icon: TrendingUp,
        description: 'Master the language',
        color: 'from-orange-500 to-amber-500',
        activities: ['Complex sentences', 'Native expressions', 'Cultural nuances'],
    },
    {
        id: 4,
        title: 'Native',
        icon: Sparkles,
        description: 'Think in the language',
        color: 'from-green-500 to-emerald-500',
        activities: ['Idioms & slang', 'Regional dialects', 'Advanced writing'],
    },
    {
        id: 5,
        title: 'Expert',
        icon: Award,
        description: 'Teach others',
        color: 'from-pink-500 to-rose-500',
        activities: ['Professional fluency', 'Translation skills', 'Teaching ability'],
    },
];

export default function InteractiveDemo() {
    const { ref, scrollProgress } = useScrollAnimation({ threshold: 0 });
    const [activeStage, setActiveStage] = useState(0);

    // Map scroll progress to active stage
    // Start at 0.1 (10% scroll) and end at 0.9 (90% scroll) for better UX
    // This prevents the first stage from being completed immediately
    // and ensures the last stage reveals before leaving viewport
    useEffect(() => {
        // Map scroll progress from 0.1 to 0.9 range to 0 to journeyStages.length
        const adjustedProgress = Math.max(0, (scrollProgress - 0.1) / 0.8);
        const stage = Math.floor(adjustedProgress * journeyStages.length);
        setActiveStage(Math.max(0, Math.min(stage, journeyStages.length - 1)));
    }, [scrollProgress]);

    return (
        <section
            ref={ref}
            className="relative py-32 bg-white text-gray-900 overflow-hidden"
        >
            {/* Animated background grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

            {/* Glowing orbs */}
            <div className="absolute top-20 left-20 w-96 h-96 bg-orange-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float delay-2000"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                {/* Section Header */}
                <div className="text-center mb-20">
                    <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
                        Your Learning
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-pink-600">
                            Journey Map
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Scroll to explore your personalized path from beginner to expert.
                        <span className="block mt-2 text-gray-500">Each stage adapts to your progress.</span>
                    </p>
                </div>

                {/* Interactive Timeline */}
                <div className="relative">
                    {/* Progress line */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-100 -translate-x-1/2 hidden lg:block">
                        <div
                            className="absolute top-0 left-0 w-full bg-gradient-to-b from-orange-500 to-pink-500 transition-all duration-500"
                            style={{ height: `${(activeStage / (journeyStages.length - 1)) * 100}%` }}
                        ></div>
                    </div>

                    {/* Journey Stages */}
                    <div className="space-y-16 lg:space-y-24">
                        {journeyStages.map((stage, index) => {
                            const isActive = index === activeStage;
                            const isPassed = index < activeStage;
                            const Icon = stage.icon;

                            return (
                                <div
                                    key={stage.id}
                                    className={`relative transition-all duration-700 ${index % 2 === 0 ? 'lg:pr-1/2' : 'lg:pl-1/2 lg:text-right'
                                        }`}
                                >
                                    {/* Stage Node */}
                                    <div
                                        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-4 items-center justify-center transition-all duration-500 lg:flex ${isActive
                                            ? 'bg-gradient-to-br ' + stage.color + ' border-white scale-125 shadow-xl'
                                            : isPassed
                                                ? 'bg-green-100 border-green-200'
                                                : 'bg-white border-gray-100'
                                            } hidden`}
                                    >
                                        <Icon className={`w-7 h-7 ${isActive ? 'text-white' : isPassed ? 'text-green-600' : 'text-gray-300'}`} />
                                    </div>

                                    {/* Stage Content */}
                                    <div
                                        className={`bg-white/80 backdrop-blur-sm border rounded-2xl p-8 transition-all duration-700 ${isActive
                                            ? 'border-orange-200 shadow-xl shadow-orange-500/10 scale-105 ring-1 ring-orange-100'
                                            : isPassed
                                                ? 'border-green-200 bg-green-50/30'
                                                : 'border-gray-100'
                                            } ${index % 2 === 0 ? 'lg:mr-12' : 'lg:ml-12'}`}
                                    >
                                        {/* Mobile icon */}
                                        <div className="lg:hidden mb-4">
                                            <div
                                                className={`inline-flex w-12 h-12 rounded-full items-center justify-center bg-gradient-to-br ${stage.color}`}
                                            >
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>
                                        </div>

                                        {/* Stage info */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <h3 className={`text-3xl font-bold ${isActive ? 'text-gray-900' : 'text-gray-800'}`}>{stage.title}</h3>
                                            {isPassed && (
                                                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            )}
                                            {isActive && (
                                                <div className="flex gap-1">
                                                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                                                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse delay-100"></div>
                                                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse delay-200"></div>
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-gray-600 mb-6 text-lg">{stage.description}</p>

                                        {/* Expandable activities */}
                                        <div
                                            className={`transition-all duration-500 overflow-hidden ${isActive ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                                }`}
                                        >
                                            <div className="space-y-2 pt-4 border-t border-gray-100">
                                                <p className="text-sm text-gray-500 font-medium mb-3">Activities:</p>
                                                {stage.activities.map((activity, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex items-center gap-3 text-gray-700 transition-all duration-300"
                                                        style={{ transitionDelay: `${i * 100}ms` }}
                                                    >
                                                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${stage.color}`}></div>
                                                        <span>{activity}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
