'use client';

import { useState } from 'react';
import { Search, Filter, Eye, FileText, Activity } from 'lucide-react';
import Link from 'next/link';

export default function LawyerClients() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const [statusFilter, setStatusFilter] = useState('All');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Mock data
  const clients = [
    { 
      id: "1", 
      name: "Alice Johnson", 
      email: "alice@example.com", 
      phone: "+1 (555) 123-4567",
      status: "Active",
      activeCases: 2,
      lastActivity: "2 days ago",
      avatar: null
    },
    { 
      id: "2", 
      name: "Robert Smith", 
      email: "robert@example.com", 
      phone: "+1 (555) 987-6543",
      status: "Active",
      activeCases: 1,
      lastActivity: "1 day ago",
      avatar: null
    },
    { 
      id: "3", 
      name: "Sarah Williams", 
      email: "sarah@example.com", 
      phone: "+1 (555) 456-7890",
      status: "Pending",
      activeCases: 0,
      lastActivity: "5 hours ago",
      avatar: null
    },
  ];

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Clients</h1>
        <div className="flex w-full sm:w-auto gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <button 
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className={`px-4 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors ${statusFilter !== 'All' ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-gray-300 text-gray-700'}`}
            >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">{statusFilter === 'All' ? 'Filter' : statusFilter}</span>
            </button>
            
            {showFilterDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10 animate-fade-in-up">
                    {['All', 'Active', 'Pending'].map((status) => (
                        <button
                            key={status}
                            onClick={() => {
                                setStatusFilter(status);
                                setShowFilterDropdown(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${statusFilter === status ? 'text-blue-600 font-medium bg-blue-50' : 'text-gray-700'}`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Client</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Contact</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Active Cases</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Last Activity</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {client.avatar || client.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{client.name}</div>
                        <div className="text-xs text-gray-500">ID: #{client.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{client.email}</div>
                    <div className="text-sm text-gray-500">{client.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      client.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-900">
                      <FileText className="w-4 h-4 text-gray-400" />
                      {client.activeCases}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Activity className="w-4 h-4" />
                      {client.lastActivity}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      href={`/lawyer/clients/${client.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
