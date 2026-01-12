"use client";

import { getImageUrl } from '../../utils/image';

import { useState, useEffect } from 'react';
import { Search, Plus, Eye, Edit, Trash2, CheckCircle, XCircle, Star, Clock, X, Upload } from 'lucide-react';
import { Lawyer } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import ConfirmationModal from '../common/ConfirmationModal';
import CustomSelect from '../common/CustomSelect';

export default function LawyerManagement() {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  
  // Modal state for deletion
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [lawyerToDelete, setLawyerToDelete] = useState<string | null>(null);

  const { showToast } = useToast();
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    specialization: '',
    experience: '',
    phone: '',
    address: '',
    bio: '',
    password: '',
    confirmPassword: '',
    status: 'active',
    availability: 'offline',
    verified: false,
    image: ''
  });
  
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchLawyers();
  }, []);

  const fetchLawyers = async () => {
    try {
      const data = await api.get<Lawyer[]>('/lawyers');
      setLawyers(data);
    } catch (error) {
      console.error('Failed to fetch lawyers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLawyers = lawyers.filter((lawyer: Lawyer) => {
    const matchesSearch = lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lawyer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lawyer.specialization.some((spec: string) => spec.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = selectedStatus === 'all' || lawyer.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  console.log('DEBUG: Total lawyers:', lawyers.length);
  console.log('DEBUG: Filtered lawyers:', filteredLawyers.length);
  console.log('DEBUG: Search term:', searchTerm);
  console.log('DEBUG: Selected status:', selectedStatus);

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      inactive: 'bg-red-100 text-red-800'
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const getAvailabilityBadge = (availability: string) => {
    const styles = {
      online: 'bg-green-100 text-green-800',
      offline: 'bg-gray-100 text-gray-800',
      busy: 'bg-red-100 text-red-800'
    };
    return styles[availability as keyof typeof styles] || styles.offline;
  };

  const handleSaveLawyer = async () => {
    try {
      const lawyerData = {
        name: formData.name,
        email: formData.email,
        role: 'lawyer' as const,
        status: formData.status as 'active' | 'pending' | 'inactive',
        specialization: formData.specialization.split(',').map((s: string) => s.trim()).filter(s => s),
        experience: parseInt(formData.experience) || 0,
        availability: formData.availability as 'online' | 'offline' | 'busy',
        verified: formData.verified,
        phone: formData.phone,
        address: formData.address,
        bio: formData.bio,
        image: formData.image
      };

      if (!lawyerData.name || !lawyerData.email || !lawyerData.specialization.length) {
        showToast('Please fill in all required fields', 'error');
        return;
      }

      if (!isEditing) {
        // Validation for new lawyer
        if (!formData.password) {
            showToast('Password is required for new lawyers', 'error');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }
        await api.createLawyer({
            ...lawyerData,
            password: formData.password,
            rating: 0,
            casesHandled: 0,
            createdAt: new Date().toISOString().split('T')[0],
            documents: []
        });
        showToast('Lawyer created successfully', 'success');
      } else {
         // Update existing lawyer
         if (selectedLawyer) {
             const updateData: any = { ...lawyerData };
             // Only include password if provided
             if (formData.password) {
                 if (formData.password !== formData.confirmPassword) {
                     showToast('Passwords do not match', 'error');
                     return;
                 }
                 updateData.password = formData.password;
             }
             await api.updateLawyer(selectedLawyer.id, updateData);
             showToast('Lawyer updated successfully', 'success');
         }
      }

      // Refresh list
      fetchLawyers();
      resetForm();
      setShowAddModal(false);
    } catch (error: any) {
      console.error('Failed to save lawyer:', error);
      const errorMessage = error.message || 'Failed to save lawyer. Please try again.';
      showToast(errorMessage, 'error');
    }
  };

  const resetForm = () => {
      setFormData({ 
          name: '', email: '', password: '', confirmPassword: '', 
          specialization: '', experience: '', phone: '', address: '', bio: '',
          status: 'active', availability: 'offline', verified: false, image: ''
      });
      setIsEditing(false);
      setSelectedLawyer(null);
  };

  const handleEditLawyer = (lawyer: Lawyer) => {
      setSelectedLawyer(lawyer);
      setFormData({
          name: lawyer.name,
          email: lawyer.email,
          password: '',
          confirmPassword: '',
          specialization: lawyer.specialization.join(', '),
          experience: lawyer.experience.toString(),
          phone: lawyer.phone || '',
          address: lawyer.address || '',
          bio: lawyer.bio || '',
          status: lawyer.status,
          availability: lawyer.availability,
          verified: lawyer.verified,
          image: lawyer.image || ''
      });
      setIsEditing(true);
      setShowAddModal(true);
  };

  const handleViewLawyer = (lawyer: Lawyer) => {
    setSelectedLawyer(lawyer);
    setShowViewModal(true);
  };

  const initiateDeleteLawyer = (id: string) => {
      setLawyerToDelete(id);
      setShowDeleteModal(true);
  };

  const confirmDeleteLawyer = async () => {
    if (!lawyerToDelete) return;
    try {
      await api.deleteLawyer(lawyerToDelete);
      setLawyers(lawyers.filter((l: Lawyer) => l.id !== lawyerToDelete));
      showToast('Lawyer deleted successfully', 'success');
    } catch (error) {
      console.error('Failed to delete lawyer:', error);
      showToast('Failed to delete lawyer.', 'error');
    } finally {
        setShowDeleteModal(false);
        setLawyerToDelete(null);
    }
  };

  const handleVerifyLawyer = async (id: string) => {
    try {
      await api.updateLawyer(id, { verified: true, status: 'active' });
      setLawyers(lawyers.map((l: Lawyer) => l.id === id ? { ...l, verified: true, status: 'active' } : l));
    } catch (error) {
      console.error('Failed to verify lawyer:', error);
      showToast('Failed to verify lawyer.', 'error');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploading(true);
      try {
        const response: any = await api.uploadImage(file);
        setFormData({ ...formData, image: response.url });
        showToast('Image uploaded successfully', 'success');
      } catch (error) {
        console.error('Failed to upload image:', error);
        showToast('Failed to upload image', 'error');
      } finally {
        setUploading(false);
      }
    }
  };

  if (loading && lawyers.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
  }

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Lawyer Management</h1>
        <button 
          onClick={() => {
              resetForm();
              setShowAddModal(true);
          }}
          className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Lawyer</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Online Lawyers</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-600">
                {lawyers.filter((l: Lawyer) => l.availability === 'online').length}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Available for consultation</p>
            </div>
            <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Verification</p>
              <p className="text-2xl sm:text-3xl font-bold text-yellow-600">
                {lawyers.filter(l => !l.verified).length}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Awaiting document review</p>
            </div>
            <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Top Rated</p>
              <p className="text-2xl sm:text-3xl font-bold text-purple-600">
                {lawyers.filter(l => l.rating >= 4.8).length}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">4.8+ star rating</p>
            </div>
            <Star className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
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
              placeholder="Search lawyers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            />
          </div>
          
          <div className="w-full sm:w-48">
            <CustomSelect
              value={selectedStatus}
              onChange={setSelectedStatus}
              options={[
                { label: 'All Status', value: 'all' },
                { label: 'Active', value: 'active' },
                { label: 'Pending', value: 'pending' },
                { label: 'Inactive', value: 'inactive' }
              ]}
              variant="default"
            />
          </div>
        </div>
      </div>

      {/* Lawyers Table - Mobile Responsive */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Mobile View */}
        <div className="block lg:hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Lawyers ({filteredLawyers.length})</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredLawyers.map((lawyer) => (
              <div key={lawyer.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                      {lawyer.image ? (
                        <img src={lawyer.image} alt={lawyer.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white font-medium text-sm">
                          {lawyer.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{lawyer.name}</div>
                      <div className="text-sm text-gray-500">{lawyer.email}</div>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => handleViewLawyer(lawyer)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                         onClick={() => handleEditLawyer(lawyer)}
                         className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => initiateDeleteLawyer(lawyer.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Experience:</span>
                    <div className="font-medium">{lawyer.experience} years</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Cases:</span>
                    <div className="font-medium">{lawyer.casesHandled}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Rating:</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="font-medium">{lawyer.rating}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(lawyer.status)}`}>
                      {lawyer.verified ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                      {lawyer.status}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {lawyer.specialization.map((spec, idx) => (
                    <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {spec}
                    </span>
                  ))}
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
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Lawyer</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Specialization</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Experience</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Rating</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Cases</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Availability</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLawyers.map((lawyer) => (
                <tr key={lawyer.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                            {lawyer.image ? (
                              <img src={getImageUrl(lawyer.image)} alt={lawyer.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white font-bold">
                                {lawyer.name.charAt(0)}
                              </div>
                            )}
                          </div>
                      <div>
                        <div className="font-medium text-gray-900">{lawyer.name}</div>
                        <div className="text-sm text-gray-500">{lawyer.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {lawyer.specialization.map((spec, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {lawyer.experience} years
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{lawyer.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {lawyer.casesHandled}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAvailabilityBadge(lawyer.availability)}`}>
                      <Clock className="w-3 h-3 mr-1" />
                      {lawyer.availability}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(lawyer.status)}`}>
                        {lawyer.verified ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                        {lawyer.status}
                      </span>
                      {!lawyer.verified && (
                        <button
                          onClick={() => handleVerifyLawyer(lawyer.id)}
                          className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition-colors duration-200"
                        >
                          Verify
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewLawyer(lawyer)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                         onClick={() => handleEditLawyer(lawyer)}
                         className="p-1 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                          onClick={() => initiateDeleteLawyer(lawyer.id)}
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

      {/* Add/Edit Lawyer Modal - Premium UI */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{isEditing ? 'Edit Profile' : 'New Lawyer'}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {isEditing ? 'Update the professional details below.' : 'Register a new legal expert to the platform.'}
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-8 overflow-y-auto custom-scrollbar space-y-8 flex-1">
              
              {/* Profile Image Section */}
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative group">
                  <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-xl flex items-center justify-center">
                    {formData.image ? (
                      <img src={formData.image} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl font-bold text-gray-300">
                        {formData.name ? formData.name.charAt(0).toUpperCase() : '?'}
                      </span>
                    )}
                  </div>
                  <label className="absolute bottom-1 right-1 bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-full cursor-pointer shadow-lg transition-all transform hover:scale-105">
                    <Upload className="w-4 h-4" />
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
                {uploading && <span className="text-xs text-blue-600 animate-pulse font-medium">Uploading...</span>}
                <p className="text-xs text-gray-400">Allowed *.jpeg, *.jpg, *.png</p>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                
                {/* Column 1: Personal Info */}
                <div className="space-y-5">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Personal Details</h4>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                      placeholder="e.g. Jonathan Specter"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                      placeholder="lawyer@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div>
                     <label className="block text-sm font-semibold text-gray-700 mb-1.5">Office Address</label>
                     <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                      placeholder="123 Legal Ave, Suite 400"
                    />
                  </div>
                </div>

                {/* Column 2: Professional Info */}
                <div className="space-y-5">
                   <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Professional Info</h4>

                   <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Specialization <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={formData.specialization}
                      onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                      placeholder="Criminal, Family, Corporate"
                      required
                    />
                    <p className="text-xs text-gray-400 mt-1">Separate multiple areas with commas</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Experience (Yrs) <span className="text-red-500">*</span></label>
                        <input
                        type="number"
                        value={formData.experience}
                        onChange={(e) => setFormData({...formData, experience: e.target.value})}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                        placeholder="0"
                        min="0"
                        required
                        />
                    </div>
                    <div>
                         <label className="block text-sm font-semibold text-gray-700 mb-1.5">Availability</label>
                         <div className="relative">
                            <select
                                value={formData.availability}
                                onChange={(e) => setFormData({...formData, availability: e.target.value})}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none appearance-none"
                            >
                                <option value="online">Online</option>
                                <option value="offline">Offline</option>
                                <option value="busy">Busy</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                         </div>
                    </div>
                  </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
                         <div className="relative">
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({...formData, status: e.target.value})}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none appearance-none"
                            >
                                <option value="active">Active</option>
                                <option value="pending">Pending</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                         </div>
                      </div>
                      
                      <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Verification</label>
                          <label className="flex items-center space-x-3 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-white hover:border-blue-300 transition-all">
                            <input 
                                type="checkbox"
                                checked={formData.verified}
                                onChange={(e) => setFormData({...formData, verified: e.target.checked})}
                                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">Mark as Verified</span>
                          </label>
                      </div>
                   </div>
                </div>
              </div>

              {/* Biography Section */}
              <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-1.5">Biography</label>
                 <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none resize-none"
                  placeholder="Share a brief professional background..."
                />
              </div>

              {/* Security Section */}
              <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                   <h4 className="text-sm font-bold text-gray-800 flex items-center mb-4">
                       <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3 text-blue-600">
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                       </span>
                       Security Credentials
                   </h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                {isEditing ? 'New Password (Optional)' : 'Password *'}
                            </label>
                            <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                            placeholder={isEditing ? "Leave blank to keep current" : "Min. 8 characters"}
                            required={!isEditing}
                            minLength={8}
                            />
                        </div>
                        <div>
                             <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                             <input
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                            placeholder="Re-enter password"
                            required={!isEditing && !!formData.password}
                            />
                        </div>
                   </div>
              </div>

            </div>

            {/* Footer */}
            <div className="px-8 py-5 border-t border-gray-100 bg-gray-50 flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-6 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveLawyer}
                className="px-8 py-2.5 rounded-xl font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all duration-200 transform hover:-translate-y-0.5"
              >
                {isEditing ? 'Save Changes' : 'Create Account'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Lawyer Modal */}
      {showViewModal && selectedLawyer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Lawyer Details</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
                <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                  {selectedLawyer.image ? (
                    <img src={selectedLawyer.image} alt={selectedLawyer.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white font-bold text-2xl">
                        {selectedLawyer.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedLawyer.name}</h2>
                  <p className="text-gray-600">{selectedLawyer.email}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedLawyer.specialization.map((spec, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Experience</h4>
                  <p className="text-2xl font-bold text-blue-600">{selectedLawyer.experience} years</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Cases Handled</h4>
                  <p className="text-2xl font-bold text-green-600">{selectedLawyer.casesHandled}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Rating</h4>
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-2xl font-bold text-yellow-600">{selectedLawyer.rating}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Status Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Account Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(selectedLawyer.status)}`}>
                        {selectedLawyer.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Availability:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityBadge(selectedLawyer.availability)}`}>
                        {selectedLawyer.availability}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Verified:</span>
                      <span className={selectedLawyer.verified ? 'text-green-600' : 'text-red-600'}>
                        {selectedLawyer.verified ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Joined:</span>
                      <span className="text-gray-900">{new Date(selectedLawyer.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Documents ({selectedLawyer.documents.length})</h4>
                  {selectedLawyer.documents.length > 0 ? (
                    <div className="space-y-2">
                      {selectedLawyer.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                            <div className="text-xs text-gray-500">{doc.size}</div>
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
            <div className="p-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
              {!selectedLawyer.verified && (
                <button
                  onClick={() => {
                    handleVerifyLawyer(selectedLawyer.id);
                    setShowViewModal(false);
                  }}
                  className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  Verify Lawyer
                </button>
              )}
              <button
                onClick={() => setShowViewModal(false)}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
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
            setLawyerToDelete(null);
        }}
        onConfirm={confirmDeleteLawyer}
        title="Delete Lawyer"
        message="Are you sure you want to delete this lawyer? This action cannot be undone."
        confirmText="Delete Lawyer"
        isDestructive={true}
      />
    </div>
  );
}
