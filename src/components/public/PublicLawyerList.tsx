"use client";

import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Lawyer } from '../../types';
import { User } from 'lucide-react';

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
    <section id="lawyers" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Our Legal Experts</h2>
          <p className="mt-4 text-gray-600">
            Browse our network of qualified legal professionals.
          </p>
        </div>

        {loading ? (
           <div className="flex justify-center">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lawyers.slice(0, 6).map((lawyer) => (
              <div key={lawyer.id} className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  {lawyer.image ? (
                    <img 
                      src={lawyer.image} 
                      alt={lawyer.name} 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-blue-600" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{lawyer.name}</h3>
                <p className="text-blue-600 font-medium mb-2">
                  {Array.isArray(lawyer.specialization) 
                    ? lawyer.specialization.join(', ') 
                    : lawyer.specialization}
                </p>
                <div className="mt-4 pt-4 border-t border-gray-100 w-full">
                  <p className="text-sm text-gray-500">
                     Sign in to view full profile and book consultation
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
