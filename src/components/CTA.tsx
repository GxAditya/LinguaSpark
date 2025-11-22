import React from 'react';
import { ArrowRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CTA() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {/* Background Glow Effects - Same as Hero */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-200 to-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-200 to-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-2000"></div>
      
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Floating Achievement Cards */}
        <div className="absolute -top-20 -left-20 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-xl transform rotate-12 animate-float hidden lg:block">
          <div className="text-2xl font-bold text-orange-600">50K+</div>
          <div className="text-sm text-gray-600">Learners</div>
        </div>
        
        <div className="absolute -top-16 -right-16 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-xl transform -rotate-12 animate-float delay-1000 hidden lg:block">
          <div className="text-2xl font-bold text-pink-600">4.9★</div>
          <div className="text-sm text-gray-600">Rating</div>
        </div>
        
        <div className="absolute -bottom-20 left-10 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-xl transform rotate-6 animate-float delay-2000 hidden lg:block">
          <div className="text-2xl font-bold text-purple-600">15+</div>
          <div className="text-sm text-gray-600">Languages</div>
        </div>
        
        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-gray-700 mb-8 shadow-lg">
          <Zap className="w-4 h-4 text-orange-500" />
          <span>Ready to Level Up?</span>
        </div>
        
        <h2 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-gray-900 via-orange-600 to-pink-600 bg-clip-text text-transparent leading-tight">
          Ready to Become
          <span className="block">Fluent?</span>
        </h2>

        <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
          Join thousands of learners achieving fluency faster with AI.
          <span className="text-orange-600 font-medium">Start your free trial today.</span>
        </p>

        {/* Interactive CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link to="/signup" className="group bg-orange-500 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2 relative overflow-hidden justify-center">
            <span className="absolute inset-0 bg-gradient-to-r from-orange-400 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative z-10">Get Started Free</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
          </Link>

          <button className="text-gray-700 px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/50 backdrop-blur-sm transition-all duration-200 border-2 border-gray-200 hover:border-orange-300">
            View Pricing
          </button>
        </div>
        
        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>No Credit Card Required</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span>7-Day Free Trial</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span>Cancel Anytime</span>
          </div>
        </div>
        
        {/* Testimonial Snippet */}
        <div className="mt-16 bg-white/60 backdrop-blur-sm p-6 rounded-3xl shadow-xl max-w-2xl mx-auto">
          <p className="text-gray-700 italic mb-4">
            "I went from zero Spanish to having actual conversations in 3 months. LinguaSpark doesn't feel like studying — it feels like playing."
          </p>
          <div className="flex items-center justify-center gap-3">
            <img 
              src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop" 
              alt="Sarah Chen"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="text-left">
              <div className="font-semibold text-gray-900">Sarah Chen</div>
              <div className="text-sm text-gray-500">Marketing Manager</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}