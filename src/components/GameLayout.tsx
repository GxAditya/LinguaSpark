import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Home, Trophy } from 'lucide-react';

interface GameLayoutProps {
  title: string;
  children: React.ReactNode;
  score?: number;
  progress?: string;
}

export default function GameLayout({ title, children, score = 0, progress = '' }: GameLayoutProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const headerHeight = 64;

      if (currentScrollY > headerHeight) {
        if (currentScrollY > lastScrollY) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-200 to-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-200 to-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      
      <header
        className={`sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300 ease-in-out transform ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                to="/games" 
                className="p-2 hover:bg-orange-50 rounded-xl transition-colors group"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:text-orange-600" />
              </Link>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h1>
                {progress && (
                  <p className="text-sm text-gray-500">Round {progress}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-6">
              {score !== undefined && (
                <div className="flex items-center gap-2 bg-gradient-to-r from-orange-100 to-pink-100 px-4 py-2 rounded-xl">
                  <Trophy className="w-5 h-5 text-orange-600" />
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-600">{score}</div>
                  </div>
                </div>
              )}
              <Link 
                to="/dashboard" 
                className="p-2 hover:bg-orange-50 rounded-xl transition-colors group"
              >
                <Home className="w-6 h-6 text-gray-600 group-hover:text-orange-600" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {children}
      </main>
    </div>
  );
}
