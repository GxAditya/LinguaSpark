import { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import DashboardHeader from '../components/DashboardHeader';
import { BookOpen, Volume2, CheckCircle, Clock, Zap, ChevronRight, PlayCircle, ChevronLeft, Loader2, AlertCircle, Pause, ChevronDown } from 'lucide-react';
import { useAuth } from '../context';
import { lessonService, ttsService, LessonSummary, LessonDetail, LessonProgress } from '../services';

const LANGUAGE_OPTIONS = [
  { value: 'spanish', label: 'Spanish' },
  { value: 'french', label: 'French' },
  { value: 'hindi', label: 'Hindi' },
  { value: 'mandarin', label: 'Mandarin Chinese' },
  { value: 'arabic', label: 'Arabic' },
  { value: 'bengali', label: 'Bengali' },
  { value: 'portuguese', label: 'Portuguese' },
  { value: 'russian', label: 'Russian' },
  { value: 'japanese', label: 'Japanese' },
];

export default function Lessons() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [lessons, setLessons] = useState<LessonSummary[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(user?.currentLanguage || 'spanish');
  const [isLanguageManuallySelected, setIsLanguageManuallySelected] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<LessonDetail | null>(null);
  const [lessonProgress, setLessonProgress] = useState<LessonProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeContentIndex, setActiveContentIndex] = useState(0);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [showExercises, setShowExercises] = useState(false);
  const [exerciseAnswer, setExerciseAnswer] = useState('');
  const [exerciseResult, setExerciseResult] = useState<{
    isCorrect: boolean;
    correctAnswer: string;
    explanation?: string;
  } | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch lessons on mount
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await lessonService.getLessons(selectedLanguage);
        setLessons(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load lessons');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchLessons();
    }
  }, [isAuthenticated, selectedLanguage]);

  useEffect(() => {
    if (user?.currentLanguage && !isLanguageManuallySelected) {
      setSelectedLanguage(user.currentLanguage);
    }
  }, [user?.currentLanguage, isLanguageManuallySelected]);

  // Auth loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-surface-base flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-content-primary animate-spin" />
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/signin" replace />;
  }

  const handleLessonClick = async (lesson: LessonSummary) => {
    try {
      setIsLoading(true);
      setError(null);
      const { lesson: lessonDetail, progress } = await lessonService.getLesson(lesson.slug);
      setSelectedLesson(lessonDetail);
      setLessonProgress(progress);
      setActiveContentIndex(0);
      setActiveExerciseIndex(0);
      setShowExercises(false);

      // Start the lesson if not started
      if (progress.status === 'not-started') {
        await lessonService.startLesson(lesson.slug);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load lesson');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayAudio = async (text: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    try {
      setIsPlayingAudio(true);
      const result = await ttsService.generateAudio(text, 'nova');

      if (result.audioBase64) {
        audioRef.current = new Audio(result.audioBase64);
      } else if (result.audioUrl) {
        audioRef.current = new Audio(result.audioUrl);
      } else {
        throw new Error('No audio data received');
      }

      audioRef.current.onplay = () => setIsPlayingAudio(true);
      audioRef.current.onended = () => setIsPlayingAudio(false);
      audioRef.current.onerror = () => setIsPlayingAudio(false);

      await audioRef.current.play();
    } catch (error) {
      console.error('Audio playback failed:', error);
      setIsPlayingAudio(false);
    }
  };

  const handlePauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    }
  };

  const resetLessonState = () => {
    setSelectedLesson(null);
    setLessonProgress(null);
    setActiveContentIndex(0);
    setActiveExerciseIndex(0);
    setShowExercises(false);
    setExerciseAnswer('');
    setExerciseResult(null);
    handlePauseAudio();
  };

  const handleLanguageChange = (value: string) => {
    if (value === selectedLanguage) {
      return;
    }
    setIsLanguageManuallySelected(true);
    resetLessonState();
    setSelectedLanguage(value);
  };

  const handleContentComplete = async (contentIndex: number) => {
    if (!selectedLesson || !lessonProgress) return;

    try {
      const result = await lessonService.updateContentProgress(
        selectedLesson.slug,
        contentIndex,
        { completed: true }
      );

      setLessonProgress(prev => prev ? {
        ...prev,
        progress: result.progress,
        contentProgress: result.contentProgress,
      } : null);

      // Move to next content or exercises
      if (contentIndex < selectedLesson.contents.length - 1) {
        setActiveContentIndex(contentIndex + 1);
      } else {
        setShowExercises(true);
      }
    } catch (err: unknown) {
      console.error('Failed to update progress:', err);
    }
  };

  const handleSubmitExercise = async () => {
    if (!selectedLesson || !lessonProgress || !exerciseAnswer.trim()) return;

    try {
      const result = await lessonService.submitExercise(
        selectedLesson.slug,
        activeExerciseIndex,
        exerciseAnswer
      );

      setExerciseResult({
        isCorrect: result.isCorrect,
        correctAnswer: result.correctAnswer,
        explanation: result.explanation,
      });

      setLessonProgress(prev => prev ? {
        ...prev,
        progress: result.progress,
        score: result.score,
        exerciseProgress: result.exerciseProgress,
      } : null);
    } catch (err: unknown) {
      console.error('Failed to submit exercise:', err);
    }
  };

  const handleNextExercise = () => {
    if (!selectedLesson) return;

    setExerciseResult(null);
    setExerciseAnswer('');

    if (activeExerciseIndex < selectedLesson.exercises.length - 1) {
      setActiveExerciseIndex(activeExerciseIndex + 1);
    }
  };

  const handleCompleteLesson = async () => {
    if (!selectedLesson) return;

    try {
      await lessonService.completeLesson(selectedLesson.slug);
      // Refresh lessons list
      const data = await lessonService.getLessons(selectedLanguage);
      setLessons(data);
      resetLessonState();
    } catch (err: unknown) {
      console.error('Failed to complete lesson:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 text-green-700 border border-green-100';
      case 'in-progress':
        return 'bg-blue-50 text-blue-700 border border-blue-100';
      default:
        return 'bg-surface-subtle text-content-secondary border border-border-subtle';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'in-progress':
        return <Zap className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getLanguageLabel = (code: string) => {
    const option = LANGUAGE_OPTIONS.find((lang) => lang.value === code);
    if (option) return option.label;
    return code ? code.charAt(0).toUpperCase() + code.slice(1) : 'Spanish';
  };

  const LanguageSelector = ({ id, className = '' }: { id: string; className?: string }) => (
    <div className={`flex flex-col text-sm ${className}`}>
      <label htmlFor={id} className="font-semibold text-content-primary mb-2">
        Learning language
      </label>
      <div className="relative group">
        <select
          id={id}
          value={selectedLanguage}
          onChange={(event) => handleLanguageChange(event.target.value)}
          className="appearance-none w-52 rounded-xl border-2 border-orange-100 bg-white py-3 pl-4 pr-10 text-sm font-semibold text-content-primary shadow-sm cursor-pointer transition-all duration-200 hover:border-orange-300 hover:shadow-md focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
        >
          {LANGUAGE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value} className="py-2">
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md bg-orange-50 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
          <ChevronDown className="h-4 w-4 text-orange-600" />
        </div>
      </div>
    </div>
  );

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-50 text-green-700 border border-green-100';
      case 'intermediate':
        return 'bg-blue-50 text-blue-700 border border-blue-100';
      case 'advanced':
        return 'bg-purple-50 text-purple-700 border border-purple-100';
      default:
        return 'bg-surface-subtle text-content-secondary border border-border-subtle';
    }
  };

  // Error state
  if (error && !selectedLesson) {
    return (
      <div className="min-h-screen bg-surface-base">
        <DashboardHeader userName={user.name} userAvatar={user.avatar} />
        <main className="max-w-7xl mx-auto px-6 py-12">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <div>
              <h3 className="font-semibold text-red-800">Error loading lessons</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Lesson detail view
  if (selectedLesson && lessonProgress) {
    const currentContent = selectedLesson.contents[activeContentIndex];
    const currentExercise = selectedLesson.exercises[activeExerciseIndex];

    return (
      <div className="min-h-screen bg-surface-base relative overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f4f4f5_1px,transparent_1px),linear-gradient(to_bottom,#f4f4f5_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

        <DashboardHeader userName={user.name} userAvatar={user.avatar} />

        <main className="relative z-10 max-w-4xl mx-auto px-6 py-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
            <button
              onClick={resetLessonState}
              className="flex items-center gap-2 text-content-secondary font-semibold hover:gap-3 hover:text-content-primary transition-all group"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Lessons
            </button>
            <div className="sm:ml-auto">
              <LanguageSelector id="lesson-language-selector-active" />
            </div>
          </div>

          {/* Lesson Header */}
          <div className="bg-surface-base p-8 rounded-xl border border-border-base shadow-sm mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-content-primary mb-3">{selectedLesson.title}</h1>
                <div className="flex items-center gap-4 flex-wrap">
                  <span className={`px-3 py-1 rounded-md text-xs font-medium ${getLevelColor(selectedLesson.level)}`}>
                    {selectedLesson.level.charAt(0).toUpperCase() + selectedLesson.level.slice(1)}
                  </span>
                  <span className="text-content-secondary flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4" /> {selectedLesson.duration} minutes
                  </span>
                  <span className="text-content-primary flex items-center gap-2 text-sm bg-surface-subtle rounded-full px-3 py-1 font-medium">
                    {getLanguageLabel(selectedLesson.language)}
                  </span>
                </div>
              </div>
              <div className="w-16 h-16 bg-brand-primary-light border border-brand-primary-border rounded-lg flex items-center justify-center">
                <PlayCircle className="w-8 h-8 text-brand-primary" />
              </div>
            </div>

            <p className="text-content-secondary text-lg mb-6">{selectedLesson.description}</p>

            {/* Objectives */}
            <div className="bg-surface-subtle border border-border-subtle rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-content-primary mb-3">Learning Objectives</h3>
              <ul className="space-y-2">
                {selectedLesson.objectives.map((obj, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-content-secondary">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    {obj}
                  </li>
                ))}
              </ul>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-content-secondary font-medium">Progress:</span>
                <span className="text-2xl font-bold text-content-primary">{lessonProgress.progress}%</span>
              </div>
              <div className="progress-bar h-4">
                <div
                  className="bg-orange-500 h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${lessonProgress.progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Content or Exercises */}
          {!showExercises ? (
            <div className="bg-surface-base p-8 rounded-xl border border-border-base shadow-sm">
              {/* Content Navigation */}
              <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                {selectedLesson.contents.map((content, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveContentIndex(idx)}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all border ${idx === activeContentIndex
                      ? 'bg-action-primary text-action-primary-fg border-action-primary'
                      : lessonProgress.contentProgress[idx]?.completed
                        ? 'bg-green-50 text-green-700 border-green-100'
                        : 'bg-surface-base text-content-secondary border-border-base hover:bg-surface-subtle'
                      }`}
                  >
                    {idx + 1}. {content.title.substring(0, 20)}...
                  </button>
                ))}
              </div>

              {/* Current Content */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-content-primary">{currentContent.title}</h2>
                  {currentContent.audioText && (
                    <button
                      onClick={() => isPlayingAudio ? handlePauseAudio() : handlePlayAudio(currentContent.audioText!)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg font-medium hover:bg-blue-100 transition-colors"
                    >
                      {isPlayingAudio ? <Pause className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      {isPlayingAudio ? 'Pause' : 'Listen'}
                    </button>
                  )}
                </div>

                {/* Content based on type */}
                <div className="prose max-w-none">
                  {currentContent.type === 'dialogue' ? (
                    <div className="bg-purple-50 border border-purple-100 rounded-lg p-6 space-y-3">
                      {currentContent.content.split('\n').map((line, idx) => {
                        const [speaker, ...text] = line.split(':');
                        return (
                          <div key={idx} className="flex gap-3">
                            <span className="font-semibold text-purple-700 min-w-[80px]">{speaker}:</span>
                            <span className="text-content-primary">{text.join(':')}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : currentContent.type === 'grammar' ? (
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
                      <pre className="whitespace-pre-wrap text-content-primary font-mono text-sm">{currentContent.content}</pre>
                      {currentContent.grammarPoints && (
                        <div className="mt-4 pt-4 border-t border-blue-200">
                          <h4 className="font-semibold text-blue-800 mb-2">Key Points:</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {currentContent.grammarPoints.map((point, idx) => (
                              <li key={idx} className="text-blue-700">{point}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : currentContent.type === 'vocabulary' ? (
                    <div className="space-y-4">
                      <p className="text-content-primary">{currentContent.content}</p>
                      <div className="grid gap-4">
                        {currentContent.vocabulary?.map((vocab, idx) => (
                          <div key={idx} className="bg-green-50 border border-green-100 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <span className="text-xl font-bold text-content-primary">{vocab.word}</span>
                                <span className="text-content-tertiary">→</span>
                                <span className="text-lg text-green-700">{vocab.translation}</span>
                              </div>
                              <button
                                onClick={() => handlePlayAudio(vocab.word)}
                                className="p-2 bg-white border border-green-200 rounded-md hover:bg-green-100 transition-colors"
                              >
                                <Volume2 className="w-4 h-4 text-green-700" />
                              </button>
                            </div>
                            {vocab.pronunciation && (
                              <p className="text-sm text-content-secondary mb-2">/{vocab.pronunciation}/</p>
                            )}
                            <div className="bg-surface-base border border-green-200 rounded-md p-3">
                              <p className="text-content-primary italic">"{vocab.example}"</p>
                              <p className="text-content-secondary text-sm mt-1">{vocab.exampleTranslation}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-content-primary text-lg leading-relaxed">{currentContent.content}</p>
                  )}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-border-base">
                <button
                  onClick={() => setActiveContentIndex(Math.max(0, activeContentIndex - 1))}
                  disabled={activeContentIndex === 0}
                  className="flex items-center gap-2 px-6 py-3 border border-border-base rounded-lg font-medium text-content-secondary hover:bg-surface-subtle disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" /> Previous
                </button>

                {activeContentIndex === selectedLesson.contents.length - 1 ? (
                  <button
                    onClick={() => {
                      handleContentComplete(activeContentIndex);
                      setShowExercises(true);
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-action-primary text-action-primary-fg rounded-lg font-medium hover:bg-action-primary-hover transition-colors"
                  >
                    Start Exercises <Zap className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleContentComplete(activeContentIndex)}
                    className="flex items-center gap-2 px-6 py-3 bg-action-primary text-action-primary-fg rounded-lg font-medium hover:bg-action-primary-hover transition-colors"
                  >
                    Next <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Exercises Section */
            <div className="bg-surface-base p-8 rounded-xl border border-border-base shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-content-primary">Practice Exercises</h2>
                <span className="text-content-secondary">
                  {activeExerciseIndex + 1} of {selectedLesson.exercises.length}
                </span>
              </div>

              {/* Exercise */}
              <div className="mb-8">
                <div className="bg-purple-50 border border-purple-100 rounded-lg p-6 mb-6">
                  <p className="text-lg font-medium text-content-primary mb-4">{currentExercise.question}</p>

                  {currentExercise.audioText && (
                    <button
                      onClick={() => handlePlayAudio(currentExercise.audioText!)}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition-colors mb-4"
                    >
                      <Volume2 className="w-5 h-5" /> Listen to Audio
                    </button>
                  )}

                  {currentExercise.type === 'multiple-choice' && currentExercise.options ? (
                    <div className="space-y-3">
                      {currentExercise.options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => setExerciseAnswer(option)}
                          disabled={!!exerciseResult}
                          className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${exerciseAnswer === option
                            ? exerciseResult
                              ? exerciseResult.isCorrect
                                ? 'border-green-500 bg-green-50'
                                : 'border-red-500 bg-red-50'
                              : 'border-action-primary bg-surface-subtle'
                            : exerciseResult && option === exerciseResult.correctAnswer
                              ? 'border-green-500 bg-green-50'
                              : 'border-border-base hover:border-border-strong'
                            } ${exerciseResult ? 'cursor-default' : 'cursor-pointer'}`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={exerciseAnswer}
                      onChange={(e) => setExerciseAnswer(e.target.value)}
                      disabled={!!exerciseResult}
                      placeholder="Type your answer..."
                      className="w-full px-4 py-3 border border-border-base rounded-lg focus:border-content-primary focus:ring-1 focus:ring-content-primary outline-none transition-colors"
                    />
                  )}
                </div>

                {/* Result */}
                {exerciseResult && (
                  <div className={`rounded-lg p-6 mb-6 ${exerciseResult.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <div className="flex items-center gap-3 mb-2">
                      {exerciseResult.isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <AlertCircle className="w-6 h-6 text-red-600" />
                      )}
                      <span className={`font-semibold ${exerciseResult.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                        {exerciseResult.isCorrect ? 'Correct!' : 'Incorrect'}
                      </span>
                    </div>
                    {!exerciseResult.isCorrect && (
                      <p className="text-content-primary mb-2">
                        Correct answer: <strong>{exerciseResult.correctAnswer}</strong>
                      </p>
                    )}
                    {exerciseResult.explanation && (
                      <p className="text-content-secondary text-sm">{exerciseResult.explanation}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Exercise Navigation */}
              <div className="flex items-center justify-between pt-6 border-t border-border-base">
                <button
                  onClick={() => setShowExercises(false)}
                  className="flex items-center gap-2 px-6 py-3 border border-border-base rounded-lg font-medium text-content-secondary hover:bg-surface-subtle transition-colors"
                >
                  <BookOpen className="w-5 h-5" /> Back to Content
                </button>

                {!exerciseResult ? (
                  <button
                    onClick={handleSubmitExercise}
                    disabled={!exerciseAnswer.trim()}
                    className="flex items-center gap-2 px-6 py-3 bg-action-primary text-action-primary-fg rounded-lg font-medium hover:bg-action-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Submit Answer <ChevronRight className="w-5 h-5" />
                  </button>
                ) : activeExerciseIndex === selectedLesson.exercises.length - 1 ? (
                  <button
                    onClick={handleCompleteLesson}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Complete Lesson <CheckCircle className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={handleNextExercise}
                    className="flex items-center gap-2 px-6 py-3 bg-action-primary text-action-primary-fg rounded-lg font-medium hover:bg-action-primary-hover transition-colors"
                  >
                    Next Exercise <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  // Lessons list view
  return (
    <div className="min-h-screen bg-surface-base relative overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f4f4f5_1px,transparent_1px),linear-gradient(to_bottom,#f4f4f5_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

      <DashboardHeader userName={user.name} userAvatar={user.avatar} />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-content-primary mb-3">
              AI-Generated <span className="text-content-primary">Lessons</span>
            </h1>
            <p className="text-lg text-content-secondary">Personalized lessons created by our AI to match your learning pace</p>
            <p className="text-sm text-content-tertiary mt-2">Showing content for {getLanguageLabel(selectedLanguage)}</p>
          </div>
          <LanguageSelector id="lesson-language-selector" />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-content-primary animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => handleLessonClick(lesson)}
                className="bg-surface-base p-6 rounded-xl border border-border-base shadow-sm hover:shadow-md hover:border-border-strong transition-all duration-200 text-left group"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className={`badge flex items-center gap-2 ${getStatusColor(lesson.status)}`}>
                    {getStatusIcon(lesson.status)} {lesson.status === 'not-started' ? 'Start Now' : lesson.status === 'in-progress' ? 'Continue' : 'Completed'}
                  </span>
                </div>

                <p className="text-xs font-semibold uppercase tracking-wide text-content-tertiary mb-2">
                  {getLanguageLabel(lesson.language)}
                </p>

                <h3 className="text-lg font-bold text-content-primary mb-2">{lesson.title}</h3>
                <p className="text-sm text-content-secondary mb-4">{lesson.topic}</p>

                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${getLevelColor(lesson.level)}`}>
                    {lesson.level.charAt(0).toUpperCase() + lesson.level.slice(1)}
                  </span>
                  <span className="text-xs text-content-secondary flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {lesson.duration} min
                  </span>
                </div>

                <div className="mb-4">
                  <div className="progress-bar h-2 bg-surface-muted rounded-full overflow-hidden">
                    <div
                      className="bg-orange-500 h-full rounded-full"
                      style={{ width: `${lesson.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-content-primary font-semibold text-sm group-hover:gap-3 transition-all">
                  Learn More <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
