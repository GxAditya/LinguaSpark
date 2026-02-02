import { useState, useEffect } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Track scroll position for navbar effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Features', href: '#features', isHash: true },
    { name: 'Languages', href: '#languages', isHash: true }
  ];

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[min(94%,980px)]">
      <div className={`${isScrolled ? 'glass-header-solid' : 'glass-header'} rounded-2xl px-4 md:px-6`}> 
        <div className="flex items-center justify-between h-14">
          {/* Logo/Brand - Desktop only */}
          <Link to="/" className="hidden md:block text-xl font-bold hover:text-accent transition-colors duration-300" style={{ color: 'var(--color-primary)' }}>
            LinguaSpark
          </Link>

          {/* Centered Navigation */}
          <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navItems.map((item, index) => (
              item.isHash ? (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.querySelector(item.href);
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="relative px-4 py-2 text-muted hover:text-accent font-medium transition-all duration-300 group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {item.name}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 underline-accent group-hover:w-3/4 transition-all duration-300 rounded-full"></span>
                </a>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  className="relative px-4 py-2 text-muted hover:text-accent font-medium transition-all duration-300 group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {item.name}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 underline-accent group-hover:w-3/4 transition-all duration-300 rounded-full"></span>
                </Link>
              )
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/signin"
              className="relative px-3 py-2 text-muted hover:text-accent font-medium transition-all duration-300 group"
            >
              Sign In
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 underline-accent group-hover:w-full transition-all duration-300 rounded-full"></span>
            </Link>
            <Link
              to="/signup"
              className="relative btn-primary px-4 py-2.5 rounded-lg overflow-hidden group"
            >
              <span className="absolute inset-0" style={{ backgroundImage: 'var(--gradient-sheen)' }}></span>
              <span className="relative flex items-center gap-2">
                Get Started Free
                <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
              </span>
            </Link>
          </div>

          {/* Mobile Logo */}
          <Link to="/" className="md:hidden text-lg font-bold" style={{ color: 'var(--color-primary)' }}>
            LinguaSpark
          </Link>

          <button
            className="md:hidden relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-2 transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-6">
              <Menu
                className={`absolute inset-0 w-6 h-6 text-muted transition-all duration-300 ${isMenuOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'
                  }`}
              />
              <X
                className={`absolute inset-0 w-6 h-6 text-muted transition-all duration-300 ${isMenuOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'
                  }`}
              />
            </div>
          </button>
        </div>

        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
        >
          <div className="py-4 border-t border-default" style={{ borderColor: 'rgba(var(--color-ink-rgb), 0.1)' }}>
            <nav className="flex flex-col gap-2">
              {navItems.map((item, index) => (
                item.isHash ? (
                  <a
                    key={item.name}
                    href={item.href}
                    className="px-4 py-3 text-muted hover:text-accent hover:bg-surface-2 rounded-lg font-medium transition-all duration-200"
                    style={{
                      animationDelay: `${index * 50}ms`,
                      transform: isMenuOpen ? 'translateX(0)' : 'translateX(-20px)',
                      opacity: isMenuOpen ? 1 : 0,
                      transition: `all 0.3s ease ${index * 50}ms`
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.querySelector(item.href);
                      element?.scrollIntoView({ behavior: 'smooth' });
                      setIsMenuOpen(false);
                    }}
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="px-4 py-3 text-muted hover:text-accent hover:bg-surface-2 rounded-lg font-medium transition-all duration-200"
                    style={{
                      animationDelay: `${index * 50}ms`,
                      transform: isMenuOpen ? 'translateX(0)' : 'translateX(-20px)',
                      opacity: isMenuOpen ? 1 : 0,
                      transition: `all 0.3s ease ${index * 50}ms`
                    }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              ))}
              <div className="flex flex-col gap-2 mt-4 px-4">
                <Link
                  to="/signin"
                  className="py-3 text-center text-muted hover:text-accent font-medium transition-colors border border-default rounded-lg hover:border-strong"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="relative btn-primary py-3 rounded-lg font-semibold text-center overflow-hidden group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="absolute inset-0" style={{ backgroundImage: 'var(--gradient-sheen)' }}></span>
                  <span className="relative flex items-center justify-center gap-2">
                    Get Started Free
                    <Sparkles className="w-4 h-4" />
                  </span>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}