import React from 'react';
import { ArrowRight, Shield, Clock, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function CTA() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.3 });

  return (
    <section
      id="pricing"
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 border-t border-gray-100"
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-300 rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Badge */}
        <div
          className={`inline-flex items-center gap-2 bg-white border border-blue-200 px-5 py-2.5 rounded-full text-sm font-medium text-blue-700 mb-8 shadow-sm transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
        >
          <Shield className="w-4 h-4" />
          <span>Start Your Journey Today</span>
        </div>

        {/* Main Headline */}
        <h2
          className={`text-5xl md:text-7xl font-extrabold mb-6 text-gray-900 leading-tight tracking-tight transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
        >
          Ready to Become
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600">
            Fluent?
          </span>
        </h2>

        {/* Subheadline */}
        <p
          className={`text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
        >
          Experience the future of language learning with AI.
          <span className="text-gray-900 font-medium block mt-2">
            Start your free trial today—no credit card required.
          </span>
        </p>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
        >
          <Link
            to="/signup"
            className="group bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-10 py-5 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 flex items-center gap-3 relative overflow-hidden justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            <span className="relative z-10">Get Started Free</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />

            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 group-hover:translate-x-full transition-all duration-1000"></div>
          </Link>

          <Link
            to="/pricing"
            className="text-gray-700 px-10 py-5 rounded-xl font-semibold text-lg border-2 border-gray-300 hover:border-gray-400 hover:bg-white transition-all duration-200 bg-white/80 backdrop-blur-sm hover:scale-105 active:scale-95 shadow-sm"
          >
            View Pricing
          </Link>
        </div>

        {/* Trust Indicators - No fake statistics */}
        <div
          className={`flex flex-wrap justify-center items-center gap-8 text-base text-gray-600 font-medium transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
        >
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-5 py-3 rounded-xl border border-gray-200 shadow-sm">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <XCircle className="w-5 h-5 text-green-600" />
            </div>
            <span className="font-semibold text-gray-700">No Credit Card Required</span>
          </div>

          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-5 py-3 rounded-xl border border-gray-200 shadow-sm">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <span className="font-semibold text-gray-700">7-Day Free Trial</span>
          </div>

          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-5 py-3 rounded-xl border border-gray-200 shadow-sm">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <span className="font-semibold text-gray-700">Cancel Anytime</span>
          </div>
        </div>

        {/* Subtle gradient animation */}
        <div
          className={`mt-16 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <div className="h-1 w-64 mx-auto bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 rounded-full animate-gradient-x"></div>
        </div>
      </div>
    </section>
  );
}