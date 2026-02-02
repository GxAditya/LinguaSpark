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
  const [isScrolled, setIsScrolled] = useState(false);
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

      setIsScrolled(currentScrollY > 20);

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
    <header className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[min(94%,1100px)] transition-all duration-300 ease-in-out ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}>
      <div className={`${isScrolled ? 'glass-header-solid' : 'glass-header'} rounded-2xl px-4 md:px-6`}>
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="hidden md:flex items-center gap-2">
            <img
              src="/Linguaspark-logo.png"
              alt="LinguaSpark Logo"
              className="w-9 h-9 object-contain"
            />
            <span className="text-xl font-bold text-primary tracking-tight">LinguaSpark</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`relative px-4 py-2 font-medium transition-all duration-300 group ${currentTab === item.id
                  ? 'text-accent'
                  : 'text-muted hover:text-accent'
                  }`}
              >
                {item.label}
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 underline-accent transition-all duration-300 rounded-full ${currentTab === item.id ? 'w-3/4' : 'w-0 group-hover:w-3/4'}`}></span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3 pl-4 border-l border-default">
              <div className="text-right">
                <p className="text-sm font-semibold text-primary">{userName}</p>
                <p className="text-xs text-muted">Free Plan</p>
              </div>
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={userName}
                  className="w-9 h-9 rounded-lg object-cover border border-default"
                />
              ) : (
                <div className="w-9 h-9 rounded-lg bg-surface-2 border border-default flex items-center justify-center">
                  <span className="text-xs font-semibold text-muted">
                    {userName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="hidden md:inline-flex p-2 text-muted hover:text-accent hover:bg-surface-2 rounded-lg transition-all"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>

            <Link to="/" className="md:hidden text-lg font-bold text-primary">
              LinguaSpark
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-2 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6">
                <Menu
                  className={`absolute inset-0 w-6 h-6 text-muted transition-all duration-300 ${mobileMenuOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'
                    }`}
                />
                <X
                  className={`absolute inset-0 w-6 h-6 text-muted transition-all duration-300 ${mobileMenuOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'
                    }`}
                />
              </div>
            </button>
          </div>
        </div>

        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
        >
          <div className="py-4 border-t border-default" style={{ borderColor: 'rgba(var(--color-ink-rgb), 0.1)' }}>
            <nav className="flex flex-col gap-2">
              {navItems.map((item, index) => (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${currentTab === item.id ? 'tone-brand border border-accent' : 'text-muted hover:text-accent hover:bg-surface-2'
                    }`}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-20px)',
                    opacity: mobileMenuOpen ? 1 : 0,
                    transition: `all 0.3s ease ${index * 50}ms`
                  }}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 mt-4 px-4">
                <button
                  onClick={handleLogout}
                  className="py-3 text-center text-muted hover:text-accent font-medium transition-colors border border-default rounded-lg hover:border-strong"
                >
                  Sign Out
                </button>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
