"use client";

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import ScrollAnimation from '../ui/ScrollAnimation';

const faqs = [
    {
        question: "Is LegalWise free to use?",
        answer: "Yes, browsing our lawyer directory, reading articles, and using the basic AI assistant is completely free. You only pay when you book a consultation or purchase premium resources."
    },
    {
        question: "How do you verify your lawyers?",
        answer: "Every lawyer on LegalWise undergoes a rigorous verification process. We check their bar association credentials, practice history, and client reviews to ensure they are legitimate and high-quality."
    },
    {
        question: "Can I get a refund if I'm not satisfied?",
        answer: "We have a dispute resolution process in place. If a service was not delivered as promised, you can request a refund review within 48 hours of the appointment."
    },
    {
        question: "Is my consultation confidential?",
        answer: "Absolutely. All communications between you and your lawyer are encrypted and protected by attorney-client privilege standards."
    }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation direction="up" className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-500">
                Common questions about our services and process.
            </p>
        </ScrollAnimation>

        <div className="space-y-4">
            {faqs.map((faq, idx) => (
                <ScrollAnimation 
                    key={idx} 
                    delay={idx * 0.1}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md"
                >
                    <button 
                        onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                        className="w-full px-8 py-6 flex items-center justify-between text-left focus:outline-none"
                    >
                        <span className="text-lg font-bold text-gray-900">{faq.question}</span>
                        {openIndex === idx ? (
                            <ChevronUp className="w-5 h-5 text-blue-600" />
                        ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                    </button>
                    <div 
                        className={`transition-all duration-300 ease-in-out overflow-hidden ${
                            openIndex === idx ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                    >
                        <div className="px-8 pb-8 text-gray-600 leading-relaxed">
                            {faq.answer}
                        </div>
                    </div>
                </ScrollAnimation>
            ))}
        </div>
      </div>
    </section>
  );
}
