import { Link } from 'react-router-dom';
import { Check, Sparkles, Zap, Crown, ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Pricing() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      icon: Sparkles,
      features: [
        '1 language',
        'Basic lessons',
        '5 AI conversations per day',
        'Community support',
        'Mobile app access'
      ],
      cta: 'Start Free',
      popular: false,
      color: 'gray'
    },
    {
      name: 'Pro',
      price: '$12',
      period: 'per month',
      description: 'For serious learners',
      icon: Zap,
      features: [
        'All Free features',
        'Unlimited languages',
        'Unlimited AI conversations',
        'Advanced games & exercises',
        'Personalized learning path',
        'Progress analytics',
        'Offline mode',
        'Priority support'
      ],
      cta: 'Start Free Trial',
      popular: true,
      color: 'orange'
    },
    {
      name: 'Lifetime',
      price: '$299',
      period: 'one-time payment',
      description: 'Pay once, learn forever',
      icon: Crown,
      features: [
        'All Pro features',
        'Lifetime access',
        'All future features',
        'Early access to new languages',
        'VIP support',
        'Certificate of completion',
        'Exclusive community access'
      ],
      cta: 'Get Lifetime Access',
      popular: false,
      color: 'purple'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 mb-8 shadow-sm">
            <Zap className="w-4 h-4 text-orange-500" />
            <span>Simple, Transparent Pricing</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 text-gray-900 leading-tight tracking-tight">
            Choose Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-pink-600">Learning Journey</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Start free, upgrade anytime. All plans include our core features.
            <span className="text-gray-900 font-medium block mt-2">No hidden fees. Cancel anytime.</span>
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => {
              const Icon = plan.icon;
              return (
                <div
                  key={plan.name}
                    className={`relative bg-white border-2 rounded-2xl p-8 transition-all duration-300 hover:shadow-xl ${
                      plan.popular
                      ? 'border-orange-500 shadow-lg md:scale-105'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  )}
                  
                  <div className="mb-6">
                    <div className={`inline-flex p-3 rounded-lg mb-4 ${
                      plan.color === 'orange' ? 'bg-orange-50 border border-orange-100' :
                      plan.color === 'purple' ? 'bg-purple-50 border border-purple-100' :
                      'bg-gray-50 border border-gray-100'
                    }`}>
                      <Icon className={`w-8 h-8 ${
                        plan.color === 'orange' ? 'text-orange-600' :
                        plan.color === 'purple' ? 'text-purple-600' :
                        'text-gray-600'
                      }`} />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-4">{plan.description}</p>
                    
                    <div className="flex items-baseline gap-2 mb-6">
                      <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600">/ {plan.period}</span>
                    </div>
                  </div>
                  
                  <Link
                    to="/signup"
                    className={`w-full block text-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 mb-6 ${
                      plan.popular
                        ? 'bg-gray-900 text-white hover:bg-gray-800'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                  
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Can I switch plans anytime?
              </h3>
              <p className="text-gray-600">
                Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any differences.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and various local payment methods depending on your region.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Is there a free trial for Pro?
              </h3>
              <p className="text-gray-600">
                Yes! You get a 7-day free trial of Pro. No credit card required. If you love it, you can continue for just $12/month.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                What's your refund policy?
              </h3>
              <p className="text-gray-600">
                We offer a 30-day money-back guarantee on all paid plans. If you're not satisfied, just contact support for a full refund.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of learners achieving fluency faster with AI.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-all duration-200"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
