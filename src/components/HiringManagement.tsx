import { useState } from 'react';
import { Search, Plus, Eye, TrendingUp, Users, Briefcase, Star, Clock, X, Edit, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ExpertCategory {
  id: string;
  name: string;
  lawyersCount: number;
  avgRate: number;
  totalHires: number;
  avgRating: number;
  description: string;
}

interface HiringStats {
  id: string;
  lawyerName: string;
  category: string;
  totalHires: number;
  consultations: number;
  avgRating: number;
  totalEarnings: number;
  responseTime: number;
}

const mockCategories: ExpertCategory[] = [
  {
    id: '1',
    name: 'Criminal Law',
    lawyersCount: 8,
    avgRate: 250,
    totalHires: 67,
    avgRating: 4.7,
    description: 'Defense and prosecution in criminal matters'
  },
  {
    id: '2',
    name: 'Corporate Law',
    lawyersCount: 12,
    avgRate: 350,
    totalHires: 89,
    avgRating: 4.8,
    description: 'Business formation, contracts, and compliance'
  },
  {
    id: '3',
    name: 'Family Law',
    lawyersCount: 6,
    avgRate: 200,
    totalHires: 45,
    avgRating: 4.6,
    description: 'Divorce, custody, and family matters'
  },
  {
    id: '4',
    name: 'Immigration Law',
    lawyersCount: 4,
    avgRate: 300,
    totalHires: 34,
    avgRating: 4.9,
    description: 'Visa, citizenship, and immigration services'
  },
  {
    id: '5',
    name: 'Personal Injury',
    lawyersCount: 5,
    avgRate: 400,
    totalHires: 23,
    avgRating: 4.5,
    description: 'Accident and injury compensation claims'
  }
];

const mockHiringStats: HiringStats[] = [
  {
    id: '1',
    lawyerName: 'Sarah Johnson',
    category: 'Criminal Law',
    totalHires: 23,
    consultations: 45,
    avgRating: 4.8,
    totalEarnings: 11500,
    responseTime: 2.1
  },
  {
    id: '2',
    lawyerName: 'Michael Chen',
    category: 'Corporate Law',
    totalHires: 31,
    consultations: 67,
    avgRating: 4.9,
    totalEarnings: 15750,
    responseTime: 1.8
  },
  {
    id: '3',
    lawyerName: 'Emily Rodriguez',
    category: 'Immigration Law',
    totalHires: 18,
    consultations: 34,
    avgRating: 4.6,
    totalEarnings: 9200,
    responseTime: 3.2
  },
  {
    id: '4',
    lawyerName: 'David Wilson',
    category: 'Family Law',
    totalHires: 26,
    consultations: 52,
    avgRating: 4.7,
    totalEarnings: 13200,
    responseTime: 2.5
  }
];

const categoryDistribution = [
  { name: 'Corporate Law', value: 35, color: '#3B82F6' },
  { name: 'Criminal Law', value: 28, color: '#10B981' },
  { name: 'Family Law', value: 18, color: '#F59E0B' },
  { name: 'Immigration Law', value: 12, color: '#8B5CF6' },
  { name: 'Personal Injury', value: 7, color: '#EF4444' }
];

export default function HiringManagement() {
  const [activeTab, setActiveTab] = useState<'categories' | 'stats'>('categories');
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<ExpertCategory[]>(mockCategories);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ExpertCategory | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    avgRate: ''
  });

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStats = mockHiringStats.filter(stat =>
    stat.lawyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stat.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCategory = () => {
    const newCategory: ExpertCategory = {
      id: (categories.length + 1).toString(),
      name: formData.name,
      description: formData.description,
      avgRate: parseInt(formData.avgRate) || 0,
      lawyersCount: 0,
      totalHires: 0,
      avgRating: 0
    };

    setCategories([...categories, newCategory]);
    setFormData({ name: '', description: '', avgRate: '' });
    setShowAddCategoryModal(false);
  };

  const handleViewCategory = (category: ExpertCategory) => {
    setSelectedCategory(category);
    setShowViewModal(true);
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Hire Management</h1>
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
                {categories.reduce((sum, cat) => sum + cat.totalHires, 0)}
              </p>
              <p className="text-sm text-green-600 mt-1">+18% this month</p>
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
              <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-bold text-purple-600">2.4h</p>
              <p className="text-sm text-gray-500 mt-1">Consultation response</p>
            </div>
            <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Platform Rating</p>
              <p className="text-2xl font-bold text-orange-600">4.7</p>
              <p className="text-sm text-gray-500 mt-1">Average rating</p>
            </div>
            <Star className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Category Distribution Chart */}
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
                <span className="text-sm text-gray-600">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Hiring Trends</h3>
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

      {/* Tabs */}
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

        {/* Search */}
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

        {/* Content */}
        <div className="overflow-x-auto">
          {activeTab === 'categories' ? (
            <>
              {/* Mobile View for Categories */}
              <div className="block lg:hidden">
                <div className="divide-y divide-gray-200">
                  {filteredCategories.map((category) => (
                    <div key={category.id} className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{category.name}</div>
                          <div className="text-sm text-gray-500 mt-1">{category.description}</div>
                        </div>
                        <div className="flex space-x-1">
                          <button 
                            onClick={() => handleViewCategory(category)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteCategory(category.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Lawyers:</span>
                          <div className="font-medium">{category.lawyersCount}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Avg Rate:</span>
                          <div className="font-medium">${category.avgRate}/hr</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Total Hires:</span>
                          <div className="font-medium">{category.totalHires}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Rating:</span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="font-medium">{category.avgRating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop View for Categories */}
              <div className="hidden lg:block">
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
                            <span className="text-sm text-gray-900">{category.lawyersCount}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          ${category.avgRate}/hr
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-900">{category.totalHires}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{category.avgRating}</span>
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
                              onClick={() => handleDeleteCategory(category.id)}
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
            </>
          ) : (
            <>
              {/* Mobile View for Stats */}
              <div className="block lg:hidden">
                <div className="divide-y divide-gray-200">
                  {filteredStats.map((stat) => (
                    <div key={stat.id} className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {stat.lawyerName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{stat.lawyerName}</div>
                            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                              {stat.category}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Total Hires:</span>
                          <div className="font-medium">{stat.totalHires}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Consultations:</span>
                          <div className="font-medium">{stat.consultations}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Earnings:</span>
                          <div className="font-medium text-green-600">${stat.totalEarnings.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Response Time:</span>
                          <div className="font-medium">{stat.responseTime}h</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{stat.avgRating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop View for Stats */}
              <div className="hidden lg:block">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Lawyer</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Category</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Total Hires</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Consultations</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Rating</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Earnings</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Response Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredStats.map((stat) => (
                      <tr key={stat.id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-medium">
                                {stat.lawyerName.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div className="font-medium text-gray-900">{stat.lawyerName}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                            {stat.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Briefcase className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900">{stat.totalHires}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{stat.consultations}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{stat.avgRating}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-green-600">
                          ${stat.totalEarnings.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{stat.responseTime}h</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
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
                  value={formData.avgRate}
                  onChange={(e) => setFormData({...formData, avgRate: e.target.value})}
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
                  <p className="text-2xl font-bold text-blue-600">{selectedCategory.lawyersCount}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Average Rate</h4>
                  <p className="text-2xl font-bold text-green-600">${selectedCategory.avgRate}/hr</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Total Hires</h4>
                  <p className="text-2xl font-bold text-purple-600">{selectedCategory.totalHires}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Average Rating</h4>
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-2xl font-bold text-orange-600">{selectedCategory.avgRating}</span>
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
    </div>
  );
}