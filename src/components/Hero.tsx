import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f5f5f5_1px,transparent_1px),linear-gradient(to_bottom,#f5f5f5_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 mb-8 shadow-sm">
          <span>AI-Powered Language Learning</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-gray-900 leading-tight tracking-tight">
          Master Any Language
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-pink-600">Faster Than Ever</span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
          AI-powered conversations, personalized lessons, and real-world practice.
          <span className="text-gray-900 font-medium block mt-2">Go from zero to fluent in record time.</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/signup" className="group bg-gray-900 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-all duration-200 flex items-center gap-2 justify-center">
            Start Learning Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <button className="text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200 bg-white">
            Watch Demo
          </button>
        </div>

        <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500 font-medium">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-sm"></div>
            <span>50k+ Happy Learners</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-sm"></div>
            <span>15+ Languages</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-sm"></div>
            <span>AI-Powered Everything</span>
          </div>
        </div>
      </div>
    </section>
  );
}