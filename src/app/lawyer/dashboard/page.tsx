'use client';

import { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Users, 
  Calendar, 
  MessageSquare,
  Clock,
  ArrowUpRight,
  ArrowRight
} from 'lucide-react';
import { api } from '../../../services/api';
import { Appointment } from '../../../types';

export default function LawyerDashboard() {
  const [stats, setStats] = useState({
    activeCases: 0,
    pendingRequests: 0,
    upcomingAppointments: 0,
    unreadMessages: 0
  });
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // Use API for stats and appointments
  useEffect(() => {
    const fetchData = async () => {
        try {
            const [statsData, appointmentsData] = await Promise.all([
                api.getLawyerStats(),
                api.getAppointments()
            ]);
            setStats(statsData);
            setAppointments(appointmentsData);
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false);
        }
    };
    
    fetchData();
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];

  const upcomingAppointments = appointments
    .filter(appt => appt.status === 'approved' && appt.date >= todayStr)
    .sort((a, b) => new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime())
    .slice(0, 5); // Limit to 5

  const pendingRequests = appointments
    .filter(appt => appt.status === 'pending')
    .sort((a, b) => new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime())
    .slice(0, 5);

  if (loading) {
      return (
        <div className="flex items-center justify-center h-full min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, Counselor</h1>
          <p className="text-gray-500">Here's what's happening today</p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Cases</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeCases}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 flex items-center font-medium">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              +2
            </span>
            <span className="text-gray-500 ml-2">from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Requests</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pendingRequests}</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Users className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">Requires action</span>
            <ArrowRight className="w-4 h-4 ml-1 text-gray-400" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600">Appointments</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.upcomingAppointments}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">Upcoming in 7 days</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600">Unread Messages</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.unreadMessages}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <MessageSquare className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-blue-600 font-medium cursor-pointer hover:underline">
              View inbox
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Upcoming Appointments</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View all</button>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appt) => (
                    <div key={appt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                        {appt.clientName ? appt.clientName.charAt(0) : '?'}
                        </div>
                        <div>
                        <p className="font-medium text-gray-900">{appt.clientName || 'Unknown Client'}</p>
                        <p className="text-sm text-gray-500 capitalize">{appt.type}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center text-sm text-gray-900 font-medium">
                        <Clock className="w-4 h-4 mr-1 text-gray-400" />
                        {appt.time}
                        </div>
                        <p className="text-xs text-gray-500">{appt.date}</p>
                    </div>
                    </div>
                ))
              ) : (
                  <p className="text-center text-gray-500 py-4">No upcoming appointments.</p>
              )}
            </div>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
           <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Pending Requests</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View all</button>
          </div>
          <div className="p-6">
             <div className="space-y-4">
                 {pendingRequests.length > 0 ? (
                     pendingRequests.map((appt) => (
                        <div key={appt.id} className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 font-bold">
                            {appt.clientName ? appt.clientName.charAt(0) : '?'}
                            </div>
                            <div>
                            <p className="font-medium text-gray-900">{appt.clientName || 'Unknown Client'}</p>
                            <p className="text-sm text-gray-500 capitalize">{appt.type}</p>
                            </div>
                        </div>
                        <div className="text-right">
                             <div className="flex items-center text-sm text-gray-900 font-medium">
                                <Clock className="w-4 h-4 mr-1 text-gray-400" />
                                {appt.time}
                            </div>
                             <p className="text-xs text-gray-500">{appt.date}</p>
                            <span className="text-xs font-semibold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full mt-1 inline-block">Pending</span>
                        </div>
                        </div>
                     ))
                 ) : (
                    <div className="text-center text-gray-500 py-12">
                        No pending requests at the moment.
                    </div>
                 )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
