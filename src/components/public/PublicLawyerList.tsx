"use client";

import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Lawyer } from '../../types';
import { getImageUrl } from '../../utils/image';
import { User, Shield, Star, MapPin, ArrowRight, Search } from 'lucide-react';
import Link from 'next/link';

export default function PublicLawyerList() {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

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

  const filteredLawyers = lawyers.filter(lawyer => {
    const matchesSearch = (lawyer.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                          (lawyer.specialization?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) || false) ||
                          (lawyer.bio?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || 
                            (selectedCategory === 'Corporate' && lawyer.specialization?.some(s => s.includes('Corporate'))) ||
                            (selectedCategory === 'Criminal' && lawyer.specialization?.some(s => s.includes('Criminal'))) ||
                            (selectedCategory === 'Family Law' && lawyer.specialization?.some(s => s.includes('Family')));

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-20 relative z-20">
      
      {/* Search and Filters Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-12">
        <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, specialization, or keyword..." 
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none font-medium text-gray-900" 
                />
            </div>
            <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                {['All', 'Corporate', 'Criminal', 'Family Law'].map((category) => (
                    <button 
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-6 py-3.5 font-bold rounded-xl shadow-sm transition-all whitespace-nowrap ${
                            selectedCategory === category 
                            ? 'bg-gray-900 text-white hover:bg-black shadow-lg' 
                            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                        }`}
                    >
                        {category === 'All' ? 'All Lawyers' : category}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="flex flex-col items-center gap-4">
             <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
             <p className="text-gray-500 font-medium">Loading professionals...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredLawyers.length > 0 ? (
            filteredLawyers.map((lawyer) => (
            <div 
                key={lawyer.id} 
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 flex flex-col h-full"
            >
              <div className="relative h-64 bg-gray-100 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity"></div>


                {lawyer.image ? (
                  <img src={getImageUrl(lawyer.image)} alt={lawyer.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                    <User className="w-24 h-24 opacity-20" />
                  </div>
                )}
                <div className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-blue-700 shadow-sm flex items-center gap-1.5 border border-blue-50">
                    <Shield className="w-3.5 h-3.5 fill-blue-600" /> Verified Escrow
                </div>
                <div className="absolute bottom-4 left-4 z-20 text-white">
                    <p className="text-blue-200 font-medium text-sm mb-1">{lawyer.specialization}</p>
                    <h3 className="text-2xl font-bold leading-tight">{lawyer.name}</h3>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                    <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="font-bold text-gray-900">4.9</span>
                        <span className="text-gray-400">(120)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>New York, NY</span>
                    </div>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-3">
                    <Link href={`/lawyers/${lawyer.id}`} className="flex items-center justify-center py-3 rounded-xl font-bold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors">
                        View Profile
                    </Link>
                    <Link href="/user/login" className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all">
                        Book Now <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
              </div>
            </div>
          ))
          ) : (
            <div className="col-span-full py-20 text-center">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No lawyers found</h3>
                <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
                <button 
                    onClick={() => {setSearchTerm(''); setSelectedCategory('All');}}
                    className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                    Clear Filters
                </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
