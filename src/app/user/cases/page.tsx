"use client";

import { useState, useEffect } from 'react';
import { Scale, Calendar, FileText, Download, Filter, Search, AlertCircle } from 'lucide-react';
import { api } from '../../../services/api';
import { Case } from '../../../types';

export default function MyCasesPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const data = await api.getClientCases();
      setCases(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load cases');
    } finally {
      setLoading(false);
    }
  };

  const filteredCases = cases.filter(c => {
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         c.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'open': 'bg-blue-100 text-blue-700',
      'in-progress': 'bg-yellow-100 text-yellow-700',
      'closed': 'bg-gray-100 text-gray-700',
      'pending': 'bg-purple-100 text-purple-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'high': 'text-red-600',
      'medium': 'text-orange-600',
      'low': 'text-green-600'
    };
    return colors[priority] || 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Cases</h1>
        <p className="text-gray-500">Track and manage your legal cases</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search cases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="closed">Closed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Cases Grid */}
      {filteredCases.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Scale className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No cases found</h3>
          <p className="text-gray-500">
            {searchQuery || filterStatus !== 'all' 
              ? 'Try adjusting your filters' 
              : 'You don\'t have any cases yet'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCases.map((caseItem) => (
            <div
              key={caseItem.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{caseItem.title}</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(caseItem.status)}`}>
                        {caseItem.status}
                      </span>
                      <span className={`text-xs font-semibold ${getPriorityColor(caseItem.priority)}`}>
                        {caseItem.priority.toUpperCase()} PRIORITY
                      </span>
                    </div>
                  </div>
                  <Scale className="w-8 h-8 text-blue-600" />
                </div>

                {/* Description */}
                {caseItem.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{caseItem.description}</p>
                )}

                {/* Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium mr-2">Stage:</span>
                    <span>{caseItem.stage}</span>
                  </div>
                  {caseItem.nextHearing && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="font-medium mr-2">Next Hearing:</span>
                      <span>{new Date(caseItem.nextHearing).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-600">
                    <FileText className="w-4 h-4 mr-2" />
                    <span className="font-medium mr-2">Documents:</span>
                    <span>{caseItem.documents?.length || 0} files</span>
                  </div>
                </div>

                {/* Documents */}
                {caseItem.documents && caseItem.documents.length > 0 && (
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Attached Documents:</p>
                    <div className="space-y-2">
                      {caseItem.documents.slice(0, 3).map((doc: any) => (
                        <a
                          key={doc.id}
                          href={api.getCaseDocumentUrl(caseItem.id, doc.name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <Download className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-700 flex-1 truncate">{doc.name}</span>
                          <span className="text-xs text-gray-500">{doc.size}</span>
                        </a>
                      ))}
                      {caseItem.documents.length > 3 && (
                        <p className="text-xs text-gray-500 text-center">
                          +{caseItem.documents.length - 3} more documents
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Created on {new Date(caseItem.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
