import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../context';

interface DashboardHeaderProps {
  activeTab?: 'dashboard' | 'lessons' | 'practice' | 'games';
  onTabChange?: (tab: 'dashboard' | 'lessons' | 'practice' | 'games') => void;
  userName?: string;
  userAvatar?: string;
}

export default function DashboardHeader({ activeTab, userName = 'User', userAvatar }: DashboardHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Determine active tab from URL if not provided
  const getCurrentTab = () => {
    if (activeTab) return activeTab;
    const path = location.pathname;
    if (path.includes('/lessons')) return 'lessons';
    if (path.includes('/practice')) return 'practice';
    if (path.includes('/games')) return 'games';
    return 'dashboard';
  };

  const currentTab = getCurrentTab();

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

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },
    { id: 'lessons', label: 'Lessons', path: '/lessons' },
    { id: 'practice', label: 'Practice', path: '/practice' },
    { id: 'games', label: 'Games', path: '/games' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 bg-surface-base/90 backdrop-blur-md border-b border-border-base transition-all duration-300 ease-in-out transform ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-block">
            <span className="text-2xl font-bold text-content-primary tracking-tight">
              LinguaSpark
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 border border-transparent ${currentTab === item.id
                  ? 'bg-action-primary text-action-primary-fg'
                  : 'text-content-secondary hover:text-content-primary hover:bg-surface-subtle hover:border-border-base'
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 pl-4 border-l border-border-base">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-content-primary">{userName}</p>
                <p className="text-xs text-content-secondary">Free Plan</p>
              </div>
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={userName}
                  className="w-10 h-10 rounded-lg object-cover border border-border-base"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-surface-subtle border border-border-base flex items-center justify-center">
                  <span className="text-sm font-semibold text-content-secondary">
                    {userName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-content-tertiary hover:text-content-primary hover:bg-surface-subtle rounded-lg transition-all"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-orange-50 rounded-xl transition-colors"
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
          <nav className="md:hidden mt-4 pt-4 border-t border-gray-100 flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl font-medium text-left transition-all duration-200 ${currentTab === item.id
                  ? 'bg-gradient-to-r from-orange-100 to-pink-100 text-orange-600'
                  : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
