import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Home } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <header
        className={`bg-white border-b border-gray-200 shadow-sm transition-all duration-300 ease-in-out transform ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/games" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                {progress && <p className="text-sm text-gray-600">Round {progress}</p>}
              </div>
            </div>
            <div className="flex items-center gap-6">
              {score !== undefined && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{score}</div>
                  <div className="text-sm text-gray-600">Points</div>
                </div>
              )}
              <Link to="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Home className="w-6 h-6 text-gray-600" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {children}
      </main>
    </div>
  );
}
