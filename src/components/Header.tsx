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
    <header
      className={`relative w-full transition-all duration-500 ${isScrolled
        ? 'bg-white/70 backdrop-blur-xl border-b border-gray-200/50 shadow-lg shadow-black/5'
        : 'bg-white/50 backdrop-blur-md border-b border-white/20'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Animated Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
          >
            <div className="relative">
              <img
                src="/Linguaspark-logo.png"
                alt="LinguaSpark Logo"
                className={`w-16 h-32 object-contain transition-all duration-300 ${isScrolled ? 'rotate-0' : 'rotate-12'
                  } group-hover:scale-110`}
              />
              <div className="absolute inset-0 bg-orange-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent group-hover:from-orange-500 group-hover:via-pink-500 group-hover:to-purple-500 transition-all duration-300">
              LinguaSpark
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
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
                  className="relative px-4 py-2 text-gray-700 hover:text-orange-600 font-medium transition-all duration-300 group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {item.name}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-pink-500 group-hover:w-3/4 transition-all duration-300 rounded-full"></span>
                </a>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  className="relative px-4 py-2 text-gray-700 hover:text-orange-600 font-medium transition-all duration-300 group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {item.name}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-pink-500 group-hover:w-3/4 transition-all duration-300 rounded-full"></span>
                </Link>
              )
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/signin"
              className="relative px-4 py-2 text-gray-700 hover:text-orange-600 font-medium transition-all duration-300 group"
            >
              Sign In
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-pink-500 group-hover:w-full transition-all duration-300 rounded-full"></span>
            </Link>
            <Link
              to="/signup"
              className="relative bg-gradient-to-r from-orange-600 to-pink-600 text-white px-6 py-3 rounded-full font-semibold overflow-hidden group transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/30 hover:scale-105"
            >
              {/* Shimmer effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              <span className="relative flex items-center gap-2">
                Get Started Free
                <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
              </span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-6">
              <Menu
                className={`absolute inset-0 w-6 h-6 text-gray-700 transition-all duration-300 ${isMenuOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'
                  }`}
              />
              <X
                className={`absolute inset-0 w-6 h-6 text-gray-700 transition-all duration-300 ${isMenuOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'
                  }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
        >
          <div className="py-6 border-t border-gray-200/50">
            <nav className="flex flex-col gap-2">
              {navItems.map((item, index) => (
                item.isHash ? (
                  <a
                    key={item.name}
                    href={item.href}
                    className="px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg font-medium transition-all duration-200"
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
                    className="px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg font-medium transition-all duration-200"
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
                  className="py-3 text-center text-gray-700 hover:text-orange-600 font-medium transition-colors border border-gray-200 rounded-lg hover:border-orange-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="relative bg-gradient-to-r from-orange-600 to-pink-600 text-white py-3 rounded-lg font-semibold text-center overflow-hidden group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-active:translate-x-full transition-transform duration-700"></span>
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