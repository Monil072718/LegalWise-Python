"use client";

import { useState, useEffect } from 'react';
import { Search, Plus, Eye, TrendingUp, Users, Briefcase, Star, Clock, X, Edit, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Category, Lawyer } from '../types';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import ConfirmationModal from './ConfirmationModal';

export default function HiringManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'categories' | 'stats'>('categories');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    avg_rate: ''
  });

  const [deleteModal, setDeleteModal] = useState({ show: false, id: null as string | null });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesData, lawyersData] = await Promise.all([
        api.getCategories(),
        api.getLawyers()
      ]);
      setCategories(categoriesData);
      setLawyers(lawyersData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      showToast('Failed to fetch data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    try {
        await api.createCategory({
            name: formData.name,
            description: formData.description,
            avg_rate: parseFloat(formData.avg_rate) || 0
        });
        showToast('Category added successfully', 'success');
        fetchData();
        setShowAddCategoryModal(false);
        setFormData({ name: '', description: '', avg_rate: '' });
    } catch (error) {
        console.error('Failed to create category:', error);
        showToast('Failed to create category', 'error');
    }
  };

  const initiateDelete = (id: string) => {
      setDeleteModal({ show: true, id });
  };

  const confirmDelete = async () => {
      if (!deleteModal.id) return;
      try {
          await api.deleteCategory(deleteModal.id);
          showToast('Category deleted successfully', 'success');
          setCategories(categories.filter(c => c.id !== deleteModal.id));
      } catch (error) {
          console.error('Failed to delete category:', error);
          showToast('Failed to delete category', 'error');
      } finally {
          setDeleteModal({ show: false, id: null });
      }
  };

  const handleViewCategory = (category: Category) => {
    setSelectedCategory(category);
    setShowViewModal(true);
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLawyers = lawyers.filter(lawyer => 
    lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (lawyer.specialization && lawyer.specialization.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  // Prepare chart data from real categories
  const categoryDistribution = categories.map((cat, index) => ({
      name: cat.name,
      value: cat.total_hires || 1, // Fallback for visualization
      color: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'][index % 5]
  }));

  if (loading) return <div className="p-10 text-center">Loading data...</div>;

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Service Category Management</h1>
        <button 
          onClick={() => setShowAddCategoryModal(true)}
          className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Hires</p>
              <p className="text-2xl font-bold text-blue-600">
                {categories.reduce((sum, cat) => sum + (cat.total_hires || 0), 0)}
              </p>
              <p className="text-sm text-green-600 mt-1">Platform wide</p>
            </div>
            <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Categories</p>
              <p className="text-2xl font-bold text-green-600">{categories.length}</p>
              <p className="text-sm text-gray-500 mt-1">Legal specializations</p>
            </div>
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Lawyers</p>
              <p className="text-2xl font-bold text-purple-600">{lawyers.filter(l => l.verified).length}</p>
              <p className="text-sm text-gray-500 mt-1">Verified experts</p>
            </div>
            <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-orange-600">
                {(lawyers.reduce((acc, l) => acc + l.rating, 0) / (lawyers.length || 1)).toFixed(1)}
              </p>
              <p className="text-sm text-gray-500 mt-1">Platform average</p>
            </div>
            <Star className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
          </div>
        </div>
      </div>
      
       {/* Charts Section */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hiring Distribution by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                dataKey="value"
              >
                {categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {categoryDistribution.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Hiring Trends (Projected)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { month: 'Jan', hires: 45 },
              { month: 'Feb', hires: 52 },
              { month: 'Mar', hires: 48 },
              { month: 'Apr', hires: 61 },
              { month: 'May', hires: 55 },
              { month: 'Jun', hires: 67 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="hires" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabs & Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-4 sm:px-6">
            <button
              onClick={() => setActiveTab('categories')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                activeTab === 'categories'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Expert Categories
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                activeTab === 'stats'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Hiring Statistics
            </button>
          </nav>
        </div>

        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab === 'categories' ? 'categories' : 'lawyers'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
             {activeTab === 'categories' ? (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Category</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Lawyers</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Avg Rate</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Total Hires</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Rating</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredCategories.map((category) => (
                      <tr key={category.id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">{category.name}</div>
                            <div className="text-sm text-gray-500 max-w-xs">{category.description}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{category.lawyers_count}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          ${category.avg_rate}/hr
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-900">{category.total_hires}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{category.avg_rating}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleViewCategory(category)}
                              className="p-1 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => initiateDelete(category.id)}
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
             ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Lawyer</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Specialization</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Cases Handled</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Experience</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Rating</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredLawyers.map((lawyer) => (
                      <tr key={lawyer.id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-medium">
                                {lawyer.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div className="font-medium text-gray-900">{lawyer.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                                {lawyer.specialization && lawyer.specialization.map((spec, i) => (
                                    <span key={i} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                                        {spec}
                                    </span>
                                ))}
                            </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Briefcase className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900">{lawyer.casesHandled}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{lawyer.experience} Years</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{lawyer.rating}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                lawyer.status === 'active' ? 'bg-green-100 text-green-800' : 
                                lawyer.status === 'verified' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                                {lawyer.status.toUpperCase()}
                            </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             )}
        </div>
      </div>

       {/* Add Category Modal */}
       {showAddCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Add New Category</h3>
              <button
                onClick={() => setShowAddCategoryModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Environmental Law"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Average Rate ($/hour)</label>
                <input
                  type="number"
                  value={formData.avg_rate}
                  onChange={(e) => setFormData({...formData, avg_rate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="250"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description of this legal category..."
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => setShowAddCategoryModal(false)}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Category Modal */}
      {showViewModal && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Category Details</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedCategory.name}</h2>
                <p className="text-gray-600 mt-2">{selectedCategory.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Active Lawyers</h4>
                  <p className="text-2xl font-bold text-blue-600">{selectedCategory.lawyers_count}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Average Rate</h4>
                  <p className="text-2xl font-bold text-green-600">${selectedCategory.avg_rate}/hr</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Total Hires</h4>
                  <p className="text-2xl font-bold text-purple-600">{selectedCategory.total_hires}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Average Rating</h4>
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-2xl font-bold text-orange-600">{selectedCategory.avg_rating}</span>
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

      <ConfirmationModal 
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, id: null })}
        onConfirm={confirmDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
      />
    </div>
  );
}