"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '../../../../services/api';
import { Lawyer } from '../../../../types';
import { 
    MapPin, 
    Star, 
    Briefcase, 
    Clock, 
    Mail, 
    Phone, 
    Calendar,
    Award,
    Shield,
    CheckCircle,
    ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default function LawyerProfile() {
  const { id } = useParams();
  const router = useRouter();
  const [lawyer, setLawyer] = useState<Lawyer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchLawyer = async () => {
        try {
            const data = await api.getLawyer(id as string);
            setLawyer(data);
        } catch (error) {
            console.error("Failed to fetch lawyer", error);
        } finally {
            setLoading(false);
        }
    };
    fetchLawyer();
  }, [id]);

  if (loading) {
      return (
        <div className="flex items-center justify-center h-full min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
  }

  if (!lawyer) {
      return (
          <div className="p-8 text-center text-gray-500">
              <h2 className="text-xl font-semibold mb-2">Lawyer not found</h2>
              <Link href="/user/lawyers" className="text-blue-600 hover:underline">Return to search</Link>
          </div>
      );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <button 
        onClick={() => router.back()} 
        className="flex items-center text-gray-500 hover:text-gray-900 transition-colors"
      >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Lawyers
      </button>

      {/* Header Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-32 md:h-48"></div>
          <div className="px-6 pb-6 md:px-10">
              <div className="flex flex-col md:flex-row items-start md:items-end -mt-12 md:-mt-16 mb-6">
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full p-1 shadow-lg z-10">
                      <div className="w-full h-full bg-gray-200 rounded-full overflow-hidden flex items-center justify-center text-blue-600 font-bold text-3xl md:text-4xl bg-blue-50">
                          {/* Avatar Placeholder */}
                          {lawyer.name.charAt(0)}
                      </div>
                  </div>
                  <div className="mt-4 md:mt-0 md:ml-6 flex-1">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                          <div>
                              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                                  {lawyer.name}
                                  {lawyer.verified && <Shield className="w-6 h-6 text-blue-500 fill-current" />}
                              </h1>
                              <p className="text-gray-500 font-medium flex items-center mt-1">
                                  <MapPin className="w-4 h-4 mr-1" /> {lawyer.address}
                              </p>
                          </div>
                           <div className="mt-4 md:mt-0 flex gap-3">
                              <Link href={`/user/appointments/new?lawyerId=${lawyer.id}`} className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-md transition-all flex items-center">
                                  <Calendar className="w-4 h-4 mr-2" /> Book Appointment
                              </Link>
                           </div>
                      </div>
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-4 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                          <Star className="w-5 h-5 fill-current" />
                      </div>
                      <div>
                          <p className="text-sm text-gray-500">Rating</p>
                          <p className="font-bold text-gray-900">{lawyer.rating} <span className="text-sm font-normal text-gray-400">/ 5.0</span></p>
                      </div>
                  </div>
                  <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                          <Briefcase className="w-5 h-5" />
                      </div>
                      <div>
                          <p className="text-sm text-gray-500">Cases Handled</p>
                          <p className="font-bold text-gray-900">{lawyer.casesHandled}+</p>
                      </div>
                  </div>
                  <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                          <Clock className="w-5 h-5" />
                      </div>
                      <div>
                          <p className="text-sm text-gray-500">Experience</p>
                          <p className="font-bold text-gray-900">8+ Years</p> 
                          {/* Ideally field experience_years should be in api response */}
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2 text-blue-600" /> About
                  </h3>
                  <div className="prose prose-blue max-w-none text-gray-600">
                      <p>{lawyer.bio || "This lawyer has not provided a bio yet, but they are a verified professional on LegalWise."}</p>
                  </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                   <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <Award className="w-5 h-5 mr-2 text-purple-600" /> Specializations
                  </h3>
                  <div className="flex flex-wrap gap-2">
                       {lawyer.specialization.map((spec, i) => (
                           <span key={i} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium border border-purple-100">
                               {spec}
                           </span>
                       ))}
                  </div>
              </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                   <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Info</h3>
                   <div className="space-y-4">
                       <div className="flex items-center text-gray-600">
                           <Mail className="w-5 h-5 mr-3 text-gray-400" />
                           <span className="text-sm truncate">{lawyer.email}</span>
                       </div>
                       <div className="flex items-center text-gray-600">
                           <Phone className="w-5 h-5 mr-3 text-gray-400" />
                           <span className="text-sm">{lawyer.phone}</span>
                       </div>
                        <div className="flex items-center text-gray-600">
                           <Clock className="w-5 h-5 mr-3 text-gray-400" />
                           <span className="text-sm">
                               {lawyer.availability === 'online' ? (
                                   <span className="text-green-600 font-medium">Available Now</span>
                               ) : 'Currently Offline'}
                           </span>
                       </div>
                   </div>
              </div>
          </div>
      </div>
    </div>
  );
}

// User Icon needed for About section
function User(props: any) {
    return (
        <svg 
         {...props}
         xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
        >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
    )
}
