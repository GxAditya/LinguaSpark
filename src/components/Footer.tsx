import React from 'react';
import { Link } from 'react-router-dom';
import { getStaggerStyle } from '../utils/animationHelpers';

export default function Footer() {
  const brandName = 'LINGUASPARK';

  return (
    <footer id="about" className="bg-gray-900 text-white py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Brand Name with entrance animation */}
        <div className="text-center mb-12">
          <div className="text-6xl md:text-8xl font-bold tracking-wider mb-4">
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
          <div className="h-1 w-32 mx-auto bg-gradient-to-r from-orange-500 to-pink-500 rounded-full mt-6"></div>
        </div>

        {/* Legal Links Only */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-400 text-sm order-2 md:order-1">
            © {new Date().getFullYear()} LinguaSpark. All rights reserved.
          </p>

          <div className="flex items-center gap-8 text-sm text-gray-400 order-1 md:order-2">
            <Link
              to="/terms"
              className="hover:text-white transition-colors duration-200 hover:underline underline-offset-4"
            >
              Terms of Service
            </Link>
            <Link
              to="/privacy"
              className="hover:text-white transition-colors duration-200 hover:underline underline-offset-4"
            >
              Privacy Policy
            </Link>
          </div>
        </div>

        {/* Subtle tagline */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm italic">
            Powered by AI. Designed for humans.
          </p>
        </div>
      </div>
    </footer>
  );
}