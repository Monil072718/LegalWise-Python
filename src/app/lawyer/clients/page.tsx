'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Eye, FileText, Activity, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/services/api';
import { Client } from '@/types';

export default function LawyerClients() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const [statusFilter, setStatusFilter] = useState('All');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getClients();
      setClients(data);
    } catch (err: any) {
      console.error("Failed to fetch clients", err);
      setError(err.message || "Failed to load clients. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      await api.updateClient(id, { status: newStatus });
      // Optimistic update
      setClients(prev => prev.map(client => 
        client.id === id ? { ...client, status: newStatus } : client
      ));
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="p-6">Loading clients...</div>;
  if (error) return (
    <div className="p-6">
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
        <button onClick={fetchClients} className="mt-2 text-sm underline hover:text-red-900">Retry</button>
      </div>
    </div>
  );

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
                        <div className="text-xs text-gray-500">ID: #{client.id.substring(0, 5)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{client.email}</div>
                    <div className="text-sm text-gray-500">{client.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative group">
                        <button disabled={updatingId === client.id} className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full cursor-pointer hover:opacity-80 transition-opacity ${
                        client.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {client.status}
                        {updatingId === client.id ? (
                             <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin ml-1"/>
                        ) : (
                            <ChevronDown className="w-3 h-3 ml-1" />
                        )}
                        </button>
                        
                        <div className="hidden group-hover:block absolute top-full left-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20">
                            {['Active', 'Pending', 'Inactive'].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => handleStatusUpdate(client.id, s)}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-900">
                      <FileText className="w-4 h-4 text-gray-400" />
                      {/* {client.activeCases} - Need to join with cases in real app, assuming 0 for now */}
                      0 
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Activity className="w-4 h-4" />
                      {/* Using createdAt as proxy for last activity for now */}
                      {new Date(client.createdAt).toLocaleDateString()}
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
              {filteredClients.length === 0 && (
                  <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                          No clients found.
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
