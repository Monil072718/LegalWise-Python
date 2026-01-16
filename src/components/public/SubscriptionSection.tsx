"use client";

import Link from 'next/link';
import { Check, Star } from 'lucide-react';
import ScrollAnimation from '../ui/ScrollAnimation';

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    desc: "Essential tools to explore the platform.",
    features: [
      "Browse Law Articles",
      "View Lawyer Profiles",
      "Access Free Resources",
      "Community Support"
    ],
    cta: "Get Started",
    popular: false,
    headerColor: "text-gray-900",
    buttonStyle: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
  },
  {
    name: "Standard",
    price: "$49",
    period: "/mo",
    desc: "Perfect for individuals requiring legal assistance.",
    features: [
      "Everything in Free",
      "Full Dashboard Access",
      "3 Consultations / Month",
      "Premium Document Templates",
      "Priority Email Support"
    ],
    cta: "Upgrade Now",
    popular: true,
    promo: "Most Popular",
    headerColor: "text-blue-600",
    buttonStyle: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/30 border border-transparent"
  },
  {
    name: "Premium",
    price: "$99",
    period: "/mo",
    desc: "Comprehensive coverage for complete peace of mind.",
    features: [
      "Unlimited Consultations",
      "Dedicated Case Manager",
      "All Templates & Contracts",
      "24/7 Legal Hotline",
      "Contract Review & Analysis"
    ],
    cta: "Go Premium",
    popular: false,
    headerColor: "text-gray-900",
    buttonStyle: "bg-gray-900 text-white hover:bg-gray-800 shadow-lg shadow-gray-900/20 border border-transparent"
  }
];

export default function SubscriptionSection() {
  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-50 mix-blend-multiply filter"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-100 rounded-full blur-3xl opacity-50 mix-blend-multiply filter"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <ScrollAnimation direction="up" className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">Pricing Plans</h2>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-500 leading-relaxed">
            Choose the plan that fits your legal needs. No hidden fees. Cancel anytime.
          </p>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 items-center">
          {plans.map((plan, idx) => (
            <ScrollAnimation 
                key={idx} 
                delay={idx * 0.1}
                className={`relative flex flex-col p-8 rounded-3xl transition-all duration-300 ${
                    plan.popular
                        ? 'bg-white shadow-2xl ring-4 ring-blue-50/50 scale-105 z-10' 
                        : 'bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl hover:-translate-y-1 hover:bg-white border border-gray-100'
                }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                        <Star className="w-3 h-3 fill-current" />
                        {plan.promo}
                    </span>
                </div>
              )}

              <div className="mb-8">
                <h3 className={`text-xl font-bold mb-2 ${plan.headerColor}`}>{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-5xl font-extrabold text-gray-900 tracking-tight">{plan.price}</span>
                    <span className="text-gray-500 font-medium">{plan.period}</span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                    {plan.desc}
                </p>
              </div>

              <div className="space-y-5 mb-10 flex-1">
                {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                        <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${plan.popular ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                            <Check className="w-3 h-3" strokeWidth={3} />
                        </div>
                        <span className="text-sm text-gray-700 font-medium">
                            {feature}
                        </span>
                    </div>
                ))}
              </div>

              <Link 
                href="/user/register" 
                className={`w-full py-4 rounded-xl font-bold text-center transition-all duration-200 transform active:scale-95 ${plan.buttonStyle}`}
              >
                {plan.cta}
              </Link>

            </ScrollAnimation>
          ))}
        </div>        
      </div>
    </section>
  );
}
