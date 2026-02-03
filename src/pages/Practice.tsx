import React, { useEffect, useMemo, useState } from 'react';
import DashboardHeader from '../components/DashboardHeader';
import {
  MessageCircle,
  Mic,
  Send,
  ChevronRight,
  ChevronLeft,
  Users,
  Target,
  Brain,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../context';
import { practiceService, PracticeScenarioSummary, PracticeSession } from '../services';
import { getLearningLanguageLabel, resolveLearningLanguage } from '../utils/languages';

const ICON_MAP: Record<'users' | 'target' | 'message' | 'brain', React.ReactNode> = {
  users: <Users className="w-6 h-6" />,
  target: <Target className="w-6 h-6" />,
  message: <MessageCircle className="w-6 h-6" />,
  brain: <Brain className="w-6 h-6" />,
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
      return 'bg-success-soft text-success border border-success';
    case 'medium':
      return 'tone-brand border border-accent';
    case 'hard':
      return 'tone-iris border border-accent';
    default:
      return 'bg-surface-subtle text-content-secondary border border-border-subtle';
  }
};

const formatDifficultyLabel = (difficulty: string) => difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

export default function Practice() {
  const { user } = useAuth();
  const selectedLanguage = resolveLearningLanguage(user?.currentLanguage);
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
      } catch (error: unknown) {
        if (!ignore) {
          setScenarioError(error instanceof Error ? error.message : 'Failed to load practice scenarios');
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
    setSelectedScenario(null);
    setActiveSession(null);
    setSessionError(null);
    setInputValue('');
    setIsRecording(false);
  }, [selectedLanguage]);

  const filteredScenarios = useMemo(
    () => scenarios.filter((scenario) => scenario.language === selectedLanguage),
    [scenarios, selectedLanguage]
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
    } catch (error: unknown) {
      setSessionError(error instanceof Error ? error.message : 'Unable to start practice session');
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
    } catch (error: unknown) {
      setSessionError(error instanceof Error ? error.message : 'Unable to send message');
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
    } catch (error: unknown) {
      setSessionError(error instanceof Error ? error.message : 'Unable to complete session');
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
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
        </div>
      );
    }

    if (scenarioError) {
      return (
        <div className="bg-warning-soft border border-warning rounded-xl p-6 text-warning">
          <p>{scenarioError}</p>
        </div>
      );
    }

    if (filteredScenarios.length === 0) {
      return (
        <div className="bg-surface-base p-8 rounded-xl border border-border-base shadow-sm text-center text-content-secondary">
          <p>
            We&apos;re still preparing {getLearningLanguageLabel(selectedLanguage)} practice scenarios. Try another language for now!
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
            className="bg-surface-base p-6 rounded-xl border border-border-base shadow-sm hover:shadow-md hover:border-border-strong transition-all duration-200 text-left group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 tone-brand border rounded-lg flex items-center justify-center text-accent group-hover:scale-105 transition-transform">
                {getIconForTopic(scenario.topic)}
              </div>
              <span className={`px-2 py-1 rounded-md text-xs font-medium ${getDifficultyColor(scenario.difficulty)}`}>
                {formatDifficultyLabel(scenario.difficulty)}
              </span>
            </div>

            <h3 className="text-lg font-bold text-content-primary mb-2">{scenario.title}</h3>
            <p className="text-sm text-content-secondary mb-4 line-clamp-2">{scenario.description}</p>

            <div className="flex items-center justify-between text-xs text-content-secondary">
              <span>~{scenario.durationMinutes} minutes</span>
              <span className="bg-surface-subtle border border-border-subtle px-2 py-1 rounded-md text-content-secondary">{scenario.topic}</span>
            </div>
            <div className="text-xs text-content-secondary mt-2">{getLearningLanguageLabel(scenario.language)}</div>

            <div className="flex items-center gap-2 text-content-primary font-semibold text-sm group-hover:gap-3 transition-all mt-4">
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
    const placeholder = `Type your response in ${getLearningLanguageLabel(selectedScenario.language)}...`;

    return (
      <div className="min-h-screen bg-surface-base flex flex-col relative overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0 hero-grid"></div>

        <DashboardHeader userName={userName} activeTab="practice" />

        <main className="relative z-10 flex-1 max-w-5xl mx-auto w-full px-6 pt-24 pb-10 flex flex-col gap-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={handleExitScenario}
              className="flex items-center gap-2 text-content-secondary font-semibold hover:gap-3 hover:text-content-primary transition-all group"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to scenarios
            </button>
          </div>

          <div className="bg-surface-base p-6 rounded-xl border border-border-base shadow-sm space-y-4">
            <div>
              <p className="text-sm uppercase tracking-wide text-content-tertiary font-semibold">Scenario</p>
              <h1 className="text-2xl md:text-3xl font-bold text-content-primary mt-1">{selectedScenario.title}</h1>
              <p className="text-content-secondary mt-2">{selectedScenario.description}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-content-secondary">
              <div>
                <p className="font-semibold text-content-primary">Difficulty</p>
                <p>{formatDifficultyLabel(selectedScenario.difficulty)}</p>
              </div>
              <div>
                <p className="font-semibold text-content-primary">Duration</p>
                <p>~{selectedScenario.durationMinutes} minutes</p>
              </div>
              <div>
                <p className="font-semibold text-content-primary">Topic</p>
                <p>{selectedScenario.topic}</p>
              </div>
              <div>
                <p className="font-semibold text-content-primary">Language</p>
                <p>{getLearningLanguageLabel(selectedScenario.language)}</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-content-secondary pt-2 border-t border-border-subtle">
              <span>
                Session status:{' '}
                <span className="font-semibold text-content-primary capitalize">{activeSession?.status || 'connecting'}</span>
              </span>
              <span className="text-content-tertiary font-semibold">AI tutor ready</span>
            </div>
          </div>

          <div className="bg-surface-base rounded-xl border border-border-base shadow-sm flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto mb-4 space-y-4 bg-surface-subtle p-6">
              {isSessionLoading && (
                <div className="flex flex-col items-center justify-center text-center text-content-secondary gap-3 py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-content-primary" />
                  <p>Warming up your AI partner...</p>
                </div>
              )}

              {!isSessionLoading && !activeSession && (
                <div className="flex flex-col items-center justify-center text-center text-content-secondary gap-4 py-12">
                  <MessageCircle className="w-10 h-10 text-content-tertiary" />
                  <div>
                    <p className="font-semibold text-content-primary">We couldn&apos;t start this chat</p>
                    <p>Tap below to try again.</p>
                  </div>
                  <button
                    onClick={() => handleStartScenario(selectedScenario)}
                    className="bg-action-primary text-action-primary-fg font-medium py-2 px-6 rounded-lg hover:bg-action-primary-hover transition-all"
                  >
                    Retry session
                  </button>
                </div>
              )}

              {conversationReady && (
                <div className="space-y-4">
                  {chatMessages.length === 0 && (
                    <div className="text-center text-muted">
                      <p>Say hola to kick off the conversation.</p>
                    </div>
                  )}
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs md:max-w-md px-4 py-3 rounded-xl shadow-sm whitespace-pre-wrap text-sm border ${message.role === 'user' ? 'bg-action-primary text-action-primary-fg border-action-primary' : 'bg-surface-base text-content-primary border-border-base'
                          }`}
                      >
                        <p>{message.content}</p>
                        {message.feedback && (
                          <p className="text-xs text-accent-3 mt-2 border-t border-white/20 pt-2">Feedback: {message.feedback}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {sessionError && (
              <div className="mx-4 mb-4 px-4 py-3 rounded-xl bg-warning-soft border border-warning text-sm text-warning">
                {sessionError}
              </div>
            )}

            <div className="flex items-center gap-3 px-4">
              <button
                onClick={() => setIsRecording((prev) => !prev)}
                disabled={!sessionActive}
                className={`p-3 rounded-full transition-all border ${isRecording ? 'bg-warning text-white border-warning animate-pulse' : 'bg-surface-base text-content-secondary border-border-base hover:bg-surface-subtle'
                  } ${sessionActive ? '' : 'opacity-50 cursor-not-allowed'}`}
              >
                <Mic className="w-5 h-5" />
              </button>
              {isRecording && sessionActive && <span className="text-sm text-warning font-semibold">Recording...</span>}
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
                className="flex-1 px-4 py-3 border border-border-base rounded-lg bg-surface-subtle focus:bg-surface-base focus:ring-2 focus:ring-content-primary/10 focus:border-content-primary transition-all outline-none disabled:bg-surface-subtle disabled:text-content-tertiary"
              />
              <button
                type="submit"
                disabled={!sessionActive || isSendingMessage}
                className="bg-action-primary text-action-primary-fg font-medium py-3 px-6 rounded-lg hover:bg-action-primary-hover active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Send className="w-5 h-5" /> {isSendingMessage ? 'Sending...' : 'Send'}
              </button>
            </form>

            <div className="flex flex-wrap gap-3 px-4 pb-4">
              {activeSession?.status === 'active' && (
                <button
                  onClick={handleCompleteSession}
                  disabled={isCompletingSession}
                  className="px-4 py-2 rounded-lg border border-border-base text-content-secondary font-semibold hover:bg-surface-subtle transition disabled:opacity-60"
                >
                  {isCompletingSession ? 'Saving...' : 'Mark session complete'}
                </button>
              )}
              {activeSession?.status === 'completed' && (
                <button
                  onClick={() => handleStartScenario(selectedScenario)}
                  className="px-4 py-2 rounded-lg border border-success text-success font-semibold hover:bg-success-soft transition"
                >
                  Start new session
                </button>
              )}
              <button
                onClick={handleExitScenario}
                className="px-4 py-2 rounded-lg text-content-secondary hover:text-content-primary hover:bg-surface-subtle transition"
              >
                Choose another scenario
              </button>
            </div>
          </div>

        </main>
        <div className="relative z-10 max-w-5xl mx-auto w-full px-6 pb-10">
          <div className="tone-brand border border-accent rounded-lg p-4">
            <h4 className="font-semibold text-accent mb-2">Pro tip</h4>
            <p className="text-sm text-accent">
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
    <div className="min-h-screen bg-surface-base relative overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 hero-grid"></div>

      <DashboardHeader userName={userName} activeTab="practice" />

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-12 space-y-10">
        <div>
          <div>
            <p className="text-sm uppercase tracking-wide text-content-tertiary font-semibold mb-2">AI conversation lab</p>
            <h1 className="text-4xl md:text-5xl font-bold text-content-primary mb-3">
              Scenario-based <span className="text-content-primary">practice</span>
            </h1>
            <p className="text-lg text-content-secondary">
              Real-time {getLearningLanguageLabel(selectedLanguage)} conversations guided entirely by our live AI tutors.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-base p-6 rounded-xl border border-border-base shadow-sm">
            <span className="inline-block tone-brand border px-2 py-1 rounded-md text-xs font-bold mb-3">01</span>
            <h3 className="text-lg font-semibold text-content-primary mb-2">Pick a scenario</h3>
            <p className="text-sm text-content-secondary">Choose a real-world challenge crafted for your current skill level.</p>
          </div>
          <div className="bg-surface-base p-6 rounded-xl border border-border-base shadow-sm">
            <span className="inline-block tone-iris border px-2 py-1 rounded-md text-xs font-bold mb-3">02</span>
            <h3 className="text-lg font-semibold text-content-primary mb-2">Chat with AI tutor</h3>
            <p className="text-sm text-content-secondary">Type or speak replies. The AI keeps the dialogue flowing naturally.</p>
          </div>
          <div className="bg-surface-base p-6 rounded-xl border border-border-base shadow-sm">
            <span className="inline-block tone-ember border px-2 py-1 rounded-md text-xs font-bold mb-3">03</span>
            <h3 className="text-lg font-semibold text-content-primary mb-2">Get smart feedback</h3>
            <p className="text-sm text-content-secondary">Instant corrections, suggestions, and a session summary when you finish.</p>
          </div>
        </div>

        {renderScenarioCards()}
      </main>

      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-12">
        <div className="bg-surface-base p-8 rounded-xl border border-border-base shadow-sm">
          <h2 className="text-2xl font-bold text-content-primary mb-6">Power tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-content-secondary">
            <div>
              <p className="font-semibold text-content-primary mb-1">Warm up first</p>
              <p>Skim the scenario summary and plan an opening line so you can jump into the chat with confidence.</p>
            </div>
            <div>
              <p className="font-semibold text-content-primary mb-1">Complete sessions</p>
              <p>Mark a session complete to save transcripts and unlock follow-up drills tailored to your weak spots.</p>
            </div>
            <div>
              <p className="font-semibold text-content-primary mb-1">Reset anytime</p>
              <p>Need a fresh run? Exit and jump back in. We&apos;ll spin up a brand-new conversation instantly.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
