"use client";

import { Check, Star, Zap, Shield } from 'lucide-react';
import ScrollAnimation from '../ui/ScrollAnimation';

const plans = [
  {
    name: "Basic",
    price: "Free",
    desc: "Essential access to legal resources and basic directory features.",
    features: [
      "Access to Lawyer Directory",
      "Read Public Articles",
      "Basic AI Chat Assistance",
      "Community Forum Access"
    ],
    cta: "Select Basic",
    popular: false,
    icon: Shield
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    desc: "For individuals needing direct legal advice and document tools.",
    features: [
      "Everything in Basic",
      "Priority Lawyer Matching",
      "5 AI Contract Reviews/mo",
      "24/7 Priority Support",
      "Ad-free Experience"
    ],
    cta: "Select Pro",
    popular: true,
    icon: Zap
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "Tailored solutions for businesses and large legal teams.",
    features: [
      "Dedicated Case Manager",
      "Unlimited AI Analysis",
      "API Access",
      "Custom SLA & Support",
      "Team Management Dashboard"
    ],
    cta: "Contact Sales",
    popular: false,
    icon: Star
  }
];

export default function RegistrationPricing() {
  const scrollToForm = () => {
    // Simple scroll to the bottom where the form likely is, or we can use an ID
    const formElement = document.getElementById('registration-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    } else {
       // Fallback
       window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 bg-gray-50 relative overflow-hidden">
        {/* Background Gradients - Adjusted for gray background reuse */}
        {/* <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div> */}
        
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollAnimation direction="up" className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wide mb-4">
            Pricing Plans
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Select a Plan to Get Started</h2>
          <p className="text-lg text-gray-500">
            Transparent pricing with no hidden fees.
          </p>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {plans.map((plan, idx) => (
            <ScrollAnimation 
                key={idx} 
                delay={idx * 0.15}
                className={`relative flex flex-col p-8 rounded-3xl transition-transform duration-300 ${
                    plan.popular 
                        ? 'bg-gray-900 text-white shadow-2xl scale-105 border border-gray-800 z-10' 
                        : 'bg-white text-gray-900 shadow-xl border border-gray-100'
                }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3">
                    <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold uppercase px-4 py-1.5 rounded-full shadow-lg">
                        Most Popular
                    </div>
                </div>
              )}

              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${
                plan.popular ? 'bg-white/10 text-amber-400' : 'bg-blue-50 text-blue-600'
              }`}>
                <plan.icon className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <p className={`text-sm mb-6 ${plan.popular ? 'text-gray-400' : 'text-gray-500'}`}>
                {plan.desc}
              </p>

              <div className="flex items-end gap-1 mb-8">
                <span className="text-4xl font-extrabold">{plan.price}</span>
                {plan.period && (
                    <span className={`text-sm mb-1 ${plan.popular ? 'text-gray-400' : 'text-gray-500'}`}>{plan.period}</span>
                )}
              </div>

              <div className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                        <Check className={`w-5 h-5 flex-shrink-0 ${plan.popular ? 'text-green-400' : 'text-blue-600'}`} />
                        <span className={`text-sm ${plan.popular ? 'text-gray-300' : 'text-gray-600'}`}>
                            {feature}
                        </span>
                    </div>
                ))}
              </div>

              <button 
                onClick={scrollToForm}
                className={`w-full py-3.5 rounded-xl font-bold text-center transition-all duration-300 ${
                    plan.popular 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30' 
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-900 border border-gray-200'
                }`}
              >
                {plan.cta}
              </button>

            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
}
