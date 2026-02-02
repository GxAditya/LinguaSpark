import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import DashboardHeader from '../components/DashboardHeader';
import { Headphones, BookOpen, Shuffle, Award, Zap, RotateCcw, FileText, BarChart3, Clock, ChevronRight, Loader2, Globe, ChevronDown } from 'lucide-react';
import { useAuth } from '../context';

const languages = [
  { code: 'spanish', name: 'Spanish' },
  { code: 'french', name: 'French' },
  { code: 'german', name: 'German' },
  { code: 'italian', name: 'Italian' },
  { code: 'portuguese', name: 'Portuguese' },
  { code: 'japanese', name: 'Japanese' },
  { code: 'korean', name: 'Korean' },
  { code: 'chinese', name: 'Chinese' },
  { code: 'arabic', name: 'Arabic' },
  { code: 'hindi', name: 'Hindi' },
  { code: 'russian', name: 'Russian' },
  { code: 'dutch', name: 'Dutch' },
];

const games = [
  {
    id: 'transcription-station',
    name: 'Transcription Station',
    category: 'Listening Comprehension, Spelling',
    icon: Headphones,
    toneClass: 'tone-brand',
    iconClass: 'text-accent',
    description: 'Listen to audio and type exactly what you heard'
  },
  {
    id: 'audio-jumble',
    name: 'Audio Jumble',
    category: 'Listening, Grammar, Word Order',
    icon: Shuffle,
    toneClass: 'tone-iris',
    iconClass: 'text-accent-3',
    description: 'Drag and drop words in the correct order'
  },

  {
    id: 'translation-matchup',
    name: 'Translation Match-Up',
    category: 'Vocabulary, Translation',
    icon: BookOpen,
    toneClass: 'tone-mint',
    iconClass: 'text-accent-4',
    description: 'Flip cards to match words with translations'
  },
  {
    id: 'secret-word-solver',
    name: 'Secret Word Solver',
    category: 'Vocabulary, Spelling',
    icon: Award,
    toneClass: 'tone-ember',
    iconClass: 'text-accent-2',
    description: 'Guess letters to reveal hidden words'
  },
  {
    id: 'word-drop-dash',
    name: 'Word Drop Dash',
    category: 'Vocabulary, Quick Recognition',
    icon: Zap,
    toneClass: 'tone-sand',
    iconClass: 'text-accent-2',
    description: 'Drag falling words before they disappear'
  },
  {
    id: 'conjugation-coach',
    name: 'Conjugation Coach',
    category: 'Grammar, Conjugation',
    icon: RotateCcw,
    toneClass: 'tone-brand',
    iconClass: 'text-accent',
    description: 'Select the correct verb conjugation'
  },
  {
    id: 'context-connect',
    name: 'Context Connect',
    category: 'Reading Comprehension, Vocabulary',
    icon: FileText,
    toneClass: 'tone-iris',
    iconClass: 'text-accent-3',
    description: 'Fill blanks with contextually appropriate words'
  },
  {
    id: 'syntax-scrambler',
    name: 'Syntax Scrambler',
    category: 'Grammar, Syntax',
    icon: BarChart3,
    toneClass: 'tone-ember',
    iconClass: 'text-accent-2',
    description: 'Arrange scrambled words into correct order'
  },
  {
    id: 'time-warp-tagger',
    name: 'Time Warp Tagger',
    category: 'Verb Tenses, Time Adverbs',
    icon: Clock,
    toneClass: 'tone-mint',
    iconClass: 'text-accent-4',
    description: 'Apply correct verb tense based on time reference'
  }
];

export default function Games() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [selectedLanguage, setSelectedLanguage] = useState('spanish');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const currentLanguage = languages.find(l => l.code === selectedLanguage) || languages[0];

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-page hero-grid flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-accent animate-spin" />
          <p className="text-muted font-medium">Loading games...</p>
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
      <div className="absolute inset-0 hero-grid"></div>

      <DashboardHeader userName={user.name} userAvatar={user.avatar} />

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-12">
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-3">
            <h1 className="text-4xl md:text-5xl font-bold text-content-primary">
              Language Learning <span className="text-content-primary">Games</span>
            </h1>

            {/* Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 px-4 py-2.5 bg-surface-base border border-border-base rounded-xl shadow-sm hover:shadow-md hover:border-border-strong transition-all duration-200"
              >
                <Globe className="w-5 h-5 text-accent" />
                <span className="font-medium text-content-primary">{currentLanguage.name}</span>
                <ChevronDown className={`w-4 h-4 text-content-secondary transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <>
                  {/* Backdrop to close dropdown */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsDropdownOpen(false)}
                  />

                  {/* Dropdown menu */}
                  <div className="absolute right-0 mt-2 w-56 bg-surface-base border border-border-base rounded-xl shadow-lg z-20 py-2 max-h-80 overflow-y-auto">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setSelectedLanguage(lang.code);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-surface-2 transition-colors ${selectedLanguage === lang.code ? 'tone-brand border border-accent' : 'text-content-primary'
                          }`}
                      >
                        <span className="font-medium">{lang.name}</span>
                        {selectedLanguage === lang.code && (
                          <span className="ml-auto text-accent">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          <p className="text-lg text-content-secondary">Master your skills through fun, interactive games • Learning <span className="font-semibold text-accent">{currentLanguage.name}</span></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => {
            const Icon = game.icon;
            return (
              <Link
                key={game.id}
                to={`/games/${game.id}?language=${selectedLanguage}`}
                className="bg-surface-base p-6 rounded-xl border border-border-base shadow-sm hover:shadow-md hover:border-border-strong transition-all duration-200 group"
              >
                <div className={`w-14 h-14 rounded-lg border flex items-center justify-center mb-4 group-hover:scale-105 transition-transform ${game.toneClass}`}>
                  <Icon className={`w-7 h-7 ${game.iconClass}`} />
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
