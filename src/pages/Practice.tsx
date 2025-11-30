import React, { useEffect, useMemo, useState } from 'react';
import DashboardHeader from '../components/DashboardHeader';
import {
  MessageCircle,
  Mic,
  Send,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Users,
  Target,
  Brain,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../context';
import {
  practiceService,
  PracticeScenarioSummary,
  PracticeSession,
  PracticeLanguage,
} from '../services';

const LANGUAGE_OPTIONS: Array<{ value: PracticeLanguage; label: string }> = [
  { value: 'spanish', label: 'Spanish' },
  { value: 'french', label: 'French' },
  { value: 'hindi', label: 'Hindi' },
];

const ICON_MAP: Record<'users' | 'target' | 'message' | 'brain', React.ReactNode> = {
  users: <Users className="w-6 h-6" />,
  target: <Target className="w-6 h-6" />,
  message: <MessageCircle className="w-6 h-6" />,
  brain: <Brain className="w-6 h-6" />,
};

const resolveLanguage = (value?: string): PracticeLanguage => {
  if (value === 'french' || value === 'hindi') return value;
  return 'spanish';
};

const getLanguageLabel = (code: string) => {
  const option = LANGUAGE_OPTIONS.find((lang) => lang.value === code);
  if (option) return option.label;
  return code ? code.charAt(0).toUpperCase() + code.slice(1) : 'Spanish';
};

const getIconForTopic = (topic: string) => {
  const normalized = topic.toLowerCase();
  if (normalized.includes('travel') || normalized.includes('hébergement') || normalized.includes('यात्रा')) {
    return ICON_MAP.target;
  }
  if (normalized.includes('health') || normalized.includes('santé') || normalized.includes('स्वास्थ्य')) {
    return ICON_MAP.brain;
  }
  if (normalized.includes('communication') || normalized.includes('संचार')) {
    return ICON_MAP.message;
  }
  if (normalized.includes('shopping') || normalized.includes('marché') || normalized.includes('खरीदारी')) {
    return ICON_MAP.message;
  }
  return ICON_MAP.users;
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'from-green-500 to-emerald-500';
    case 'medium':
      return 'from-blue-500 to-cyan-500';
    case 'hard':
      return 'from-purple-500 to-pink-500';
    default:
      return 'from-gray-500 to-gray-600';
  }
};

const formatDifficultyLabel = (difficulty: string) => difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

