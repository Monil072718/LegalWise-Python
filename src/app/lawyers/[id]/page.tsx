"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '../../../services/api';
import { Lawyer } from '../../../types';
import PublicHeader from '../../../components/public/PublicHeader';
import PublicFooter from '../../../components/public/PublicFooter';
import { User, Shield, Star, MapPin, CheckCircle, Clock, Building, Briefcase, GraduationCap, Award, Phone, Mail } from 'lucide-react';
import Link from 'next/link';

export default function PublicLawyerProfile() {
  const params = useParams();
  const [lawyer, setLawyer] = useState<Lawyer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
        fetchLawyer(params.id as string);
    }
  }, [params.id]);

  const fetchLawyer = async (id: string) => {
      try {
          const data = await api.getLawyer(id);
          setLawyer(data);
      } catch (error) {
          console.error("Failed to fetch lawyer", error);
      } finally {
          setLoading(false);
      }
  };

  if (loading) {
      return (
        <div className="min-h-screen bg-white">
            <PublicHeader />
            <div className="flex justify-center items-center h-screen pt-20">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        </div>
      );
  }

  if (!lawyer) {
      return (
        <div className="min-h-screen bg-white">
            <PublicHeader />
            <div className="flex flex-col justify-center items-center h-screen pt-20 text-center px-4">
                <User className="w-20 h-20 text-gray-300 mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Lawyer Not Found</h1>
                <p className="text-gray-500 mb-6">The professional you are looking for does not exist or has been removed.</p>
                <Link href="/find-lawyer" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition">
                    Browse All Lawyers
                </Link>
            </div>
            <PublicFooter />
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <PublicHeader />
      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header / Cover */}
            <div className="relative rounded-3xl overflow-hidden bg-white shadow-xl mb-8">
                <div className="h-64 bg-gradient-to-r from-gray-900 to-blue-900 relative">
                    <div className="absolute inset-0 bg-black/20"></div>
                </div>
                
                <div className="px-8 pb-8 flex flex-col md:flex-row items-end gap-8 -mt-20 relative z-10">
                    <div className="w-40 h-40 rounded-2xl bg-white p-1 shadow-lg flex-shrink-0">
                        {lawyer.image ? (
                            <img src={lawyer.image} alt={lawyer.name} className="w-full h-full object-cover rounded-xl" />
                        ) : (
                            <div className="w-full h-full bg-gray-100 rounded-xl flex items-center justify-center">
                                <User className="w-16 h-16 text-gray-300" />
                            </div>
                        )}
                    </div>
                    
                    <div className="flex-1 text-white md:mb-4">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl md:text-4xl font-bold">{lawyer.name}</h1>
                            <span className="bg-blue-500/20 backdrop-blur-md border border-blue-400/30 text-blue-100 py-1 px-3 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                <Shield className="w-3 h-3" /> Verified Partner
                            </span>
                        </div>
                        <p className="text-blue-100 text-lg flex items-center gap-2">
                             {lawyer.specialization && lawyer.specialization.join(', ')} Specialist
                        </p>
                    </div>

                    <div className="flex gap-3 mb-4 md:mb-6">
                         <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-white text-center">
                             <div className="text-xs text-blue-200 uppercase font-bold tracking-wider">Experience</div>
                             <div className="font-bold text-xl">{lawyer.experience}+ Years</div>
                         </div>
                         <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-white text-center">
                             <div className="text-xs text-blue-200 uppercase font-bold tracking-wider">Rating</div>
                             <div className="font-bold text-xl flex items-center gap-1">
                                 {lawyer.rating} <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                             </div>
                         </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Info */}
                <div className="lg:col-span-2 space-y-8">
                    {/* About */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-600" /> About {lawyer.name}
                        </h2>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line mb-6">
                            {lawyer.bio || "No biography provided yet."}
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    <CheckCircle className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Status</p>
                                    <p className="font-bold text-gray-900 capitalize">{lawyer.status}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                    <Briefcase className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Cases Handled</p>
                                    <p className="font-bold text-gray-900">{lawyer.casesHandled}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Specialization */}
                     <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Award className="w-5 h-5 text-purple-600" /> Areas of Practice
                        </h2>
                        <div className="flex flex-wrap gap-2">
                             {lawyer.specialization && lawyer.specialization.map((spec, idx) => (
                                 <span key={idx} className="bg-purple-50 text-purple-700 px-4 py-2 rounded-xl font-medium border border-purple-100">
                                     {spec}
                                 </span>
                             ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Contact & Booking */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 shadow-xl border border-blue-100 sticky top-24">
                        <div className="text-center mb-6">
                            <p className="text-gray-500 font-medium mb-1">Consultation Fee</p>
                            <p className="text-4xl font-extrabold text-gray-900">$150<span className="text-base font-normal text-gray-400">/hr</span></p>
                        </div>

                        <Link 
                            href="/user/login" 
                            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all transform hover:-translate-y-1 mb-4"
                        >
                            Book Consultation
                        </Link>
                        
                        <div className="space-y-4 pt-6 border-t border-gray-100">
                            <div className="flex items-center gap-3 text-gray-600">
                                <MapPin className="w-5 h-5 text-gray-400" />
                                <span>{lawyer.address || "New York, NY"}</span>
                            </div>
                             <div className="flex items-center gap-3 text-gray-600">
                                <Clock className="w-5 h-5 text-gray-400" />
                                <span className="capitalize">Availability: <span className={lawyer.availability === 'online' ? 'text-green-600 font-bold' : 'text-gray-900'}>{lawyer.availability}</span></span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
