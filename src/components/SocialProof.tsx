import React from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Marketing Manager",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    content: "Finally, a language app that doesn't make me want to quit after day 3. The AI conversations are genuinely helpful!",
    progress: "Fluent in Spanish in 6 months",
    rating: 5
  },
  {
    name: "Marcus Thompson",
    role: "Software Developer",
    avatar: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    content: "The song vocab feature is genius. I'm learning French through my favorite indie tracks. Who knew?",
    progress: "2,500+ words mastered",
    rating: 5
  },
  {
    name: "Elena Rodriguez",
    role: "Teacher",
    avatar: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    content: "My students are obsessed with LinguaSpark. It's like gaming meets education — they actually ASK for homework!",
    progress: "Teaching 30+ students",
    rating: 5
  }
];

const stats = [
  { number: "50K+", label: "Happy Learners" },
  { number: "2.5M+", label: "Words Mastered" },
  { number: "15+", label: "Languages" },
  { number: "4.9★", label: "App Store Rating" }
];

export default function SocialProof() {
  return (
    <section className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 tracking-tight">
            Real Learners, Real Results
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it — here's what happens when learning gets cheeky.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <Quote className="w-8 h-8 text-orange-400 mb-4 opacity-50" />

              <blockquote className="text-gray-700 mb-6 text-lg leading-relaxed">
                "{testimonial.content}"
              </blockquote>

              <div className="flex items-center gap-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>

              <div className="mt-4 bg-orange-50 border border-orange-100 px-4 py-2 rounded-lg text-sm font-medium text-orange-700">
                🎉 {testimonial.progress}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}