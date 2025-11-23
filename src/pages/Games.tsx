import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardHeader from '../components/DashboardHeader';
import { Headphones, BookOpen, Grid3X3, Shuffle, Award, Zap, RotateCcw, FileText, BarChart3, Clock } from 'lucide-react';

const games = [
  {
    id: 'transcription-station',
    name: 'Transcription Station',
    category: 'Listening Comprehension, Spelling',
    icon: Headphones,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'from-blue-100 to-cyan-100',
    description: 'Listen to audio and type exactly what you heard'
  },
  {
    id: 'audio-jumble',
    name: 'Audio Jumble',
    category: 'Listening, Grammar, Word Order',
    icon: Shuffle,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'from-purple-100 to-pink-100',
    description: 'Drag and drop words in the correct order'
  },
  {
    id: 'image-instinct',
    name: 'Image Instinct',
    category: 'Vocabulary, Recognition',
    icon: Grid3X3,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'from-green-100 to-emerald-100',
    description: 'Match words with their corresponding images'
  },
  {
    id: 'translation-matchup',
    name: 'Translation Match-Up',
    category: 'Vocabulary, Translation',
    icon: BookOpen,
    color: 'from-orange-500 to-red-500',
    bgColor: 'from-orange-100 to-red-100',
    description: 'Flip cards to match words with translations'
  },
  {
    id: 'secret-word-solver',
    name: 'Secret Word Solver',
    category: 'Vocabulary, Spelling',
    icon: Award,
    color: 'from-indigo-500 to-blue-500',
    bgColor: 'from-indigo-100 to-blue-100',
    description: 'Guess letters to reveal hidden words'
  },
  {
    id: 'word-drop-dash',
    name: 'Word Drop Dash',
    category: 'Vocabulary, Quick Recognition',
    icon: Zap,
    color: 'from-yellow-500 to-orange-500',
    bgColor: 'from-yellow-100 to-orange-100',
    description: 'Drag falling words before they disappear'
  },
  {
    id: 'conjugation-coach',
    name: 'Conjugation Coach',
    category: 'Grammar, Conjugation',
    icon: RotateCcw,
    color: 'from-teal-500 to-green-500',
    bgColor: 'from-teal-100 to-green-100',
    description: 'Select the correct verb conjugation'
  },
  {
    id: 'context-connect',
    name: 'Context Connect',
    category: 'Reading Comprehension, Vocabulary',
    icon: FileText,
    color: 'from-rose-500 to-pink-500',
    bgColor: 'from-rose-100 to-pink-100',
    description: 'Fill blanks with contextually appropriate words'
  },
  {
    id: 'syntax-scrambler',
    name: 'Syntax Scrambler',
    category: 'Grammar, Syntax',
    icon: BarChart3,
    color: 'from-sky-500 to-blue-500',
    bgColor: 'from-sky-100 to-blue-100',
    description: 'Arrange scrambled words into correct order'
  },
  {
    id: 'time-warp-tagger',
    name: 'Time Warp Tagger',
    category: 'Verb Tenses, Time Adverbs',
    icon: Clock,
    color: 'from-violet-500 to-purple-500',
    bgColor: 'from-violet-100 to-purple-100',
    description: 'Apply correct verb tense based on time reference'
  }
];

export default function Games() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'lessons' | 'practice' | 'games'>('games');

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <DashboardHeader activeTab={activeTab} onTabChange={setActiveTab} userName="John Doe" />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Language Learning Games</h1>
          <p className="text-lg text-gray-600">Master your skills through fun, interactive games</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => {
            const Icon = game.icon;
            return (
              <Link
                key={game.id}
                to={`/games/${game.id}`}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300 group"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${game.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-8 h-8 bg-gradient-to-br ${game.color} bg-clip-text text-transparent`} />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-1">{game.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{game.category}</p>
                <p className="text-gray-600 text-sm mb-4">{game.description}</p>

                <div className="flex items-center gap-2 text-orange-600 font-medium text-sm group-hover:gap-3 transition-all">
                  Play Now <span className="text-lg">→</span>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
