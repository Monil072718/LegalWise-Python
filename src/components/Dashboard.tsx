"use client";

import { useState, useEffect } from 'react';
import { Users, FileText, Calendar, DollarSign, AlertCircle, Clock, Bell } from 'lucide-react';
import { useWebSocket } from '../hooks/useWebSocket';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { api } from '../services/api';

interface DashboardStats {
  active_cases: number;
  total_users: number;
  pending_requests: number;
  revenue_month: number;
  upcoming_appointments: number;
  pending_client_requests: number;
}

interface RevenueData {
  month: string;
  revenue: number;
  cases: number;
}

interface CaseStatusData {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

interface ActivityData {
  text: string;
  time: string;
  type: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [caseStatusData, setCaseStatusData] = useState<CaseStatusData[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const messages = useWebSocket('ws://localhost:8000/ws/admin');
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      setNotification(`New Update: ${lastMessage}`);
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [messages]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, revenueRes, statusRes, activityRes] = await Promise.all([
        api.get<DashboardStats>('/dashboard/stats'),
        api.get<RevenueData[]>('/dashboard/revenue'),
        api.get<CaseStatusData[]>('/dashboard/case-status'),
        api.get<ActivityData[]>('/dashboard/recent-activity')
      ]);

      setStats(statsRes);
      setRevenueData(revenueRes);
      setCaseStatusData(statusRes);
      setRecentActivity(activityRes);
    } catch (err: any) {
      console.error('Failed to fetch dashboard data:', err);
      setError(err.message || 'Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <div className="text-red-600 font-medium">Unable to load dashboard data</div>
        <p className="text-gray-500 text-sm">{error}</p>
        <button 
          onClick={fetchData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  if (!stats) return null;

  const statsData = [
    { label: 'Active Cases', value: stats.active_cases.toString(), change: '+12%', icon: FileText, color: 'bg-blue-500' },
    { label: 'Total Users', value: stats.total_users.toString(), change: '+8%', icon: Users, color: 'bg-green-500' },
    { label: 'Pending Requests', value: stats.pending_requests.toString(), change: '-5%', icon: AlertCircle, color: 'bg-yellow-500' },
    { label: 'Revenue (Month)', value: `$${stats.revenue_month.toLocaleString()}`, change: '+15%', icon: DollarSign, color: 'bg-purple-500' },
    { label: 'Upcoming Appointments', value: stats.upcoming_appointments.toString(), change: '+3%', icon: Calendar, color: 'bg-indigo-500' },
    { label: 'Pending Client Requests', value: stats.pending_client_requests.toString(), change: '-8%', icon: Clock, color: 'bg-orange-500' }
  ];

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {notification && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 rounded-r shadow-sm flex items-center justify-between">
          <div className="flex items-center">
             <Bell className="w-5 h-5 text-blue-600 mr-2" />
             <span className="text-blue-700 font-medium">{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-blue-500 hover:text-blue-700">
            ×
          </button>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className={`text-xs sm:text-sm mt-1 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`${stat.color} p-2 sm:p-3 rounded-lg ml-3`}>
                  <Icon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value, name) => [`$${value}`, name === 'revenue' ? 'Revenue' : 'Cases']} />
              <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Case Status Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Case Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={caseStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                dataKey="value"
              >
                {caseStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-4">
            {caseStatusData.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                <span className="text-xs sm:text-sm text-gray-600">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3 sm:space-y-4">
          {recentActivity.map((activity, index) => (
             <div key={index} className="flex items-center space-x-3 sm:space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
             <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
               <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
             </div>
             <div className="flex-1 min-w-0">
               <p className="text-sm font-medium text-gray-900 truncate">{activity.text}</p>
               <p className="text-xs text-gray-500">{activity.time}</p>
             </div>
           </div>
          ))}
        </div>
      </div>
    </div>
  );
}