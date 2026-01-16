"use client";

import { Check } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "0",
      description: "For exploring the platform",
      features: [
        "Browse Law Articles",
        "View Lawyer Profiles",
        "Access Free Resources",
        "No Dashboard Access",
        "No Consultations"
      ],
      cta: "Current Plan",
      current: true
    },
    {
      name: "Standard",
      price: "49",
      description: "Perfect for legal assistance",
      features: [
        "Everything in Free",
        "Full Dashboard Access",
        "3 Consultations / Month",
        "Document Templates",
        "Priority Support"
      ],
      cta: "Upgrade Now",
      current: false,
      popular: true
    },
    {
      name: "Premium",
      price: "99",
      description: "Complete legal coverage",
      features: [
        "Unlimited Consultations",
        "Dedicated Case Manager",
        "All Document Templates",
        "24/7 Legal Hotline",
        "Contract Review"
      ],
      cta: "Go Premium",
      current: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Choose the plan that best fits your legal needs
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`relative bg-white rounded-2xl shadow-lg flex flex-col ${plan.popular ? 'border-2 border-blue-500 transform scale-105 z-10' : 'border border-gray-200'}`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 -mt-4 mr-4 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Most Popular
                </div>
              )}
              <div className="p-8 flex-1">
                <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                <p className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-gray-900">${plan.price}</span>
                  <span className="ml-1 text-xl font-medium text-gray-500">/mo</span>
                </p>
                <p className="mt-4 text-gray-500">{plan.description}</p>

                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                      <p className="ml-3 text-base text-gray-500">{feature}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-8 bg-gray-50 rounded-b-2xl">
                <button
                  className={`w-full py-3 px-6 rounded-lg text-center font-semibold transition-colors ${
                    plan.current 
                      ? 'bg-gray-200 text-gray-800 cursor-default'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                  onClick={() => {
                      if (!plan.current) {
                          alert("Payment integration coming soon! This is a demo.");
                      }
                  }}
                >
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
             <Link href="/" className="text-base font-medium text-blue-600 hover:text-blue-500">
                Back to Home
              </Link>
        </div>
      </div>
    </div>
  );
}
