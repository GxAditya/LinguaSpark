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
    <div className="min-h-screen bg-page hero-grid relative overflow-hidden">
      {/* Background glow effects */}
      <div className="hero-orb hero-orb-ember top-1/4 left-1/4 w-96 h-96"></div>
      <div className="hero-orb hero-orb-iris bottom-1/4 right-1/4 w-96 h-96 animate-float-soft"></div>
      
      <header
        className={`sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border-base shadow-soft transition-all duration-300 ease-in-out transform ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                to="/games" 
                className="p-2 hover:bg-surface-2 rounded-xl transition-colors group"
              >
                <ChevronLeft className="w-6 h-6 text-muted group-hover:text-accent" />
              </Link>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-primary">{title}</h1>
                {progress && (
                  <p className="text-sm text-soft">Round {progress}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-6">
              {score !== undefined && (
                <div className="flex items-center gap-2 tone-brand border px-4 py-2 rounded-xl">
                  <Trophy className="w-5 h-5 text-accent" />
                  <div className="text-center">
                    <div className="text-lg font-bold text-accent">{score}</div>
                  </div>
                </div>
              )}
              <Link 
                to="/dashboard" 
                className="p-2 hover:bg-surface-2 rounded-xl transition-colors group"
              >
                <Home className="w-6 h-6 text-muted group-hover:text-accent" />
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
