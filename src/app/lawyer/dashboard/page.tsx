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

export default function LawyerDashboard() {
  // Mock data for now
  const stats = {
    activeCases: 12,
    pendingRequests: 3,
    upcomingAppointments: 4,
    unreadMessages: 8
  };

  const upcomingAppointments = [
    { id: 1, client: 'Alice Johnson', type: 'Consultation', time: '10:00 AM', date: 'Today' },
    { id: 2, client: 'Robert Smith', type: 'Case Hearing', time: '2:00 PM', date: 'Tomorrow' },
  ];

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
              {upcomingAppointments.map((appt) => (
                <div key={appt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                      {appt.client.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{appt.client}</p>
                      <p className="text-sm text-gray-500">{appt.type}</p>
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
              ))}
            </div>
          </div>
        </div>

        {/* Recent Requests or Activity */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
           <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Pending Requests</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View all</button>
          </div>
          <div className="p-6 text-center text-gray-500 py-12">
            No pending requests at the moment.
          </div>
        </div>
      </div>
    </div>
  );
}