export default function Practice() {
  const { user } = useAuth();
  const defaultLanguage = resolveLanguage(user?.currentLanguage);
  const [selectedLanguage, setSelectedLanguage] = useState<PracticeLanguage>(defaultLanguage);
  const [isLanguageManuallySelected, setIsLanguageManuallySelected] = useState(false);
  const [scenarios, setScenarios] = useState<PracticeScenarioSummary[]>([]);
  const [scenariosLoading, setScenariosLoading] = useState(true);
  const [scenarioError, setScenarioError] = useState<string | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<PracticeScenarioSummary | null>(null);
  const [activeSession, setActiveSession] = useState<PracticeSession | null>(null);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isCompletingSession, setIsCompletingSession] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const userName = user?.name || 'Learner';

  useEffect(() => {
    let ignore = false;
    const fetchScenarios = async () => {
      setScenariosLoading(true);
      setScenarioError(null);
      try {
        const data = await practiceService.getScenarios();
        if (!ignore) {
          setScenarios(data);
        }
      } catch (error: any) {
        if (!ignore) {
          setScenarioError(error?.message || 'Failed to load practice scenarios');
        }
      } finally {
        if (!ignore) {
          setScenariosLoading(false);
        }
      }
    };

    fetchScenarios();
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (user?.currentLanguage && !isLanguageManuallySelected) {
      setSelectedLanguage(resolveLanguage(user.currentLanguage));
    }
  }, [user?.currentLanguage, isLanguageManuallySelected]);

  const filteredScenarios = useMemo(
    () => scenarios.filter((scenario) => scenario.language === selectedLanguage),
    [scenarios, selectedLanguage]
  );

  const handleLanguageChange = (value: PracticeLanguage) => {
    if (value === selectedLanguage) return;
    setIsLanguageManuallySelected(true);
    setSelectedLanguage(value);
    setSelectedScenario(null);
    setActiveSession(null);
    setSessionError(null);
    setInputValue('');
    setIsRecording(false);
  };

  const LanguageSelector = ({ id, className = '' }: { id: string; className?: string }) => (
    <div className={`flex flex-col text-sm text-gray-600 ${className}`}>
      <label htmlFor={id} className="font-semibold text-gray-800 mb-1">
        Learning language
      </label>
      <div className="relative">
        <select
          id={id}
          value={selectedLanguage}
          onChange={(event) => handleLanguageChange(event.target.value as PracticeLanguage)}
          className="appearance-none w-48 rounded-xl border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm font-medium text-gray-700 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
        >
          {LANGUAGE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
      </div>
    </div>
  );

  const handleStartScenario = async (scenario: PracticeScenarioSummary) => {
    setSelectedScenario(scenario);
    setActiveSession(null);
    setSessionError(null);
    setIsSessionLoading(true);
    setInputValue('');
    setIsRecording(false);
    try {
      const session = await practiceService.startSession({ scenarioId: scenario.id });
      setActiveSession(session);
    } catch (error: any) {
      setSessionError(error?.message || 'Unable to start practice session');
    } finally {
      setIsSessionLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!activeSession || activeSession.status !== 'active') return;
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    setIsSendingMessage(true);
    setSessionError(null);
    try {
      const session = await practiceService.sendMessage(activeSession.id, trimmed);
      setActiveSession(session);
      setInputValue('');
    } catch (error: any) {
      setSessionError(error?.message || 'Unable to send message');
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleCompleteSession = async () => {
    if (!activeSession || activeSession.status !== 'active') return;
    setIsCompletingSession(true);
    setSessionError(null);
    try {
      const session = await practiceService.completeSession(activeSession.id);
      setActiveSession(session);
    } catch (error: any) {
      setSessionError(error?.message || 'Unable to complete session');
    } finally {
      setIsCompletingSession(false);
    }
  };

  const handleExitScenario = () => {
    setSelectedScenario(null);
    setActiveSession(null);
    setSessionError(null);
    setIsSessionLoading(false);
    setIsSendingMessage(false);
    setIsCompletingSession(false);
    setInputValue('');
    setIsRecording(false);
  };

  const renderScenarioCards = () => {
    if (scenariosLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        </div>
      );
    }

    if (scenarioError) {
      return (
        <div className="card p-6 text-red-700 bg-red-50 border border-red-100">
          <p>{scenarioError}</p>
        </div>
      );
    }

    if (filteredScenarios.length === 0) {
      return (
        <div className="card p-8 text-center text-gray-700">
          <p>
            We&apos;re still preparing {getLanguageLabel(selectedLanguage)} practice scenarios. Try another language for now!
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredScenarios.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => handleStartScenario(scenario)}
            className="card-interactive p-6 text-left"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="icon-container-orange w-12 h-12 text-orange-600 group-hover:scale-110">
                {getIconForTopic(scenario.topic)}
              </div>
              <span className={`badge text-white bg-gradient-to-r ${getDifficultyColor(scenario.difficulty)}`}>
                {formatDifficultyLabel(scenario.difficulty)}
              </span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2">{scenario.title}</h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{scenario.description}</p>

            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>~{scenario.durationMinutes} minutes</span>
              <span className="badge bg-gray-100 text-gray-600">{scenario.topic}</span>
            </div>
            <div className="text-xs text-gray-600 mt-2">{getLanguageLabel(scenario.language)}</div>

            <div className="flex items-center gap-2 text-orange-600 font-semibold text-sm group-hover:gap-3 transition-all mt-4">
              Start Practice <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        ))}
      </div>
    );
  };

  const renderSessionView = () => {
    if (!selectedScenario) return null;
    const chatMessages = activeSession?.messages ?? [];
    const conversationReady = !isSessionLoading && !!activeSession;
    const sessionActive = activeSession?.status === 'active';
    const placeholder = `Type your response in ${getLanguageLabel(selectedScenario.language)}...`;

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex flex-col relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-200 to-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-200 to-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />

        <DashboardHeader userName={userName} activeTab="practice" />

        <main className="relative z-10 flex-1 max-w-5xl mx-auto w-full px-6 py-10 flex flex-col gap-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={handleExitScenario}
              className="flex items-center gap-2 text-orange-600 font-semibold hover:gap-3 transition-all group"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to scenarios
            </button>
            <LanguageSelector id="scenario-language" />
          </div>

          <div className="card p-6 space-y-4">
            <div>
              <p className="text-sm uppercase tracking-wide text-orange-500 font-semibold">Scenario</p>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">{selectedScenario.title}</h1>
              <p className="text-gray-600 mt-2">{selectedScenario.description}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
              <div>
                <p className="font-semibold text-gray-900">Difficulty</p>
                <p>{formatDifficultyLabel(selectedScenario.difficulty)}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Duration</p>
                <p>~{selectedScenario.durationMinutes} minutes</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Topic</p>
                <p>{selectedScenario.topic}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Language</p>
                <p>{getLanguageLabel(selectedScenario.language)}</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600 pt-2 border-t border-gray-100">
              <span>
                Session status:{' '}
                <span className="font-semibold text-gray-900 capitalize">{activeSession?.status || 'connecting'}</span>
              </span>
              <span className="text-gray-500 font-semibold">AI tutor ready</span>
            </div>
          </div>

          <div className="card flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto mb-4 space-y-4 bg-gradient-to-r from-orange-50/70 to-pink-50/70 rounded-2xl p-6">
              {isSessionLoading && (
                <div className="flex flex-col items-center justify-center text-center text-gray-600 gap-3 py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                  <p>Warming up your AI partner...</p>
                </div>
              )}

              {!isSessionLoading && !activeSession && (
                <div className="flex flex-col items-center justify-center text-center text-gray-600 gap-4 py-12">
                  <MessageCircle className="w-10 h-10 text-orange-400" />
                  <div>
                    <p className="font-semibold text-gray-900">We couldn&apos;t start this chat</p>
                    <p>Tap below to try again.</p>
                  </div>
                  <button
                    onClick={() => handleStartScenario(selectedScenario)}
                    className="btn-primary-md"
                  >
                    Retry session
                  </button>
                </div>
              )}

              {conversationReady && (
                <div className="space-y-4">
                  {chatMessages.length === 0 && (
                    <div className="text-center text-gray-600">
                      <p>Say hola to kick off the conversation.</p>
                    </div>
                  )}
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl shadow-sm whitespace-pre-wrap text-sm ${
                          message.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'
                        }`}
                      >
                        <p>{message.content}</p>
                        {message.feedback && (
                          <p className="text-xs text-orange-700 mt-2">Feedback: {message.feedback}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {sessionError && (
              <div className="mx-4 mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
                {sessionError}
              </div>
            )}

            <div className="flex items-center gap-3 px-4">
              <button
                onClick={() => setIsRecording((prev) => !prev)}
                disabled={!sessionActive}
                className={`p-3 rounded-full transition-all border ${
                  isRecording ? 'bg-red-500 text-white border-red-500 animate-pulse' : 'bg-white text-orange-600 border-orange-100 hover:bg-orange-50'
                } ${sessionActive ? '' : 'opacity-50 cursor-not-allowed'}`}
              >
                <Mic className="w-5 h-5" />
              </button>
              {isRecording && sessionActive && <span className="text-sm text-red-600 font-semibold">Recording...</span>}
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                handleSendMessage();
              }}
              className="flex flex-col sm:flex-row gap-3 px-4 py-4"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                disabled={!sessionActive || isSendingMessage}
                placeholder={placeholder}
                className="input-primary flex-1 disabled:bg-gray-50 disabled:text-gray-400"
              />
              <button
                type="submit"
                disabled={!sessionActive || isSendingMessage}
                className="btn-primary-md flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Send className="w-5 h-5" /> {isSendingMessage ? 'Sending...' : 'Send'}
              </button>
            </form>

            <div className="flex flex-wrap gap-3 px-4 pb-4">
              {activeSession?.status === 'active' && (
                <button
                  onClick={handleCompleteSession}
                  disabled={isCompletingSession}
                  className="px-4 py-2 rounded-xl border border-orange-200 text-orange-600 font-semibold hover:bg-orange-50 transition disabled:opacity-60"
                >
                  {isCompletingSession ? 'Saving...' : 'Mark session complete'}
                </button>
              )}
              {activeSession?.status === 'completed' && (
                <button
                  onClick={() => handleStartScenario(selectedScenario)}
                  className="px-4 py-2 rounded-xl border border-green-200 text-green-600 font-semibold hover:bg-green-50 transition"
                >
                  Start new session
                </button>
              )}
              <button
                onClick={handleExitScenario}
                className="px-4 py-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
              >
                Choose another scenario
              </button>
            </div>
          </div>

        </main>
        <div className="relative z-10 max-w-5xl mx-auto w-full px-6 pb-10">
          <div className="alert-info">
            <h4 className="font-semibold text-blue-900 mb-2">Pro tip</h4>
            <p className="text-sm text-blue-800">
              Mix text and speech responses to get richer pronunciation feedback from your AI tutor. When you complete a session, we&apos;ll rate how ready you are for a similar real-world interaction.
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (selectedScenario) {
    return renderSessionView();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-200 to-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-200 to-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000" />

      <DashboardHeader userName={userName} activeTab="practice" />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 space-y-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-orange-500 font-semibold mb-2">AI conversation lab</p>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              Scenario-based <span className="text-gradient-brand">practice</span>
            </h1>
            <p className="text-lg text-gray-600">
              Real-time {getLanguageLabel(selectedLanguage)} conversations guided entirely by our live AI tutors—no more mock replies.
            </p>
          </div>
          <LanguageSelector id="language-selector-hero" className="self-start" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6">
            <span className="badge bg-orange-100 text-orange-600 mb-3">01</span>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Pick a scenario</h3>
            <p className="text-sm text-gray-600">Choose a real-world challenge crafted for your current skill level.</p>
          </div>
          <div className="card p-6">
            <span className="badge bg-pink-100 text-pink-600 mb-3">02</span>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Chat with AI tutor</h3>
            <p className="text-sm text-gray-600">Type or speak replies. The AI keeps the dialogue flowing naturally.</p>
          </div>
          <div className="card p-6">
            <span className="badge bg-purple-100 text-purple-600 mb-3">03</span>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Get smart feedback</h3>
            <p className="text-sm text-gray-600">Instant corrections, suggestions, and a session summary when you finish.</p>
          </div>
        </div>

        {renderScenarioCards()}
      </main>

      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-12">
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Power tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
            <div>
              <p className="font-semibold text-gray-900 mb-1">Warm up first</p>
              <p>Skim the scenario summary and plan an opening line so you can jump into the chat with confidence.</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-1">Complete sessions</p>
              <p>Mark a session complete to save transcripts and unlock follow-up drills tailored to your weak spots.</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-1">Reset anytime</p>
              <p>Need a fresh run? Exit and jump back in. We&apos;ll spin up a brand-new conversation instantly.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
