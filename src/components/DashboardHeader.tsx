import React, { useState } from 'react';
import { Menu, X, LogOut } from 'lucide-react';

interface DashboardHeaderProps {
  activeTab: 'dashboard' | 'lessons' | 'practice' | 'games';
  onTabChange: (tab: 'dashboard' | 'lessons' | 'practice' | 'games') => void;
  userName?: string;
}

export default function DashboardHeader({ activeTab, onTabChange, userName = 'User' }: DashboardHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'lessons', label: 'Lessons' },
    { id: 'practice', label: 'Practice' },
    { id: 'games', label: 'Games' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <a href="/" className="inline-block">
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              LinguaSpark
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id as any)}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-orange-100 text-orange-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <img
                src="https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop"
                alt={userName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="text-sm font-medium text-gray-700">{userName}</span>
            </div>

            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <LogOut className="w-5 h-5 text-gray-600" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pt-4 border-t border-gray-200 flex flex-col gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id as any);
                  setMobileMenuOpen(false);
                }}
                className={`px-4 py-2 rounded-lg font-medium text-left transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-orange-100 text-orange-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
