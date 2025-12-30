import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';

export default function AboutSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="relative order-2 lg:order-1 animate-slide-up">
             <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                    src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
                    alt="Legal Team Meeting" 
                    className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-8 left-8 text-white">
                    <p className="text-3xl font-bold">15+ Years</p>
                    <p className="text-gray-200">Of Legal Excellence</p>
                </div>
             </div>
             {/* Decorative Element */}
             <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-blue-600 rounded-full blur-2xl opacity-20"></div>
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-600 rounded-full blur-3xl opacity-20"></div>
          </div>

          <div className="order-1 lg:order-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
             <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wide mb-6">
                About Us
             </span>
             <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                Defending Your Rights, <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600">Defining Your Future</span>
             </h2>
             <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                At LegalWise, we believe that everyone deserves access to top-tier legal representation. We bridge the gap between clients and verified legal experts, ensuring transparency, trust, and swift justice.
             </p>
             
             <div className="space-y-4 mb-10">
                {[
                    "Verified Professionals: Strictly vetted lawyers.",
                    "Transparent Pricing: No hidden fees, ever.",
                    "24/7 Support: AI and Human assistance round the clock."
                ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 font-medium">{item}</span>
                    </div>
                ))}
             </div>

             <Link href="/about" className="inline-flex items-center gap-2 text-blue-700 font-bold hover:gap-3 transition-all group">
                Learn More About Us <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
             </Link>
          </div>
          
        </div>
      </div>
    </section>
  );
}
