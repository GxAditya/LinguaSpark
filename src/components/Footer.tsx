import React from 'react';
import { Link } from 'react-router-dom';
import { getStaggerStyle } from '../utils/animationHelpers';

export default function Footer() {
  const brandName = 'LINGUASPARK';

  return (
    <footer id="about" className="py-16 overflow-hidden" style={{ backgroundColor: '#d5d8de' }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Brand Name with entrance animation */}
        <div className="text-center mb-12">
          <div className="text-6xl md:text-8xl font-bold tracking-wider mb-4" style={{ color: 'var(--color-text)' }}>
            {brandName.split('').map((letter, index) => (
              <span
                key={index}
                className="inline-block"
                style={{
                  ...getStaggerStyle(index, 60),
                  animation: 'word-reveal 0.6s var(--ease-expressive) forwards',
                  opacity: 0,
                }}
              >
                {letter}
              </span>
            ))}
          </div>
          <div className="h-1 w-32 mx-auto rounded-full mt-6" style={{ backgroundImage: 'var(--gradient-ember)' }}></div>
        </div>

        {/* Legal Links Only */}
        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-6" style={{ borderColor: 'rgba(var(--color-ink-rgb), 0.15)' }}>
          <p className="text-sm order-2 md:order-1" style={{ color: 'var(--color-text-muted)' }}>
            © {new Date().getFullYear()} LinguaSpark. All rights reserved.
          </p>

          <div className="flex items-center gap-8 text-sm order-1 md:order-2" style={{ color: 'var(--color-text-muted)' }}>
            <Link
              to="/terms"
              className="hover:underline underline-offset-4 transition-colors duration-200"
              style={{ color: 'var(--color-text-muted)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
            >
              Terms of Service
            </Link>
            <Link
              to="/privacy"
              className="hover:underline underline-offset-4 transition-colors duration-200"
              style={{ color: 'var(--color-text-muted)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
            >
              Privacy Policy
            </Link>
          </div>
        </div>

        {/* Subtle tagline */}
        <div className="text-center mt-8">
          <p className="text-sm italic" style={{ color: 'var(--color-text-muted)' }}>
            Powered by AI. Designed for humans.
          </p>
        </div>
      </div>
    </footer>
  );
}