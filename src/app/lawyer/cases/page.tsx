'use client';

import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  FileText, 
  MoreVertical, 
  Clock, 
  AlertCircle,
  Users 
} from 'lucide-react';
import Link from 'next/link';

export default function LawyerCases() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Mock data
  const cases = [
    { 
      id: "C-101", 
      title: "Estate Dispute - Johnson Family", 
      client: "Alice Johnson", 
      status: "In Progress", 
      stage: "Discovery",
      priority: "High",
      nextHearing: "Jan 24, 2025",
      updated: "2 days ago"
    },
    { 
      id: "C-102", 
      title: "Contract Review - TechCorp merger", 
      client: "Robert Smith", 
      status: "Review", 
      stage: "Drafting",
      priority: "Medium",
      nextHearing: "None",
      updated: "5 hours ago"
    },
    { 
      id: "C-103", 
      title: "Traffic Violation Defense", 
      client: "Sarah Williams", 
      status: "Won", 
      stage: "Closed",
      priority: "Low",
      nextHearing: "None",
      updated: "1 week ago"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in progress': return 'bg-blue-100 text-blue-800';
      case 'won': return 'bg-green-100 text-green-800';
      case 'lost': return 'bg-red-100 text-red-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Case Management</h1>
        <Link 
          href="/lawyer/cases/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Case
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search cases by title or client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          {['All', 'In Progress', 'Start', 'Closed', 'Won', 'Lost', 'Review'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === status 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cases.filter(caseItem => {
             const matchesSearch = caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                   caseItem.client.toLowerCase().includes(searchTerm.toLowerCase());
             const matchesStatus = statusFilter === 'All' || caseItem.status === statusFilter;
             return matchesSearch && matchesStatus;
        }).map((caseItem) => (
          <Link key={caseItem.id} href={`/lawyer/cases/${caseItem.id}`} className="block group">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(caseItem.status)}`}>
                  {caseItem.status}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(caseItem.priority)}`}>
                  {caseItem.priority}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {caseItem.title}
              </h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2 text-gray-400" />
                  {caseItem.client}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FileText className="w-4 h-4 mr-2 text-gray-400" />
                  Stage: {caseItem.stage}
                </div>
                {caseItem.nextHearing !== 'None' && (
                  <div className="flex items-center text-sm text-red-600">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Hearing: {caseItem.nextHearing}
                  </div>
                )}
              </div>
              
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  Updated {caseItem.updated}
                </span>
                <span>ID: {caseItem.id}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
