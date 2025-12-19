"use client";

import { useState, useEffect } from 'react';
import { Search, Plus, Eye, Edit, Trash2, User, BookOpen, FileText, DollarSign, X, Phone, MapPin } from 'lucide-react';
import { Client } from '../types';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import ConfirmationModal from './ConfirmationModal';
import CustomSelect from './CustomSelect';

export default function ClientManagement() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  // Modal state for deletion
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    company: '',
    notes: ''
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const data = await api.get<Client[]>('/clients');
      setClients(data);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter((client: Client) => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || client.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', address: '', company: '', notes: '' });
    setIsEditing(false);
    setEditingId(null);
  };

  const openAddModal = () => {
      resetForm();
      setShowAddModal(true);
  };

  const closeAddModal = () => {
      setShowAddModal(false);
      resetForm();
  };

  const handleEditClient = (client: Client) => {
    setFormData({
        name: client.name,
        email: client.email,
        phone: client.phone || '',
        address: client.address || '',
        company: client.company || '',
        notes: client.notes || ''
    });
    setEditingId(client.id);
    setIsEditing(true);
    setShowAddModal(true);
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      if (id) {
          await api.updateClient(id, { status: newStatus as 'active' | 'inactive' | 'pending' });
          setClients(clients.map(c => c.id === id ? { ...c, status: newStatus as 'active' | 'inactive' | 'pending' } : c));
          showToast('Status updated successfully', 'success');
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      showToast('Failed to update status', 'error');
    }
  };

  const handleSubmitClient = async () => {
    try {
      if (isEditing && editingId) {
          // Update existing client
          const updateData = {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              address: formData.address,
              company: formData.company,
              notes: formData.notes
          };

          const updatedClient = await api.updateClient(editingId, updateData);
          setClients(clients.map(c => c.id === editingId ? { ...c, ...updatedClient } : c));
          showToast('Client updated successfully', 'success');
      } else {
          // Create new client
          const newClientData = {
            name: formData.name,
            email: formData.email,
            role: 'client' as const,
            status: 'active' as const,
            consultations: 0,
            booksDownloaded: 0,
            articlesRead: 0,
            totalSpent: 0,
            createdAt: new Date().toISOString().split('T')[0],
            phone: formData.phone,
            address: formData.address,
            company: formData.company,
            notes: formData.notes
          };
    
          const createdClient = await api.createClient(newClientData);
          setClients([...clients, createdClient]);
          showToast('Client added successfully', 'success');
      }
      closeAddModal();
    } catch (error) {
      console.error(isEditing ? 'Failed to update client:' : 'Failed to create client:', error);
      showToast(isEditing ? 'Failed to update client.' : 'Failed to create client.', 'error');
    }
  };

  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setShowViewModal(true);
  };

  const initiateDeleteClient = (id: string) => {
      setClientToDelete(id);
      setShowDeleteModal(true);
  };

  const confirmDeleteClient = async () => {
    if (!clientToDelete) return;
    
    try {
      await api.deleteClient(clientToDelete);
      setClients(clients.filter((c: Client) => c.id !== clientToDelete));
      showToast('Client deleted successfully', 'success');
    } catch (error) {
      console.error('Failed to delete client:', error);
      showToast('Failed to delete client.', 'error');
    } finally {
        setShowDeleteModal(false);
        setClientToDelete(null);
    }
  };

  if (loading && clients.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
  }

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Client Management</h1>
        <button 
          onClick={openAddModal}
          className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Client</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clients</p>
              <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
            </div>
            <User className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Clients</p>
              <p className="text-2xl font-bold text-green-600">
                {clients.filter((c: Client) => c.status === 'active').length}
              </p>
            </div>
            <User className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Consultations</p>
              <p className="text-2xl font-bold text-purple-600">
                {clients.reduce((sum, c: Client) => sum + c.consultations, 0)}
              </p>
            </div>
            <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
          </div>
        </div>
        
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-orange-600">
                ${clients.reduce((sum, c: Client) => sum + (c.totalSpent || 0), 0).toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search clients..."
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Clients Table - Mobile Responsive */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Mobile View */}
        <div className="block lg:hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Clients ({filteredClients.length})</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredClients.map((client: Client) => (
              <div key={client.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {client.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{client.name}</div>
                      <div className="text-sm text-gray-500">{client.email}</div>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => handleViewClient(client)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                      <button 
                        onClick={() => handleEditClient(client)}
                        className="p-1 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => initiateDeleteClient(client.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Consultations:</span>
                    <div className="font-medium">{client.consultations}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Books:</span>
                    <div className="font-medium">{client.booksDownloaded}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Articles:</span>
                    <div className="font-medium">{client.articlesRead}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Total Spent:</span>
                    <div className="font-medium">${client.totalSpent}</div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <CustomSelect
                    value={client.status}
                    options={['active', 'inactive', 'pending']}
                    onChange={(newStatus) => handleStatusUpdate(client.id, newStatus)}
                    variant="status"
                  />
                  <span className="text-xs text-gray-500">
                    Joined: {client.createdAt ? new Date(client.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Client</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Consultations</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Books Downloaded</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Articles Read</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Total Spent</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredClients.map((client: Client) => (
                <tr key={client.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {client.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{client.name}</div>
                        <div className="text-sm text-gray-500">{client.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{client.consultations}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{client.booksDownloaded}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {client.articlesRead}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    ${(client.totalSpent || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <CustomSelect
                      value={client.status}
                      options={['active', 'inactive', 'pending']}
                      onChange={(newStatus) => handleStatusUpdate(client.id, newStatus)}
                      variant="status"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewClient(client)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEditClient(client)}
                        className="p-1 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => initiateDeleteClient(client.id)}
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

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">{isEditing ? 'Edit Client' : 'Add New Client'}</h3>
              <button
                onClick={closeAddModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="client@email.com"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Company name (optional)"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="123 Main St, City, State 12345"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Additional notes about the client..."
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                onClick={closeAddModal}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitClient}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                {isEditing ? 'Update Client' : 'Add Client'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Client Modal */}
      {showViewModal && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Client Details</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
                <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">
                    {selectedClient.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedClient.name}</h2>
                  <p className="text-gray-600">{selectedClient.email}</p>
                  <div className="flex items-center space-x-4 mt-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(selectedClient.status)}`}>
                      {selectedClient.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      Joined: {selectedClient.createdAt ? new Date(selectedClient.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Consultations</h4>
                  <p className="text-2xl font-bold text-blue-600">{selectedClient.consultations}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Books Downloaded</h4>
                  <p className="text-2xl font-bold text-green-600">{selectedClient.booksDownloaded}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Articles Read</h4>
                  <p className="text-2xl font-bold text-purple-600">{selectedClient.articlesRead}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Total Spent</h4>
                  <p className="text-2xl font-bold text-orange-600">${(selectedClient.totalSpent || 0).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Recent Activity</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Consultation Booked</div>
                        <div className="text-xs text-gray-500">2 days ago</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <BookOpen className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Downloaded Legal Guide</div>
                        <div className="text-xs text-gray-500">1 week ago</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <DollarSign className="w-5 h-5 text-purple-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Payment Completed</div>
                        <div className="text-xs text-gray-500">2 weeks ago</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{selectedClient.email}</div>
                        <div className="text-xs text-gray-500">Primary Email</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">+1 (555) 123-4567</div>
                        <div className="text-xs text-gray-500">Phone Number</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">123 Main St, City, State</div>
                        <div className="text-xs text-gray-500">Address</div>
                      </div>
                    </div>
                  </div>
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

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
            setShowDeleteModal(false);
            setClientToDelete(null);
        }}
        onConfirm={confirmDeleteClient}
        title="Delete Client"
        message="Are you sure you want to delete this client? This action cannot be undone."
        confirmText="Delete Client"
        isDestructive={true}
      />
    </div>
  );
}