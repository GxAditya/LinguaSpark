import React from 'react';
import { MessageCircle, Keyboard, Music, Brain, TrendingUp, Bot } from 'lucide-react';

export default function Features() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Six Ways to Spark Your Fluency
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We've packed LinguaSpark with features that actually make learning addictive. 
            <span className="text-orange-600 font-medium"> (Yes, really.)</span>
          </p>
        </div>
        
        {/* Creative Feature Layout */}
        <div className="space-y-32">
          
          {/* Feature 1: AI Language Helper - Floating Chat Interface */}
          <div className="relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="bg-orange-500 inline-flex p-3 rounded-2xl mb-6 shadow-lg">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wide block mb-2">
                  AI Language Helper
                </span>
                <h3 className="text-4xl font-bold text-gray-900 mb-4">
                  Your 24/7 Language Sidekick
                </h3>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Ask anything, learn everything — no awkward pauses.
                </p>
                <button className="bg-orange-500 text-white font-semibold px-8 py-4 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                  Meet Your AI Buddy
                </button>
              </div>
              <div className="order-1 lg:order-2 relative">
                <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md mx-auto">
                  <div className="space-y-4">
                    <div className="bg-gray-100 p-4 rounded-2xl rounded-br-sm">
                      <p className="text-gray-800">How do I say "I'm excited" in Spanish?</p>
                    </div>
                    <div className="bg-orange-500 text-white p-4 rounded-2xl rounded-bl-sm">
                      <p>"¡Estoy emocionado!" Try saying it with enthusiasm! 🎉</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-2xl rounded-br-sm">
                      <p className="text-gray-800">Can you help me practice pronunciation?</p>
                    </div>
                    <div className="bg-orange-500 text-white p-4 rounded-2xl rounded-bl-sm opacity-50">
                      <p>Of course! Let's start with...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2: Conversation Practice - Speech Bubbles */}
          <div className="relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="bg-pink-500 text-white p-6 rounded-3xl rounded-bl-sm max-w-xs shadow-xl">
                      <p className="font-medium">¿Cómo estuvo tu día?</p>
                    </div>
                    <div className="mt-4 ml-8 bg-white p-6 rounded-3xl rounded-br-sm max-w-xs shadow-xl border">
                      <p className="text-gray-800">¡Fue increíble! Aprendí muchas palabras nuevas.</p>
                    </div>
                    <div className="mt-4 bg-pink-500 text-white p-6 rounded-3xl rounded-bl-sm max-w-xs shadow-xl">
                      <p className="font-medium">¡Excelente! ¿Cuál fue tu favorita?</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="bg-pink-500 inline-flex p-3 rounded-2xl mb-6 shadow-lg">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wide block mb-2">
                  AI Conversation Practice
                </span>
                <h3 className="text-4xl font-bold text-gray-900 mb-4">
                  Talk the Talk (Without the Sweat)
                </h3>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Converse with an AI that never runs out of patience or topics.
                </p>
                <button className="bg-pink-500 text-white font-semibold px-8 py-4 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                  Start Chatting Now
                </button>
              </div>
            </div>
          </div>

          {/* Feature 3: Typing Test - Keyboard Visualization */}
          <div className="relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="bg-purple-500 inline-flex p-3 rounded-2xl mb-6 shadow-lg">
                  <Keyboard className="w-8 h-8 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wide block mb-2">
                  Typing Test
                </span>
                <h3 className="text-4xl font-bold text-gray-900 mb-4">
                  Fast Fingers, Fluent Mind
                </h3>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Boost your speed and accuracy — one keystroke at a time.
                </p>
                <button className="bg-purple-500 text-white font-semibold px-8 py-4 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                  Test My Speed
                </button>
              </div>
              <div className="order-1 lg:order-2">
                <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md mx-auto">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-purple-500 mb-2">85 WPM</div>
                    <div className="text-gray-600">Current Speed</div>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-xl mb-4">
                    <p className="text-gray-800 font-mono">
                      The quick brown fox jumps over the lazy dog. 
                      <span className="bg-purple-200 animate-pulse">|</span>
                    </p>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Accuracy: 96%</span>
                    <span>Time: 1:23</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 4: Song Vocab - Music Player Interface */}
          <div className="relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md mx-auto">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-200 to-pink-200 rounded-xl flex items-center justify-center">
                      <Music className="w-8 h-8 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">Despacito</div>
                      <div className="text-gray-600">Luis Fonsi</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-orange-600 font-bold">Despacito</span>
                      <span className="text-gray-600">- slowly</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-orange-600 font-bold">Corazón</span>
                      <span className="text-gray-600">- heart</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-orange-600 font-bold">Bailar</span>
                      <span className="text-gray-600">- to dance</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="bg-orange-500 inline-flex p-3 rounded-2xl mb-6 shadow-lg">
                  <Music className="w-8 h-8 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wide block mb-2">
                  Song Vocab Practice
                </span>
                <h3 className="text-4xl font-bold text-gray-900 mb-4">
                  Learn Lyrics, Live the Language
                </h3>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Pick up new words straight from your favorite tracks.
                </p>
                <button className="bg-orange-500 text-white font-semibold px-8 py-4 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                  Play My Song
                </button>
              </div>
            </div>
          </div>

          {/* Feature 5: AI Lessons - Lesson Generator */}
          <div className="relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="bg-pink-500 inline-flex p-3 rounded-2xl mb-6 shadow-lg">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wide block mb-2">
                  AI-Generated Lessons
                </span>
                <h3 className="text-4xl font-bold text-gray-900 mb-4">
                  Lessons That Learn You Back
                </h3>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Custom-tailored learning paths, built in seconds.
                </p>
                <button className="bg-pink-500 text-white font-semibold px-8 py-4 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                  Generate My Lesson
                </button>
              </div>
              <div className="order-1 lg:order-2">
                <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md mx-auto">
                  <div className="text-center mb-6">
                    <div className="text-lg font-bold text-gray-900 mb-2">Generating your lesson...</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-pink-500 h-2 rounded-full w-3/4 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-pink-50 p-4 rounded-xl">
                      <div className="font-semibold text-pink-700 mb-2">Today's Focus: Restaurant Vocabulary</div>
                      <div className="text-sm text-gray-600">Based on your upcoming trip to Madrid</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                        <span className="text-gray-700">15 new words</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                        <span className="text-gray-700">3 conversation scenarios</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                        <span className="text-gray-700">Pronunciation practice</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 6: Progress Tracking - Visual Dashboard */}
          <div className="relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md mx-auto">
                  <div className="text-center mb-6">
                    <div className="text-2xl font-bold text-gray-900 mb-2">Your Learning Journey</div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-700 font-medium">Spanish</span>
                        <span className="text-purple-600 font-bold">Level 7</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-purple-500 h-3 rounded-full w-4/5"></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-purple-600">1,247</div>
                        <div className="text-xs text-gray-500">Words Learned</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-orange-500">23</div>
                        <div className="text-xs text-gray-500">Day Streak</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-pink-500">89%</div>
                        <div className="text-xs text-gray-500">Accuracy</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="bg-purple-500 inline-flex p-3 rounded-2xl mb-6 shadow-lg">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wide block mb-2">
                  Progress Tracking
                </span>
                <h3 className="text-4xl font-bold text-gray-900 mb-4">
                  Your Growth, in Glorious Color
                </h3>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Watch your skills bloom with beautiful, motivating visuals.
                </p>
                <button className="bg-purple-500 text-white font-semibold px-8 py-4 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                  See My Progress
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}