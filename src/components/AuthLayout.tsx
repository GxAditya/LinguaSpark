import React from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Form side */}
      <div className="flex-1 flex items-center justify-center px-6 py-6 bg-white relative overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f5f5f5_1px,transparent_1px),linear-gradient(to_bottom,#f5f5f5_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

        <div className="relative z-10 w-full max-w-md">
          {children}
        </div>
      </div>

      {/* Branding side */}
      <div className="hidden lg:flex flex-1 bg-gray-900 items-center justify-center p-12 relative overflow-hidden border-l border-gray-800">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>

        <div className="relative z-10 max-w-lg text-white">
          <Link to="/" className="inline-block mb-12 group">
            <span className="text-3xl font-bold group-hover:opacity-80 transition-opacity tracking-tight">LinguaSpark</span>
          </Link>

          <h2 className="text-4xl font-bold mb-6 leading-tight tracking-tight">
            Master Any Language Faster Than Ever
          </h2>

          <p className="text-lg mb-10 text-gray-400 leading-relaxed">
            Join over 50,000 learners using AI-powered conversations and personalized lessons to achieve fluency in record time.
          </p>

          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-sm"></div>
              </div>
              <div>
                <div className="font-semibold">AI Conversation Practice</div>
                <div className="text-sm text-gray-400">Chat naturally with advanced AI</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-sm"></div>
              </div>
              <div>
                <div className="font-semibold">Personalized Lessons</div>
                <div className="text-sm text-gray-400">Custom-tailored to your goals</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-sm"></div>
              </div>
              <div>
                <div className="font-semibold">Track Your Progress</div>
                <div className="text-sm text-gray-400">See your improvement daily</div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex items-center gap-10 border-t border-gray-800 pt-8">
            <div>
              <div className="text-4xl font-bold">50K+</div>
              <div className="text-sm text-gray-400">Learners</div>
            </div>
            <div>
              <div className="text-4xl font-bold">15+</div>
              <div className="text-sm text-gray-400">Languages</div>
            </div>
            <div>
              <div className="text-4xl font-bold">4.9</div>
              <div className="text-sm text-gray-400">Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
