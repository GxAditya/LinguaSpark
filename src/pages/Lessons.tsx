import React, { useState } from 'react';
import DashboardHeader from '../components/DashboardHeader';
import { BookOpen, Volume2, CheckCircle, Clock, Zap, ChevronRight, PlayCircle, ChevronLeft } from 'lucide-react';

interface Lesson {
  id: number;
  title: string;
  topic: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number;
  status: 'completed' | 'in-progress' | 'not-started';
  progress: number;
  description: string;
}

export default function Lessons() {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const lessons: Lesson[] = [
    {
      id: 1,
      title: 'Basic Greetings & Introductions',
      topic: 'Speaking & Listening',
      level: 'Beginner',
      duration: 12,
      status: 'completed',
      progress: 100,
      description: 'Learn how to greet people in Spanish and introduce yourself. This lesson covers common phrases like "Hola", "Buenos días", and "Mucho gusto".'
    },
    {
      id: 2,
      title: 'Present Tense Verbs',
      topic: 'Grammar',
      level: 'Beginner',
      duration: 15,
      status: 'in-progress',
      progress: 65,
      description: 'Master the present tense in Spanish. Understand verb conjugations for regular and common irregular verbs.'
    },
    {
      id: 3,
      title: 'Ordering Food at a Restaurant',
      topic: 'Practical Scenarios',
      level: 'Intermediate',
      duration: 18,
      status: 'not-started',
      progress: 0,
      description: 'Learn vocabulary and phrases for ordering food. Practice reading menus and communicating dietary preferences.'
    },
    {
      id: 4,
      title: 'Past Tense Mastery',
      topic: 'Grammar',
      level: 'Intermediate',
      duration: 20,
      status: 'not-started',
      progress: 0,
      description: 'Explore the past tense in Spanish. Learn the difference between preterite and imperfect tenses with real-world examples.'
    },
    {
      id: 5,
      title: 'Advanced Conversation Skills',
      topic: 'Speaking & Listening',
      level: 'Advanced',
      duration: 25,
      status: 'not-started',
      progress: 0,
      description: 'Engage in natural, flowing conversations on complex topics. Improve fluency and confidence in spontaneous speech.'
    },
    {
      id: 6,
      title: 'Business Spanish Essentials',
      topic: 'Professional',
      level: 'Advanced',
      duration: 30,
      status: 'not-started',
      progress: 0,
      description: 'Learn professional vocabulary and etiquette for business meetings, emails, and negotiations in Spanish.'
    }
  ];

  const handleLessonClick = (lesson: Lesson) => {
    setSelectedLesson(lesson);
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
      case 'Beginner':
        return 'from-green-500 to-emerald-500';
      case 'Intermediate':
        return 'from-blue-500 to-cyan-500';
      case 'Advanced':
        return 'from-purple-500 to-pink-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  if (selectedLesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-200 to-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-200 to-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        
        <DashboardHeader userName="John Doe" />

        <main className="relative z-10 max-w-4xl mx-auto px-6 py-12">
          <button
            onClick={() => setSelectedLesson(null)}
            className="flex items-center gap-2 text-orange-600 font-semibold mb-8 hover:gap-3 transition-all group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Lessons
          </button>

          <div className="card p-8 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{selectedLesson.title}</h1>
                <div className="flex items-center gap-4 flex-wrap">
                  <span className={`badge text-white bg-gradient-to-r ${getLevelColor(selectedLesson.level)}`}>
                    {selectedLesson.level}
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

            <p className="text-gray-600 text-lg mb-8">{selectedLesson.description}</p>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Lesson Content</h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border-l-4 border-blue-500">
                  <div className="flex items-center gap-3 mb-2">
                    <Volume2 className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-gray-900">Audio Listening</h4>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">Listen to native speakers demonstrating proper pronunciation and natural conversation flow.</p>
                  <button className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                    <Volume2 className="w-4 h-4" /> Play Audio
                  </button>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-l-4 border-purple-500">
                  <div className="flex items-center gap-3 mb-2">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                    <h4 className="font-semibold text-gray-900">Reading Material</h4>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">Read through curated content with vocabulary highlights and explanations to reinforce learning.</p>
                  <button className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-purple-700 transition-colors">
                    <BookOpen className="w-4 h-4" /> Read Lesson
                  </button>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-l-4 border-green-500">
                  <div className="flex items-center gap-3 mb-2">
                    <Zap className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold text-gray-900">Practice Exercises</h4>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">Complete interactive exercises to practice what you've learned and test your understanding.</p>
                  <button className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-green-700 transition-colors">
                    <Zap className="w-4 h-4" /> Start Exercises
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h3>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700 font-medium">Completion:</span>
                  <span className="text-2xl font-bold text-gradient-brand">{selectedLesson.progress}%</span>
                </div>
                <div className="progress-bar h-4">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${selectedLesson.progress}%` }}
                  ></div>
                </div>
              </div>
              {selectedLesson.status === 'completed' && (
                <p className="text-green-700 font-semibold flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" /> Lesson Completed! Excellent work!
                </p>
              )}
              {selectedLesson.status === 'in-progress' && (
                <p className="text-blue-700 font-semibold flex items-center gap-2">
                  <Zap className="w-5 h-5" /> Continue where you left off to complete this lesson.
                </p>
              )}
            </div>

            <button className="w-full btn-primary-lg flex items-center justify-center gap-2">
              {selectedLesson.status === 'completed' ? 'Review Lesson' : 'Continue Lesson'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-200 to-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-200 to-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
      
      <DashboardHeader userName="John Doe" />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            AI-Generated <span className="text-gradient-brand">Lessons</span>
          </h1>
          <p className="text-lg text-gray-600">Personalized lessons created by our AI to match your learning pace</p>
        </div>

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
                  {lesson.level}
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
      </main>
    </div>
  );
}
