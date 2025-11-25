import React, { useState } from 'react';
import DashboardHeader from '../components/DashboardHeader';
import { MessageCircle, Mic, Send, ChevronRight, Users, Target, Brain } from 'lucide-react';

interface Scenario {
  id: number;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration: number;
  topic: string;
  icon: React.ReactNode;
}

interface Message {
  id: number;
  type: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export default function Practice() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'lessons' | 'practice' | 'games'>('practice');
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'ai',
      text: 'Hola! Welcome to your Spanish conversation practice. I\'m your AI conversation partner. Let\'s practice ordering food at a restaurant. I\'ll be a restaurant server. What would you like to say?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const scenarios: Scenario[] = [
    {
      id: 1,
      title: 'Ordering at a Restaurant',
      description: 'Practice your conversational skills by ordering food and drinks at a Spanish restaurant.',
      difficulty: 'Easy',
      duration: 10,
      topic: 'Food & Dining',
      icon: <Users className="w-6 h-6" />
    },
    {
      id: 2,
      title: 'Hotel Check-In',
      description: 'Learn how to check in at a hotel and request specific rooms or services.',
      difficulty: 'Easy',
      duration: 12,
      topic: 'Travel & Accommodation',
      icon: <Target className="w-6 h-6" />
    },
    {
      id: 3,
      title: 'Shopping at the Market',
      description: 'Practice negotiating prices and asking about products at a local market.',
      difficulty: 'Medium',
      duration: 15,
      topic: 'Shopping',
      icon: <MessageCircle className="w-6 h-6" />
    },
    {
      id: 4,
      title: 'Doctor\'s Appointment',
      description: 'Learn medical vocabulary and how to describe symptoms to a doctor.',
      difficulty: 'Medium',
      duration: 15,
      topic: 'Healthcare',
      icon: <Brain className="w-6 h-6" />
    },
    {
      id: 5,
      title: 'Job Interview',
      description: 'Practice answering interview questions and discussing your experience.',
      difficulty: 'Hard',
      duration: 20,
      topic: 'Professional',
      icon: <Users className="w-6 h-6" />
    },
    {
      id: 6,
      title: 'Making a Phone Call',
      description: 'Master telephone etiquette and common phrases for business calls.',
      difficulty: 'Hard',
      duration: 18,
      topic: 'Communication',
      icon: <MessageCircle className="w-6 h-6" />
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'from-green-500 to-emerald-500';
      case 'Medium':
        return 'from-blue-500 to-cyan-500';
      case 'Hard':
        return 'from-purple-500 to-pink-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const userMessage: Message = {
        id: messages.length + 1,
        type: 'user',
        text: inputValue,
        timestamp: new Date()
      };

      setMessages([...messages, userMessage]);
      setInputValue('');

      setTimeout(() => {
        const aiResponses = [
          'Excelente! Your pronunciation was great. Let me ask you another question.',
          'That\'s a good response! However, you could also say it this way: [alternative phrase]. Try again!',
          'Perfect! You\'re making great progress. Let\'s continue with the next topic.',
          'Good effort! Remember to pay attention to the verb conjugation. Try once more.',
          'Muy bien! You\'re getting better at this conversation. What else would you like to say?'
        ];

        const aiMessage: Message = {
          id: messages.length + 2,
          type: 'ai',
          text: aiResponses[Math.floor(Math.random() * aiResponses.length)],
          timestamp: new Date()
        };

        setMessages((prev) => [...prev, aiMessage]);
      }, 800);
    }
  };

  const handleStartScenario = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setMessages([
      {
        id: 1,
        type: 'ai',
        text: `Great! We're practicing: ${scenario.title}. ${scenario.description}\n\nFeel free to type your responses or use the microphone to practice speaking. I'll provide feedback on your pronunciation and grammar.`,
        timestamp: new Date()
      }
    ]);
  };

  if (selectedScenario) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex flex-col">
        <DashboardHeader activeTab={activeTab} onTabChange={setActiveTab} userName="John Doe" />

        <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 flex flex-col">
          <button
            onClick={() => setSelectedScenario(null)}
            className="flex items-center gap-2 text-orange-600 font-semibold mb-8 hover:gap-3 transition-all"
          >
            <ChevronRight className="w-5 h-5 rotate-180" /> Back to Scenarios
          </button>

          <div className="flex-1 bg-white rounded-2xl shadow-lg p-8 flex flex-col mb-6">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900">{selectedScenario.title}</h2>
              <p className="text-gray-600 mt-2">{selectedScenario.description}</p>
            </div>

            <div className="flex-1 overflow-y-auto mb-6 space-y-4 bg-gray-50 rounded-xl p-4" style={{ maxHeight: '400px' }}>
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-br-none'
                        : 'bg-gray-200 text-gray-900 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 items-center mb-4">
              <button
                onClick={() => setIsRecording(!isRecording)}
                className={`p-3 rounded-full transition-all ${
                  isRecording
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                }`}
              >
                <Mic className="w-6 h-6" />
              </button>
              {isRecording && <span className="text-sm text-red-600 font-semibold">Recording...</span>}
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your response in Spanish..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
              <button
                onClick={handleSendMessage}
                className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow flex items-center gap-2"
              >
                <Send className="w-5 h-5" /> Send
              </button>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Tips for this scenario:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Speak clearly and naturally</li>
              <li>• Don't worry about perfect grammar - focus on communication</li>
              <li>• Ask questions if you don't understand something</li>
              <li>• Pay attention to the AI's feedback and corrections</li>
            </ul>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <DashboardHeader activeTab={activeTab} onTabChange={setActiveTab} userName="John Doe" />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Scenario-Based Practice</h1>
          <p className="text-lg text-gray-600">Have real conversations with our AI partner in various real-world situations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => handleStartScenario(scenario)}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300 group text-left"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                  {scenario.icon}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getDifficultyColor(scenario.difficulty)}`}>
                  {scenario.difficulty}
                </span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">{scenario.title}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{scenario.description}</p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">~{scenario.duration} minutes</span>
                <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">{scenario.topic}</span>
              </div>

              <div className="flex items-center gap-2 text-orange-600 font-semibold text-sm group-hover:gap-3 transition-all mt-4">
                Start Practice <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How Practice Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                  <MessageCircle className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">1. Choose a Scenario</h3>
                <p className="mt-2 text-gray-600">Select a real-world conversation scenario that interests you.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-pink-500 text-white">
                  <Mic className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">2. Respond & Practice</h3>
                <p className="mt-2 text-gray-600">Type or speak your responses. Our AI provides instant feedback.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white">
                  <Target className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">3. Learn & Improve</h3>
                <p className="mt-2 text-gray-600">Get corrections and alternative phrases to expand your vocabulary.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
