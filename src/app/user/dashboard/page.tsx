"use client";

import { useState, useEffect } from 'react';
import { LayoutDashboard, Scale, Clock, MessageSquare, Search, User } from 'lucide-react';
import Link from 'next/link';
import { api } from '../../../services/api';

export default function UserDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
     activeCases: 0,
     upcomingAppointments: 0,
     unreadMessages: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
        try {
            const data = await api.getUserStats();
            setStats(data);
        } catch (error) {
            console.error("Failed to fetch dashboard stats", error);
        } finally {
            setLoading(false);
        }
    };
    
    fetchStats();
  }, []);

  if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
  }

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Dashboard</h1>
        <p className="text-gray-500">Overview of your legal activities</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer">
           <div>
               <p className="text-gray-500 text-sm font-medium">Active Cases</p>
               <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.activeCases}</h3>
           </div>
           <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
               <Scale className="w-6 h-6" />
           </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer">
           <div>
               <p className="text-gray-500 text-sm font-medium">Upcoming Appointments</p>
               <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.upcomingAppointments}</h3>
           </div>
           <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
               <Clock className="w-6 h-6" />
           </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer">
           <div>
               <p className="text-gray-500 text-sm font-medium">Unread Messages</p>
               <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.unreadMessages}</h3>
           </div>
           <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
               <MessageSquare className="w-6 h-6" />
           </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/user/lawyers" className="flex items-center p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-4">
                    <Search className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-semibold">Find a Lawyer</h3>
                    <p className="text-blue-100 text-sm">Browse by category & expertise</p>
                </div>
            </Link>
            
            <Link href="/user/cases" className="flex items-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-4 text-gray-600">
                    <Scale className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900">View My Cases</h3>
                    <p className="text-gray-500 text-sm">Check status & upload docs</p>
                </div>
            </Link>

             <Link href="/user/appointments" className="flex items-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-4 text-gray-600">
                    <Clock className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900">Book Appointment</h3>
                    <p className="text-gray-500 text-sm">Schedule a consultation</p>
                </div>
            </Link>

            <Link href="/user/profile" className="flex items-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-4 text-gray-600">
                    <User className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900">My Profile</h3>
                    <p className="text-gray-500 text-sm">Update personal info</p>
                </div>
            </Link>
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6 text-center text-gray-500">
              No recent activity to show.
          </div>
      </div>
    </div>
  );
}
