"use client";

import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, X, Upload, Book as BookIcon } from 'lucide-react';
import { Book } from '../types';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import ConfirmationModal from './ConfirmationModal';

export default function BookManagement() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { showToast } = useToast();

  const [formData, setFormData] = useState<Partial<Book>>({
    title: '',
    author: '',
    category: '',
    price: 0,
    quantity: 0,
    description: '',
    isbn: '',
    cover_image: '',
    publishedAt: new Date().toISOString().split('T')[0]
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null as string | null });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const data = await api.getBooks();
      setBooks(data);
    } catch (error) {
      console.error('Failed to fetch books:', error);
      showToast('Failed to fetch books', 'error');
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
    try {
      let imageUrl = formData.cover_image;

      if (selectedImage) {
        const uploadResponse: any = await api.uploadImage(selectedImage);
        imageUrl = uploadResponse.url;
      }

      const bookData = { ...formData, cover_image: imageUrl, price: Number(formData.price), quantity: Number(formData.quantity) };

      if (isEditing && editingId) {
        await api.updateBook(editingId, bookData);
        showToast('Book updated successfully', 'success');
      } else {
        await api.createBook(bookData);
        showToast('Book created successfully', 'success');
      }

      closeModal();
      fetchBooks();
    } catch (error) {
      console.error('Failed to save book:', error);
      showToast('Failed to save book', 'error');
    }
  };

  const handleEdit = (book: Book) => {
    setFormData({
      title: book.title,
      author: book.author,
      category: book.category,
      price: book.price,
      quantity: book.quantity,
      description: book.description || '',
      isbn: book.isbn || '',
      cover_image: book.cover_image || '',
      publishedAt: book.publishedAt
    });
    setEditingId(book.id);
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
      price: 0,
      quantity: 0,
      description: '',
      isbn: '',
      cover_image: '',
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
      await api.deleteBook(deleteModal.id);
      showToast('Book deleted successfully', 'success');
      setBooks(books.filter(b => b.id !== deleteModal.id));
    } catch (error) {
      console.error('Failed to delete book:', error);
      showToast('Failed to delete book', 'error');
    } finally {
      setDeleteModal({ show: false, id: null });
    }
  };

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center p-10">Loading inventory...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Inventory Management - Books</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Book</span>
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
        {filteredBooks.map((book) => (
          <div key={book.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-48 bg-gray-100 relative">
              {book.cover_image ? (
                <img src={book.cover_image} alt={book.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <BookIcon className="w-12 h-12" />
                </div>
              )}
              <div className="absolute top-2 right-2 flex space-x-1">
                <button onClick={() => handleEdit(book)} className="p-1 bg-white rounded-full shadow hover:bg-gray-50">
                   <Edit className="w-4 h-4 text-gray-600" />
                </button>
                <button onClick={() => initiateDelete(book.id)} className="p-1 bg-white rounded-full shadow hover:bg-gray-50">
                   <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg text-gray-900 truncate">{book.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{book.author}</p>
              <div className="flex justify-between items-center text-sm">
                 <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">{book.category}</span>
                 <span className="font-bold text-gray-900">${book.price}</span>
              </div>
              <div className="mt-3 flex justify-between text-xs text-gray-500">
                <span>Qty: {book.quantity}</span>
                <span>Sold: {book.downloads}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">{isEditing ? 'Edit Book' : 'Add New Book'}</h3>
              <button onClick={closeModal}><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-4">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Book Title</label>
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
               <div className="grid grid-cols-3 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input 
                      type="number" 
                      value={formData.price} 
                      onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                      className="w-full border rounded-lg p-2"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input 
                      type="number" 
                      value={formData.quantity} 
                      onChange={e => setFormData({...formData, quantity: Number(e.target.value)})}
                      className="w-full border rounded-lg p-2"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
                    <input 
                      type="text" 
                      value={formData.isbn} 
                      onChange={e => setFormData({...formData, isbn: e.target.value})}
                      className="w-full border rounded-lg p-2"
                    />
                 </div>
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea 
                    rows={3}
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full border rounded-lg p-2"
                  />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
                 <div className="flex items-center space-x-4">
                    <input type="file" onChange={handleImageUpload} className="text-sm" />
                    {formData.cover_image && <img src={formData.cover_image} alt="Preview" className="h-10 w-10 object-cover rounded" />}
                 </div>
               </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button onClick={closeModal} className="px-4 py-2 border rounded-lg">Cancel</button>
              <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save Book</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal 
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, id: null })}
        onConfirm={confirmDelete}
        title="Delete Book"
        message="Are you sure you want to delete this book? This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
      />
    </div>
  );
}
