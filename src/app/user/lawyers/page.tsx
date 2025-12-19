"use client";

import { useState, useEffect } from 'react';
import { Search, MapPin, Star, Briefcase, Filter, ArrowRight } from 'lucide-react';
import { api } from '../../../services/api';
import { Category, Lawyer } from '../../../types';
import Link from 'next/link';

export default function LawyerSearch() {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [lawyersData, categoriesData] = await Promise.all([
                api.getLawyers(),
                api.getCategories()
            ]);
            setLawyers(lawyersData);
            setCategories(categoriesData);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, []);

  const filteredLawyers = lawyers.filter(lawyer => {
      const matchesSearch = lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            lawyer.specialization.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || lawyer.specialization.includes(selectedCategory);
      return matchesSearch && matchesCategory; // && lawyer.status === 'active' (Uncomment in prod)
  });

  if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Find a Lawyer</h1>
            <p className="text-gray-500">Connect with top legal experts for your needs</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                 type="text" 
                 placeholder="Search by name or expertise..." 
                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
              />
          </div>
          <div className="w-full md:w-64">
              <select 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
              </select>
          </div>
      </div>

      {/* Lawyer List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLawyers.map(lawyer => (
              <Link key={lawyer.id} href={`/user/lawyers/${lawyer.id}`} className="block">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col h-full cursor-pointer group">
                  <div className="p-6 flex-1">
                      <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                                  {/* Replace with actual image if available */}
                                  <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                                      {lawyer.name.charAt(0)}
                                  </div>
                              </div>
                              <div>
                                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{lawyer.name}</h3>
                                  <div className="flex items-center text-sm text-yellow-500">
                                      <Star className="w-4 h-4 fill-current mr-1" />
                                      <span>{lawyer.rating}</span>
                                      <span className="text-gray-400 ml-1">({lawyer.casesHandled} cases)</span>
                                  </div>
                              </div>
                          </div>
                          {lawyer.verified && (
                              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">Verified</span>
                          )}
                      </div>

                      <div className="space-y-3">
                          <div className="flex items-start space-x-2 text-sm text-gray-600">
                              <Briefcase className="w-4 h-4 mt-0.5 text-gray-400" />
                              <div className="flex flex-wrap gap-1">
                                  {lawyer.specialization.map((spec, i) => (
                                      <span key={i} className="bg-gray-100 px-2 py-0.5 rounded text-xs">{spec}</span>
                                  ))}
                              </div>
                          </div>
                           <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span>{lawyer.address || 'Location N/A'}</span>
                          </div>
                      </div>
                      
                      <p className="mt-4 text-sm text-gray-500 line-clamp-2">
                          {lawyer.bio || 'Experienced lawyer specialized in multiple fields.'}
                      </p>
                  </div>

                  <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                          {lawyer.availability === 'online' ? (
                              <span className="text-green-600 flex items-center"><span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>Available</span>
                          ) : (
                              <span className="text-gray-500">Offline</span>
                          )}
                      </span>
                      <span className="text-blue-600 font-medium text-sm hover:text-blue-800 flex items-center">
                          View Profile <ArrowRight className="w-4 h-4 ml-1" />
                      </span>
                  </div>
              </div>
            </Link>
          ))}

          {filteredLawyers.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500">
                  <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">No lawyers found matching your criteria.</p>
                  <p className="text-sm">Try adjusting your filters or search term.</p>
              </div>
          )}
      </div>
    </div>
  );
}
