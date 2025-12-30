import { Search, MessageSquare, CheckCircle } from 'lucide-react';

const steps = [
    {
        icon: Search,
        title: "1. Find a Lawyer",
        desc: "Browse our extensive directory of verified legal experts. Filter by specialization, location, and rating to find your perfect match."
    },
    {
        icon: MessageSquare,
        title: "2. Connect & Consult",
        desc: "Schedule a consultation directly through our platform. Discuss your case securely via our built-in chat or video call features."
    },
    {
        icon: CheckCircle,
        title: "3. Solve Your Problem",
        desc: "Receive expert legal documents, advice, and representation. Manage your case milestones and payments all in one place."
    }
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 animate-slide-up">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wide mb-4">
                The Process
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">How LegalWise Works</h2>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-blue-200 via-indigo-200 to-blue-200 z-0"></div>

            {steps.map((step, idx) => (
                <div key={idx} className="relative z-10 flex flex-col items-center text-center animate-slide-up" style={{ animationDelay: `${idx * 0.2}s` }}>
                    <div className="w-24 h-24 bg-white rounded-full border-4 border-blue-50 flex items-center justify-center mb-8 shadow-lg shadow-blue-100 group hover:scale-110 transition-transform duration-300">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white">
                            <step.icon className="w-8 h-8" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                    <p className="text-gray-500 leading-relaxed max-w-sm">
                        {step.desc}
                    </p>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
}
