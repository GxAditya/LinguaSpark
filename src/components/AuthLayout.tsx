import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-200 to-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-200 to-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-2000"></div>

        <div className="relative z-10 w-full max-w-md">
          {children}
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 via-pink-400/20 to-purple-500/20"></div>

        <div className="relative z-10 max-w-lg text-white">
          <a href="/" className="inline-block mb-12">
            <span className="text-3xl font-bold">LinguaSpark</span>
          </a>

          <h2 className="text-4xl font-bold mb-6 leading-tight">
            Master Any Language Faster Than Ever
          </h2>

          <p className="text-lg mb-8 text-white/90 leading-relaxed">
            Join over 50,000 learners using AI-powered conversations and personalized lessons to achieve fluency in record time.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div>
                <div className="font-semibold">AI Conversation Practice</div>
                <div className="text-sm text-white/80">Chat naturally with advanced AI</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div>
                <div className="font-semibold">Personalized Lessons</div>
                <div className="text-sm text-white/80">Custom-tailored to your goals</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div>
                <div className="font-semibold">Track Your Progress</div>
                <div className="text-sm text-white/80">See your improvement daily</div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex items-center gap-8">
            <div>
              <div className="text-3xl font-bold">50K+</div>
              <div className="text-sm text-white/80">Learners</div>
            </div>
            <div>
              <div className="text-3xl font-bold">15+</div>
              <div className="text-sm text-white/80">Languages</div>
            </div>
            <div>
              <div className="text-3xl font-bold">4.9</div>
              <div className="text-sm text-white/80">Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
