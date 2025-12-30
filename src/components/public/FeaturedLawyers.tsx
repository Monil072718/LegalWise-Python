"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '../../services/api';
import { Lawyer } from '../../types';
import { Star, Shield, ArrowRight } from 'lucide-react';

export default function FeaturedLawyers() {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you'd might have a dedicated endpoint for 'featured'
    // simulating by taking first 3
    api.getLawyers().then(data => {
        setLawyers(data.slice(0, 3));
        setLoading(false);
    }).catch(err => setLoading(false));
  }, []);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 animate-slide-up">
            <div className="max-w-2xl">
                <span className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-bold uppercase tracking-wide mb-4">
                    Top Rated
                </span>
                <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Meet Our Legal Experts</h2>
                <p className="text-xl text-gray-500">
                    Handpicked professionals with a proven track record of success.
                </p>
            </div>
            <Link href="/find-lawyer" className="inline-flex items-center gap-2 px-6 py-3 bg-gray-50 text-gray-900 font-bold rounded-full hover:bg-gray-100 transition-colors">
                View All Lawyers <ArrowRight className="w-4 h-4" />
            </Link>
        </div>

        {loading ? (
             <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
             </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {lawyers.map((lawyer, idx) => (
                    <div 
                        key={lawyer.id} 
                        className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 animate-slide-up"
                        style={{ animationDelay: `${idx * 0.15}s` }}
                    >
                        <div className="h-80 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                            <img 
                                src={lawyer.image || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80"} 
                                alt={lawyer.name} 
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute top-4 right-4 z-20 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/20 flex items-center gap-1">
                                <Shield className="w-3 h-3 text-white fill-white" /> Verified
                            </div>
                            
                            <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                <p className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">{lawyer.specialization}</p>
                                <h3 className="text-2xl font-bold mb-1">{lawyer.name}</h3>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex text-amber-400">
                                        {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                                    </div>
                                    <span className="text-sm text-gray-300">(5.0)</span>
                                </div>
                                
                                <Link 
                                    href="/find-lawyer" 
                                    className="inline-flex items-center gap-2 text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0 delay-100"
                                >
                                    Book Consultation <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </section>
  );
}
