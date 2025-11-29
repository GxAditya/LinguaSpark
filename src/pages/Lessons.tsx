import React, { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import DashboardHeader from '../components/DashboardHeader';
import { BookOpen, Volume2, CheckCircle, Clock, Zap, ChevronRight, PlayCircle, ChevronLeft, Loader2, AlertCircle, Pause } from 'lucide-react';
import { useAuth } from '../context';
import { lessonService, ttsService, LessonSummary, LessonDetail, LessonProgress } from '../services';

export default function Lessons() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [lessons, setLessons] = useState<LessonSummary[]>([]);
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
        const data = await lessonService.getLessons(user?.currentLanguage || 'spanish');
        setLessons(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load lessons');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchLessons();
    }
  }, [isAuthenticated, user?.currentLanguage]);

  // Auth loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
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
    } catch (err: any) {
      setError(err.message || 'Failed to load lesson');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayAudio = (text: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    const audioUrl = ttsService.getDirectTTSUrl(text, 'nova');
    audioRef.current = new Audio(audioUrl);
    
    audioRef.current.onplay = () => setIsPlayingAudio(true);
    audioRef.current.onended = () => setIsPlayingAudio(false);
    audioRef.current.onerror = () => setIsPlayingAudio(false);
    
    audioRef.current.play().catch(console.error);
  };

  const handlePauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    }
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
    } catch (err: any) {
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
    } catch (err: any) {
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
      const data = await lessonService.getLessons(user?.currentLanguage || 'spanish');
      setLessons(data);
      setSelectedLesson(null);
      setLessonProgress(null);
    } catch (err: any) {
      console.error('Failed to complete lesson:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
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

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'from-green-500 to-emerald-500';
      case 'intermediate':
        return 'from-blue-500 to-cyan-500';
      case 'advanced':
        return 'from-purple-500 to-pink-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  // Error state
  if (error && !selectedLesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-200 to-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-200 to-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        
        <DashboardHeader userName={user.name} userAvatar={user.avatar} />

        <main className="relative z-10 max-w-4xl mx-auto px-6 py-12">
          <button
            onClick={() => {
              setSelectedLesson(null);
              setLessonProgress(null);
              handlePauseAudio();
            }}
            className="flex items-center gap-2 text-orange-600 font-semibold mb-8 hover:gap-3 transition-all group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Lessons
          </button>

          {/* Lesson Header */}
          <div className="card p-8 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{selectedLesson.title}</h1>
                <div className="flex items-center gap-4 flex-wrap">
                  <span className={`badge text-white bg-gradient-to-r ${getLevelColor(selectedLesson.level)}`}>
                    {selectedLesson.level.charAt(0).toUpperCase() + selectedLesson.level.slice(1)}
                  </span>
                  <span className="text-gray-600 flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4" /> {selectedLesson.duration} minutes
                  </span>
                </div>
              </div>
              <div className="icon-container-orange w-16 h-16">
                <PlayCircle className="w-8 h-8 text-orange-600" />
              </div>
            </div>

            <p className="text-gray-600 text-lg mb-6">{selectedLesson.description}</p>

            {/* Objectives */}
            <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Learning Objectives</h3>
              <ul className="space-y-2">
                {selectedLesson.objectives.map((obj, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    {obj}
                  </li>
                ))}
              </ul>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700 font-medium">Progress:</span>
                <span className="text-2xl font-bold text-gradient-brand">{lessonProgress.progress}%</span>
              </div>
              <div className="progress-bar h-4">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${lessonProgress.progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Content or Exercises */}
          {!showExercises ? (
            <div className="card p-8">
              {/* Content Navigation */}
              <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                {selectedLesson.contents.map((content, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveContentIndex(idx)}
                    className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                      idx === activeContentIndex
                        ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                        : lessonProgress.contentProgress[idx]?.completed
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {idx + 1}. {content.title.substring(0, 20)}...
                  </button>
                ))}
              </div>

              {/* Current Content */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{currentContent.title}</h2>
                  {currentContent.audioText && (
                    <button
                      onClick={() => isPlayingAudio ? handlePauseAudio() : handlePlayAudio(currentContent.audioText!)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl font-medium hover:bg-blue-200 transition-colors"
                    >
                      {isPlayingAudio ? <Pause className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      {isPlayingAudio ? 'Pause' : 'Listen'}
                    </button>
                  )}
                </div>

                {/* Content based on type */}
                <div className="prose max-w-none">
                  {currentContent.type === 'dialogue' ? (
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 space-y-3">
                      {currentContent.content.split('\n').map((line, idx) => {
                        const [speaker, ...text] = line.split(':');
                        return (
                          <div key={idx} className="flex gap-3">
                            <span className="font-semibold text-purple-700 min-w-[80px]">{speaker}:</span>
                            <span className="text-gray-700">{text.join(':')}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : currentContent.type === 'grammar' ? (
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6">
                      <pre className="whitespace-pre-wrap text-gray-700 font-mono text-sm">{currentContent.content}</pre>
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
                      <p className="text-gray-700">{currentContent.content}</p>
                      <div className="grid gap-4">
                        {currentContent.vocabulary?.map((vocab, idx) => (
                          <div key={idx} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <span className="text-xl font-bold text-gray-900">{vocab.word}</span>
                                <span className="text-gray-500">→</span>
                                <span className="text-lg text-green-700">{vocab.translation}</span>
                              </div>
                              <button
                                onClick={() => handlePlayAudio(vocab.word)}
                                className="p-2 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"
                              >
                                <Volume2 className="w-4 h-4 text-green-700" />
                              </button>
                            </div>
                            {vocab.pronunciation && (
                              <p className="text-sm text-gray-500 mb-2">/{vocab.pronunciation}/</p>
                            )}
                            <div className="bg-white/50 rounded-lg p-3">
                              <p className="text-gray-700 italic">"{vocab.example}"</p>
                              <p className="text-gray-500 text-sm mt-1">{vocab.exampleTranslation}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-700 text-lg leading-relaxed">{currentContent.content}</p>
                  )}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <button
                  onClick={() => setActiveContentIndex(Math.max(0, activeContentIndex - 1))}
                  disabled={activeContentIndex === 0}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" /> Previous
                </button>
                
                {activeContentIndex === selectedLesson.contents.length - 1 ? (
                  <button
                    onClick={() => {
                      handleContentComplete(activeContentIndex);
                      setShowExercises(true);
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
                  >
                    Start Exercises <Zap className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleContentComplete(activeContentIndex)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
                  >
                    Next <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Exercises Section */
            <div className="card p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Practice Exercises</h2>
                <span className="text-gray-600">
                  {activeExerciseIndex + 1} of {selectedLesson.exercises.length}
                </span>
              </div>

              {/* Exercise */}
              <div className="mb-8">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-6">
                  <p className="text-lg font-medium text-gray-900 mb-4">{currentExercise.question}</p>
                  
                  {currentExercise.audioText && (
                    <button
                      onClick={() => handlePlayAudio(currentExercise.audioText!)}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-xl font-medium hover:bg-purple-200 transition-colors mb-4"
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
                          className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${
                            exerciseAnswer === option
                              ? exerciseResult
                                ? exerciseResult.isCorrect
                                  ? 'border-green-500 bg-green-50'
                                  : 'border-red-500 bg-red-50'
                                : 'border-orange-500 bg-orange-50'
                              : exerciseResult && option === exerciseResult.correctAnswer
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-gray-300'
                          } ${!!exerciseResult ? 'cursor-default' : 'cursor-pointer'}`}
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
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-0 outline-none transition-colors"
                    />
                  )}
                </div>

                {/* Result */}
                {exerciseResult && (
                  <div className={`rounded-xl p-6 mb-6 ${exerciseResult.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
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
                      <p className="text-gray-700 mb-2">
                        Correct answer: <strong>{exerciseResult.correctAnswer}</strong>
                      </p>
                    )}
                    {exerciseResult.explanation && (
                      <p className="text-gray-600 text-sm">{exerciseResult.explanation}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Exercise Navigation */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowExercises(false)}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <BookOpen className="w-5 h-5" /> Back to Content
                </button>
                
                {!exerciseResult ? (
                  <button
                    onClick={handleSubmitExercise}
                    disabled={!exerciseAnswer.trim()}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                  >
                    Submit Answer <ChevronRight className="w-5 h-5" />
                  </button>
                ) : activeExerciseIndex === selectedLesson.exercises.length - 1 ? (
                  <button
                    onClick={handleCompleteLesson}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
                  >
                    Complete Lesson <CheckCircle className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={handleNextExercise}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-200 to-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-200 to-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
      
      <DashboardHeader userName={user.name} userAvatar={user.avatar} />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            AI-Generated <span className="text-gradient-brand">Lessons</span>
          </h1>
          <p className="text-lg text-gray-600">Personalized lessons created by our AI to match your learning pace</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => handleLessonClick(lesson)}
                className="card-interactive p-6 text-left"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className={`badge flex items-center gap-2 ${getStatusColor(lesson.status)}`}>
                    {getStatusIcon(lesson.status)} {lesson.status === 'not-started' ? 'Start Now' : lesson.status === 'in-progress' ? 'Continue' : 'Completed'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">{lesson.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{lesson.topic}</p>

                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <span className={`badge text-white bg-gradient-to-r ${getLevelColor(lesson.level)}`}>
                    {lesson.level.charAt(0).toUpperCase() + lesson.level.slice(1)}
                  </span>
                  <span className="text-xs text-gray-600 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {lesson.duration} min
                  </span>
                </div>

                <div className="mb-4">
                  <div className="progress-bar h-2">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${lesson.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-orange-600 font-semibold text-sm group-hover:gap-3 transition-all">
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
