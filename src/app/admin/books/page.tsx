'use client';

import { useState, useEffect } from 'react';
import { 
    BookOpen, 
    Plus, 
    Search, 
    Edit2, 
    Trash2, 
    X, 
    Save, 
    Image as ImageIcon,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { api } from '../../../services/api';
import { Book } from '../../../types';
import { useToast } from '../../../context/ToastContext';

export default function BookInventory() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentBook, setCurrentBook] = useState<Partial<Book>>({});
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Toast context would ideally be used here, but using alert for simplicity if not available
    // Assuming a useToast exists based on previous files, or I'll implement a basic fallback
    const { showToast } = useToast() || { showToast: (msg: string, type: string) => alert(`${type}: ${msg}`) };

    const categories = ['Business Law', 'Criminal Law', 'Family Law', 'Constitutional Law', 'Intellectual Property', 'Civil Rights', 'Environmental Law', 'General'];

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const data = await api.getAdminBooks();
            setBooks(data);
        } catch (error) {
            console.error('Failed to fetch books:', error);
            showToast('Failed to load books table', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (book?: Book) => {
        if (book) {
            setCurrentBook(book);
            setIsEditing(true);
        } else {
            setCurrentBook({
                title: '',
                author: '',
                category: 'General',
                price: 0,
                quantity: 0,
                description: '',
                cover_image: '',
                rating: 0,
                downloads: 0
            });
            setIsEditing(false);
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!currentBook.title?.trim() || !currentBook.author?.trim()) {
            showToast('Please fill in Book Title and Author', 'error');
            // Scroll to top of form
            const formContainer = document.querySelector('.overflow-y-auto');
            if (formContainer) formContainer.scrollTop = 0;
            return;
        }

        setIsSubmitting(true);

        try {
            if (isEditing && currentBook.id) {
                await api.updateBook(currentBook.id, currentBook);
                showToast('Book updated successfully', 'success');
            } else {
                await api.createBook(currentBook);
                showToast('Book created successfully', 'success');
            }
            fetchBooks();
            setIsModalOpen(false);
        } catch (error: any) {
            console.error('Failed to save book:', error);
            showToast(error.message || 'Failed to save book', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this book?')) return;
        
        try {
            await api.deleteBook(id);
            showToast('Book deleted successfully', 'success');
            fetchBooks();
        } catch (error) {
            console.error('Failed to delete book:', error);
            showToast('Failed to delete book', 'error');
        }
    };

    const filteredBooks = books.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <BookOpen className="w-8 h-8 text-blue-600" />
                    Book Inventory
                </h1>
                <button 
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Add New Book
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search books by title or author..." 
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="text-sm text-gray-500 font-medium">
                        Total Books: {filteredBooks.length}
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-100 text-gray-900 uppercase font-semibold text-xs border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4">Book</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Stock</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-20">
                                        <div className="flex flex-col items-center justify-center">
                                            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
                                            <p className="text-gray-500">Loading library...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredBooks.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-20">
                                        <div className="flex flex-col items-center justify-center">
                                            <BookOpen className="w-12 h-12 text-gray-300 mb-2" />
                                            <p className="text-gray-500 text-lg">No books found</p>
                                            <p className="text-gray-400 text-sm">Add a new book to get started</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredBooks.map((book) => (
                                    <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-14 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                                                    {book.cover_image ? (
                                                        <img src={book.cover_image} alt={book.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
                                                            <ImageIcon className="w-4 h-4" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900">{book.title}</div>
                                                    <div className="text-xs text-gray-500">{book.author}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {book.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            ${book.price}
                                        </td>
                                        <td className="px-6 py-4">
                                            {book.quantity}
                                        </td>
                                        <td className="px-6 py-4">
                                            {book.quantity > 0 ? (
                                                <span className="text-green-600 font-medium text-xs flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span> In Stock
                                                </span>
                                            ) : (
                                                <span className="text-red-500 font-medium text-xs flex items-center gap-1">
                                                     <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Out of Stock
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => handleOpenModal(book)}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                    title="Edit Book"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(book.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                    title="Delete Book"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold text-gray-900">
                                {isEditing ? 'Edit Book' : 'Add new Book'}
                            </h2>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Title and Author Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Book Title <span className="text-red-500">*</span></label>
                                    <input 
                                        type="text" 
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="e.g. Legal Ethics 101"
                                        value={currentBook.title || ''}
                                        onChange={e => setCurrentBook({...currentBook, title: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Author <span className="text-red-500">*</span></label>
                                    <input 
                                        type="text" 
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="e.g. John Doe"
                                        value={currentBook.author || ''}
                                        onChange={e => setCurrentBook({...currentBook, author: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Category</label>
                                    <select 
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                                        value={currentBook.category}
                                        onChange={e => setCurrentBook({...currentBook, category: e.target.value})}
                                    >
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Price ($)</label>
                                    <input 
                                        type="number" 
                                        min="0"
                                        step="0.01"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        value={currentBook.price}
                                        onChange={e => setCurrentBook({...currentBook, price: parseFloat(e.target.value)})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Quantity (Stock)</label>
                                    <input 
                                        type="number" 
                                        min="0"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        value={currentBook.quantity}
                                        onChange={e => setCurrentBook({...currentBook, quantity: parseInt(e.target.value)})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Cover Image</label>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex gap-2 items-center">
                                            <label className="flex-1 flex items-center justify-center px-4 py-3 bg-gray-50 border border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-100 transition group">
                                                <div className="flex items-center gap-2 text-gray-600 group-hover:text-blue-600">
                                                    <div className="p-2 bg-white rounded-full shadow-sm">
                                                        <ImageIcon className="w-5 h-5" />
                                                    </div>
                                                    <span className="text-sm font-medium">Click to Upload Image</span>
                                                </div>
                                                <input 
                                                    type="file" 
                                                    className="hidden" 
                                                    accept="image/*"
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (!file) return;
                                                        
                                                        try {
                                                            showToast('Uploading image...', 'info');
                                                            const response = await api.uploadImage(file);
                                                            if (response.url) {
                                                                setCurrentBook(prev => ({ ...prev, cover_image: response.url }));
                                                                showToast('Image uploaded!', 'success');
                                                            }
                                                        } catch (error) {
                                                            console.error("Upload failed", error);
                                                            showToast('Failed to upload image', 'error');
                                                        }
                                                    }}
                                                />
                                            </label>
                                        </div>
                                        {currentBook.cover_image && (
                                            <div className="w-24 h-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 mt-2 relative group-hover:shadow-md transition">
                                                <img src={currentBook.cover_image} alt="Preview" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-400">Upload a cover image for the book.</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Description</label>
                                <textarea 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 resize-none transition-all"
                                    placeholder="Brief summary of the book content..."
                                    value={currentBook.description || ''}
                                    onChange={e => setCurrentBook({...currentBook, description: e.target.value})}
                                ></textarea>
                            </div>

                            <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                                <button 
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2.5 rounded-xl text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-200"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            {isEditing ? 'Update Book' : 'Create Book'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
