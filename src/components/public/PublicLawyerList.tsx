"use client";

import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Lawyer } from '../../types';
import { User, Shield, Star, MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PublicLawyerList() {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLawyers();
  }, []);

  const fetchLawyers = async () => {
    try {
      const data = await api.getLawyers();
      setLawyers(data);
    } catch (error) {
      console.error('Failed to fetch lawyers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-20 relative z-20">
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="flex flex-col items-center gap-4">
             <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
             <p className="text-gray-500 font-medium">Loading professionals...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lawyers.map((lawyer) => (
            <div 
                key={lawyer.id} 
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100"
            >
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors"></div>
                {lawyer.imageUrl ? (
                  <img src={lawyer.imageUrl} alt={lawyer.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <User className="w-20 h-20" />
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-blue-700 shadow-sm flex items-center gap-1">
                    <Shield className="w-3 h-3 fill-blue-700" /> Verified
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{lawyer.name}</h3>
                        <p className="text-blue-600 font-medium text-sm">{lawyer.specialization}</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
                    <MapPin className="w-4 h-4" />
                    <span>New York, USA</span> {/* Placeholder for location if not in model */}
                </div>

                <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="font-bold text-gray-900">4.9</span>
                        <span className="text-gray-400 text-xs">(120 reviews)</span>
                    </div>
                    <Link href="/user/login" className="flex items-center gap-2 text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        View Profile <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
