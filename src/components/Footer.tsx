import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Instagram, Youtube, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="about" className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Brand */}
          <div className="text-center md:text-left">
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
              LinguaSpark
            </span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700">
              <Youtube className="w-5 h-5" />
            </a>
            <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © 2025 LinguaSpark. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}