import { Link, Navigate } from 'react-router-dom';
import DashboardHeader from '../components/DashboardHeader';
import { Headphones, BookOpen, Grid3X3, Shuffle, Award, Zap, RotateCcw, FileText, BarChart3, Clock, ChevronRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context';

const games = [
  {
    id: 'transcription-station',
    name: 'Transcription Station',
    category: 'Listening Comprehension, Spelling',
    icon: Headphones,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'from-blue-100 to-cyan-100',
    iconColor: 'text-blue-600',
    description: 'Listen to audio and type exactly what you heard'
  },
  {
    id: 'audio-jumble',
    name: 'Audio Jumble',
    category: 'Listening, Grammar, Word Order',
    icon: Shuffle,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'from-purple-100 to-pink-100',
    iconColor: 'text-purple-600',
    description: 'Drag and drop words in the correct order'
  },
  {
    id: 'image-instinct',
    name: 'Image Instinct',
    category: 'Vocabulary, Recognition',
    icon: Grid3X3,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'from-green-100 to-emerald-100',
    iconColor: 'text-green-600',
    description: 'Match words with their corresponding images'
  },
  {
    id: 'translation-matchup',
    name: 'Translation Match-Up',
    category: 'Vocabulary, Translation',
    icon: BookOpen,
    color: 'from-orange-500 to-red-500',
    bgColor: 'from-orange-100 to-pink-100',
    iconColor: 'text-orange-600',
    description: 'Flip cards to match words with translations'
  },
  {
    id: 'secret-word-solver',
    name: 'Secret Word Solver',
    category: 'Vocabulary, Spelling',
    icon: Award,
    color: 'from-indigo-500 to-blue-500',
    bgColor: 'from-indigo-100 to-blue-100',
    iconColor: 'text-indigo-600',
    description: 'Guess letters to reveal hidden words'
  },
  {
    id: 'word-drop-dash',
    name: 'Word Drop Dash',
    category: 'Vocabulary, Quick Recognition',
    icon: Zap,
    color: 'from-yellow-500 to-orange-500',
    bgColor: 'from-yellow-100 to-orange-100',
    iconColor: 'text-yellow-600',
    description: 'Drag falling words before they disappear'
  },
  {
    id: 'conjugation-coach',
    name: 'Conjugation Coach',
    category: 'Grammar, Conjugation',
    icon: RotateCcw,
    color: 'from-teal-500 to-green-500',
    bgColor: 'from-teal-100 to-green-100',
    iconColor: 'text-teal-600',
    description: 'Select the correct verb conjugation'
  },
  {
    id: 'context-connect',
    name: 'Context Connect',
    category: 'Reading Comprehension, Vocabulary',
    icon: FileText,
    color: 'from-rose-500 to-pink-500',
    bgColor: 'from-rose-100 to-pink-100',
    iconColor: 'text-rose-600',
    description: 'Fill blanks with contextually appropriate words'
  },
  {
    id: 'syntax-scrambler',
    name: 'Syntax Scrambler',
    category: 'Grammar, Syntax',
    icon: BarChart3,
    color: 'from-sky-500 to-blue-500',
    bgColor: 'from-sky-100 to-blue-100',
    iconColor: 'text-sky-600',
    description: 'Arrange scrambled words into correct order'
  },
  {
    id: 'time-warp-tagger',
    name: 'Time Warp Tagger',
    category: 'Verb Tenses, Time Adverbs',
    icon: Clock,
    color: 'from-violet-500 to-purple-500',
    bgColor: 'from-violet-100 to-purple-100',
    iconColor: 'text-violet-600',
    description: 'Apply correct verb tense based on time reference'
  }
];

export default function Games() {
  const { user, isLoading, isAuthenticated } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
          <p className="text-gray-600 font-medium">Loading games...</p>
        </div>
      </div>
    );
  }

  // Redirect to sign in if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/signin" replace />;
  }
  return (
    <div className="min-h-screen bg-surface-base relative overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f4f4f5_1px,transparent_1px),linear-gradient(to_bottom,#f4f4f5_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

      <DashboardHeader userName={user.name} userAvatar={user.avatar} />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-content-primary mb-3">
            Language Learning <span className="text-content-primary">Games</span>
          </h1>
          <p className="text-lg text-content-secondary">Master your skills through fun, interactive games</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => {
            const Icon = game.icon;
            return (
              <Link
                key={game.id}
                to={`/games/${game.id}`}
                className="bg-surface-base p-6 rounded-xl border border-border-base shadow-sm hover:shadow-md hover:border-border-strong transition-all duration-200 group"
              >
                <div className={`w-14 h-14 rounded-lg border flex items-center justify-center mb-4 group-hover:scale-105 transition-transform ${game.bgColor.replace('to-', 'border-').replace('100', '200').replace('from-', 'bg-').split(' ')[0] + ' ' + game.bgColor.replace('to-', 'border-').replace('100', '200').replace('from-', 'bg-').split(' ')[0].replace('bg-', 'border-')
                  } bg-opacity-50`}>
                  <Icon className={`w-7 h-7 ${game.iconColor}`} />
                </div>

                <h3 className="text-xl font-bold text-content-primary mb-1">{game.name}</h3>
                <p className="text-sm text-content-tertiary mb-3">{game.category}</p>
                <p className="text-content-secondary text-sm mb-4">{game.description}</p>

                <div className="flex items-center gap-2 text-content-primary font-semibold text-sm group-hover:gap-3 transition-all">
                  Play Now <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
