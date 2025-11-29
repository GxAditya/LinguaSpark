import React, { useState } from 'react';
import DashboardHeader from '../components/DashboardHeader';
import { MessageCircle, Mic, Send, ChevronRight, ChevronLeft, Users, Target, Brain } from 'lucide-react';

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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex flex-col relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-200 to-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-200 to-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        
        <DashboardHeader userName="John Doe" />

        <main className="relative z-10 flex-1 max-w-4xl mx-auto w-full px-6 py-12 flex flex-col">
          <button
            onClick={() => setSelectedScenario(null)}
            className="flex items-center gap-2 text-orange-600 font-semibold mb-8 hover:gap-3 transition-all group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Scenarios
          </button>

          <div className="card flex-1 p-8 flex flex-col mb-6">
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{selectedScenario.title}</h2>
              <p className="text-gray-600 mt-2">{selectedScenario.description}</p>
            </div>

            <div className="flex-1 overflow-y-auto mb-6 space-y-4 bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl p-4" style={{ maxHeight: '400px' }}>
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 ${
                      message.type === 'user'
                        ? 'chat-bubble-user'
                        : 'chat-bubble-ai'
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
                className="input-primary"
              />
              <button
                onClick={handleSendMessage}
                className="btn-primary-md flex items-center gap-2"
              >
                <Send className="w-5 h-5" /> Send
              </button>
            </div>
          </div>

          <div className="alert-info">
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-200 to-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-200 to-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
      
      <DashboardHeader userName="John Doe" />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Scenario-Based <span className="text-gradient-brand">Practice</span>
          </h1>
          <p className="text-lg text-gray-600">Have real conversations with our AI partner in various real-world situations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => handleStartScenario(scenario)}
              className="card-interactive p-6 text-left"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="icon-container-orange w-12 h-12 text-orange-600 group-hover:scale-110">
                  {scenario.icon}
                </div>
                <span className={`badge text-white bg-gradient-to-r ${getDifficultyColor(scenario.difficulty)}`}>
                  {scenario.difficulty}
                </span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">{scenario.title}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{scenario.description}</p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">~{scenario.duration} minutes</span>
                <span className="badge bg-gray-100 text-gray-600">{scenario.topic}</span>
              </div>

              <div className="flex items-center gap-2 text-orange-600 font-semibold text-sm group-hover:gap-3 transition-all mt-4">
                Start Practice <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>

        <div className="card p-8 mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How Practice Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="icon-container-orange w-12 h-12">
                  <MessageCircle className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">1. Choose a Scenario</h3>
                <p className="mt-2 text-sm text-gray-600">Select a real-world conversation scenario that interests you.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="icon-container-pink w-12 h-12">
                  <Mic className="h-6 w-6 text-pink-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">2. Respond & Practice</h3>
                <p className="mt-2 text-sm text-gray-600">Type or speak your responses. Our AI provides instant feedback.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="icon-container-purple w-12 h-12">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">3. Learn & Improve</h3>
                <p className="mt-2 text-sm text-gray-600">Get corrections and alternative phrases to expand your vocabulary.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
