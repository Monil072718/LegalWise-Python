"use client";

import { useState, useEffect } from 'react';
import { Search, Plus, Eye, Edit, Trash2, AlertTriangle, Calendar, FileText, User, X, Upload } from 'lucide-react';
import { Case, Lawyer, Client } from '../types';
import { api } from '../services/api';

export default function CaseManagement() {
  const [cases, setCases] = useState<Case[]>([]);
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    clientId: '',
    lawyerId: '',
    priority: 'medium',
    stage: 'Initial Review',
    description: '',
    nextHearing: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [casesData, lawyersData, clientsData] = await Promise.all([
          api.get<Case[]>('/cases'),
          api.get<Lawyer[]>('/lawyers'),
          api.get<Client[]>('/clients')
        ]);
        setCases(casesData);
        setLawyers(lawyersData);
        setClients(clientsData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredCases = cases.filter((caseItem: Case) => {
    const matchesSearch = caseItem.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || caseItem.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || caseItem.priority === selectedPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      'open': 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      'closed': 'bg-green-100 text-green-800',
      'pending': 'bg-gray-100 text-gray-800'
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const getPriorityBadge = (priority: string) => {
    const styles = {
      'low': 'bg-green-100 text-green-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-red-100 text-red-800'
    };
    return styles[priority as keyof typeof styles] || styles.medium;
  };

  const getLawyerName = (lawyerId: string) => {
    const lawyer = lawyers.find((l: Lawyer) => l.id === lawyerId);
    return lawyer?.name || 'Unknown';
  };

  const getClientName = (clientId: string) => {
    const client = clients.find((c: Client) => c.id === clientId);
    return client?.name || 'Unknown';
  };

  const handleAddCase = async () => {
    try {
      const newCaseData = {
        title: formData.title,
        clientId: formData.clientId,
        lawyerId: formData.lawyerId,
        status: 'open' as const,
        stage: formData.stage,
        priority: formData.priority as 'low' | 'medium' | 'high',
        createdAt: new Date().toISOString().split('T')[0],
        nextHearing: formData.nextHearing || undefined,
        documents: []
      };

      const createdCase = await api.createCase(newCaseData);
      setCases([...cases, createdCase]);
      setFormData({
        title: '',
        clientId: '',
        lawyerId: '',
        priority: 'medium',
        stage: 'Initial Review',
        description: '',
        nextHearing: ''
      });
      setShowAddModal(false);
    } catch (error) {
      console.error('Failed to create case:', error);
      alert('Failed to create case.');
    }
  };

  const handleViewCase = (caseItem: Case) => {
    setSelectedCase(caseItem);
    setShowViewModal(true);
  };

  const handleDeleteCase = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this case?')) return;
    try {
      await api.deleteCase(id);
      setCases(cases.filter((c: Case) => c.id !== id));
    } catch (error) {
      console.error('Failed to delete case:', error);
      alert('Failed to delete case.');
    }
  };

  const handleUpdateCaseStatus = async (id: string, newStatus: string) => {
    try {
      const updatedCase = await api.updateCase(id, { status: newStatus as Case['status'] });
      setCases(cases.map((c: Case) => c.id === id ? updatedCase : c));
    } catch (error) {
      console.error('Failed to update case status:', error);
      alert('Failed to update case status.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Case Management</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Case</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Cases</p>
              <p className="text-2xl font-bold text-gray-900">{cases.length}</p>
            </div>
            <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Cases</p>
              <p className="text-2xl font-bold text-blue-600">
                {cases.filter((c: Case) => c.status === 'in-progress').length}
              </p>
            </div>
            <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-red-600">
                {cases.filter((c: Case) => c.priority === 'high').length}
              </p>
            </div>
            <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming Hearings</p>
              <p className="text-2xl font-bold text-purple-600">
                {cases.filter((c: Case) => c.nextHearing).length}
              </p>
            </div>
            <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search cases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            />
          </div>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="closed">Closed</option>
            <option value="pending">Pending</option>
          </select>
          
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto"
          >
            <option value="all">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {/* Cases Table - Mobile Responsive */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Mobile View */}
        <div className="block xl:hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Cases ({filteredCases.length})</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredCases.map((caseItem: Case) => (
              <div key={caseItem.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{caseItem.title}</div>
                    <div className="text-sm text-gray-500">Case #{caseItem.id}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Created: {new Date(caseItem.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => handleViewCase(caseItem)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteCase(caseItem.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Client:</span>
                    <div className="font-medium">{getClientName(caseItem.clientId)}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Lawyer:</span>
                    <div className="font-medium">{getLawyerName(caseItem.lawyerId)}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Stage:</span>
                    <div className="font-medium">{caseItem.stage}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Next Hearing:</span>
                    <div className="font-medium">
                      {caseItem.nextHearing ? new Date(caseItem.nextHearing).toLocaleDateString() : 'None'}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadge(caseItem.priority)}`}>
                      {caseItem.priority}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(caseItem.status)}`}>
                      {caseItem.status}
                    </span>
                  </div>
                  <select
                    value={caseItem.status}
                    onChange={(e) => handleUpdateCaseStatus(caseItem.id, e.target.value)}
                    className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="closed">Closed</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden xl:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Case Details</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Client</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Lawyer</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Stage</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Priority</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Next Hearing</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCases.map((caseItem: Case) => (
                <tr key={caseItem.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{caseItem.title}</div>
                      <div className="text-sm text-gray-500">Case #{caseItem.id}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        Created: {new Date(caseItem.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{getClientName(caseItem.clientId)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{getLawyerName(caseItem.lawyerId)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">{caseItem.stage}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadge(caseItem.priority)}`}>
                      {caseItem.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={caseItem.status}
                      onChange={(e) => handleUpdateCaseStatus(caseItem.id, e.target.value)}
                      className={`text-xs border-0 rounded-full px-2.5 py-0.5 font-medium focus:ring-2 focus:ring-blue-500 ${getStatusBadge(caseItem.status)}`}
                    >
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="closed">Closed</option>
                      <option value="pending">Pending</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    {caseItem.nextHearing ? (
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {new Date(caseItem.nextHearing).toLocaleDateString()}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">No hearing scheduled</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewCase(caseItem)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteCase(caseItem.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Case Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Create New Case</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Case Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter case title"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Client *</label>
                  <select
                    value={formData.clientId}
                    onChange={(e) => setFormData({...formData, clientId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Client</option>
                    {clients.map((client: Client) => (
                      <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Lawyer *</label>
                  <select
                    value={formData.lawyerId}
                    onChange={(e) => setFormData({...formData, lawyerId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Lawyer</option>
                    {lawyers.filter((l: Lawyer) => l.status === 'active').map((lawyer: Lawyer) => (
                      <option key={lawyer.id} value={lawyer.id}>{lawyer.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stage</label>
                  <select
                    value={formData.stage}
                    onChange={(e) => setFormData({...formData, stage: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Initial Review">Initial Review</option>
                    <option value="Discovery">Discovery</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Trial Preparation">Trial Preparation</option>
                    <option value="Trial">Trial</option>
                    <option value="Settlement">Settlement</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Next Hearing</label>
                  <input
                    type="date"
                    value={formData.nextHearing}
                    onChange={(e) => setFormData({...formData, nextHearing: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Case Description</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Detailed case description..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Case Documents</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors duration-200">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Upload case documents</p>
                  <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX up to 10MB</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCase}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Create Case
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Case Modal */}
      {showViewModal && selectedCase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Case Details</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedCase.title}</h2>
                <p className="text-gray-600">Case #{selectedCase.id}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(selectedCase.status)}`}>
                    {selectedCase.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityBadge(selectedCase.priority)}`}>
                    {selectedCase.priority} priority
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Client</h4>
                  <p className="text-lg font-bold text-blue-600">{getClientName(selectedCase.clientId)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Assigned Lawyer</h4>
                  <p className="text-lg font-bold text-green-600">{getLawyerName(selectedCase.lawyerId)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Current Stage</h4>
                  <p className="text-lg font-bold text-purple-600">{selectedCase.stage}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Case Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="text-gray-900">{new Date(selectedCase.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Next Hearing:</span>
                      <span className="text-gray-900">
                        {selectedCase.nextHearing ? new Date(selectedCase.nextHearing).toLocaleDateString() : 'Not scheduled'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Documents:</span>
                      <span className="text-gray-900">{selectedCase.documents.length} files</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Documents ({selectedCase.documents.length})</h4>
                  {selectedCase.documents.length > 0 ? (
                    <div className="space-y-2">
                      {selectedCase.documents.map((doc: any) => (
                        <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                            <div className="text-xs text-gray-500">{doc.size} • {new Date(doc.uploadedAt).toLocaleDateString()}</div>
                          </div>
                          <button className="text-blue-600 hover:text-blue-800 text-sm">View</button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No documents uploaded</p>
                  )}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}