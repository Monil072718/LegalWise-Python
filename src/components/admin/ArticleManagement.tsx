"use client";

import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, X, Upload, FileText } from 'lucide-react';
import { Article } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import ConfirmationModal from '../common/ConfirmationModal';

export default function ArticleManagement() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { showToast } = useToast();

  const [formData, setFormData] = useState<Partial<Article>>({
    title: '',
    author: '',
    category: '',
    status: 'draft',
    content: '',
    image: '',
    link: '',
    publishedAt: new Date().toISOString().split('T')[0]
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null as string | null });

  const [importUrl, setImportUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = async () => {
    if (!importUrl) return;
    setIsImporting(true);
    try {
        const data = await api.scrapeArticle(importUrl);
        setFormData({
            ...formData,
            title: data.title,
            content: data.description,
            image: data.image,
            link: importUrl // Auto-fill link with the imported URL
        });
        showToast('Article imported successfully!', 'success');
    } catch (error) {
        console.error('Import failed:', error);
        showToast('Failed to import article', 'error');
    } finally {
        setIsImporting(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const data = await api.getArticles();
      setArticles(data);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      showToast('Failed to fetch articles', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.title || !formData.author || !formData.category) {
        showToast('Please fill in all required fields (Title, Author, Category)', 'error');
        return;
    }

    try {
      let imageUrl = formData.image;

      if (selectedImage) {
        const uploadResponse: any = await api.uploadImage(selectedImage);
        imageUrl = uploadResponse.url;
      }

      const articleData = { ...formData, image: imageUrl };

      if (isEditing && editingId) {
        await api.updateArticle(editingId, articleData);
        showToast('Article updated successfully', 'success');
      } else {
        await api.createArticle(articleData);
        showToast('Article created successfully', 'success');
      }

      closeModal();
      fetchArticles();
    } catch (error) {
      console.error('Failed to save article:', error);
      showToast('Failed to save article', 'error');
    }
  };

  const handleEdit = (article: Article) => {
    setFormData({
      title: article.title,
      author: article.author,
      category: article.category,
      status: article.status,
      content: article.content || '',
      image: article.image || '',
      publishedAt: article.publishedAt
    });
    setEditingId(article.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      title: '',
      author: '',
      category: '',
      status: 'draft',
      content: '',
      image: '',
      publishedAt: new Date().toISOString().split('T')[0]
    });
    setSelectedImage(null);
  };

  const initiateDelete = (id: string) => {
    setDeleteModal({ show: true, id });
  };

  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    try {
      await api.deleteArticle(deleteModal.id);
      showToast('Article deleted successfully', 'success');
      setArticles(articles.filter(a => a.id !== deleteModal.id));
    } catch (error) {
      console.error('Failed to delete article:', error);
      showToast('Failed to delete article', 'error');
    } finally {
      setDeleteModal({ show: false, id: null });
    }
  };

  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
      const styles = {
          'published': 'bg-green-100 text-green-800',
          'draft': 'bg-gray-100 text-gray-800',
          'archived': 'bg-red-100 text-red-800'
      };
      return styles[status as keyof typeof styles] || styles['draft'];
  };

  if (loading) return <div className="text-center p-10">Loading articles...</div>;



  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Article Management</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Article</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full max-w-md focus:ring-2 focus:ring-blue-500 hover:border-blue-400 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <div key={article.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-48 bg-gray-100 relative">
              {article.image ? (
                <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <FileText className="w-12 h-12" />
                </div>
              )}
              <div className="absolute top-2 right-2 flex space-x-1">
                <button onClick={() => handleEdit(article)} className="p-1 bg-white rounded-full shadow hover:bg-gray-50">
                   <Edit className="w-4 h-4 text-gray-600" />
                </button>
                <button onClick={() => initiateDelete(article.id)} className="p-1 bg-white rounded-full shadow hover:bg-gray-50">
                   <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg text-gray-900 truncate">{article.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{article.author}</p>
              <div className="flex justify-between items-center text-sm">
                 <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs">{article.category}</span>
                 <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(article.status)}`}>{article.status}</span>
              </div>
              <div className="mt-3 flex justify-between text-xs text-gray-500">
                <span>Views: {article.views}</span>
                <span>Likes: {article.likes}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">{isEditing ? 'Edit Article' : 'Add New Article'}</h3>
              <button onClick={closeModal}><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-4">
               {!isEditing && (
               <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                 <label className="block text-sm font-medium text-blue-800 mb-2">Import from URL</label>
                 <div className="flex space-x-2">
                    <input 
                        type="text" 
                        placeholder="Paste article URL here..."
                        value={importUrl}
                        onChange={(e) => setImportUrl(e.target.value)}
                        className="flex-1 border border-blue-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                    <button 
                        onClick={handleImport}
                        disabled={isImporting || !importUrl}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isImporting ? 'Fetching...' : 'Fetch'}
                    </button>
                 </div>
                 <p className="text-xs text-blue-600 mt-1">Found content will auto-fill the form below.</p>
               </div>
               )}

               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Article Title</label>
                  <input 
                    type="text" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full border rounded-lg p-2"
                  />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                    <input 
                      type="text" 
                      value={formData.author} 
                      onChange={e => setFormData({...formData, author: e.target.value})}
                      className="w-full border rounded-lg p-2"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input 
                      type="text" 
                      value={formData.category} 
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full border rounded-lg p-2"
                    />
                 </div>
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select 
                     value={formData.status} 
                     onChange={e => setFormData({...formData, status: e.target.value as any})}
                     className="w-full border rounded-lg p-2"
                  >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                  </select>
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source URL (Read More Link)</label>
                  <input 
                    type="text" 
                    value={formData.link || ''} 
                    onChange={e => setFormData({...formData, link: e.target.value})}
                    placeholder="https://example.com/article"
                    className="w-full border rounded-lg p-2"
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                  <textarea 
                    rows={8}
                    value={formData.content} 
                    onChange={e => setFormData({...formData, content: e.target.value})}
                    className="w-full border rounded-lg p-2 font-mono text-sm"
                    placeholder="Markdown or HTML content..."
                  />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
                 <div className="flex items-center space-x-4">
                    <input type="file" onChange={handleImageUpload} className="text-sm" />
                    {formData.image && <img src={formData.image} alt="Preview" className="h-10 w-10 object-cover rounded" />}
                 </div>
               </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button onClick={closeModal} className="px-4 py-2 border rounded-lg">Cancel</button>
              <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save Article</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal 
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, id: null })}
        onConfirm={confirmDelete}
        title="Delete Article"
        message="Are you sure you want to delete this article? This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
      />
    </div>
  );
}
