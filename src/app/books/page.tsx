"use client";

import { useState, useEffect } from 'react';
import PublicHeader from '../../components/public/PublicHeader';
import PublicFooter from '../../components/public/PublicFooter';
import { api } from '../../services/api';
import { Book } from '../../types';
import { Book as BookIcon, Star, ShoppingCart, Search, Filter, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { motion } from 'framer-motion';

export default function PublicBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorDetails, setErrorDetails] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { addItem } = useCart();
  const router = useRouter();

  // Mock categories for filter (in a real app, fetch these)
  const categories = ['All', 'Business Law', 'Criminal Law', 'Family Law', 'Constitutional Law', 'Intellectual Property'];

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const data = await api.getAvailableBooks();
      setBooks(data);
      setErrorDetails('');
    } catch (error: any) {
      console.error('Failed to fetch books:', error);
      setErrorDetails(error.message || String(error));
      setBooks([]); 
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (book: Book) => {
      addItem(book);
      router.push('/user/cart');
  };

  // Filter books
  const filteredBooks = books.filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            book.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
      return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-purple-100 selection:text-purple-900">
      <PublicHeader />
      
      {/* Hero Section */}
      <div className="relative bg-gray-900 pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507842217121-9e96e4763426?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-transparent to-gray-900/50"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
                    <Star className="w-3 h-3 text-purple-400" fill="currentColor" /> Premium Resources
                </span>
                <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight">
                    Legal <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Knowledge Base</span>
                </h1>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-10">
                    Empower yourself with expert-written legal guides, case studies, and reference materials tailored for professionals and individuals alike.
                </p>
            </motion.div>

            {/* Search Bar - Floating */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="max-w-xl mx-auto relative"
            >
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-11 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl leading-5 text-white placeholder-gray-400 focus:outline-none focus:bg-white/20 focus:ring-2 focus:ring-purple-500/50 backdrop-blur-md transition-all shadow-xl"
                    placeholder="Search for books, authors, or topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </motion.div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-10 relative z-20">
        
        {/* Category Filter Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category, idx) => (
                <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 shadow-sm ${
                        selectedCategory === category
                            ? 'bg-purple-600 text-white shadow-purple-500/30 ring-2 ring-purple-600 ring-offset-2'
                            : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-purple-600 border border-gray-100'
                    }`}
                >
                    {category}
                </button>
            ))}
        </div>

        {/* Content */}
        {loading ? (
             <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-medium">Loading library...</p>
            </div>
        ) : filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredBooks.map((book, index) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        key={book.id} 
                        className="group bg-white rounded-2xl overflow-hidden shadow-lg shadow-gray-200/50 border border-gray-100 flex flex-col h-full hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2 transition-all duration-500"
                    >
                        {/* Book Cover */}
                        <div className="h-72 bg-gray-100 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />
                            {book.cover_image ? (
                                <img src={book.cover_image} alt={book.title} className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 group-hover:bg-purple-50 transition-colors">
                                    <BookIcon className="w-16 h-16 text-slate-300 group-hover:text-purple-300 transition-colors mb-2" />
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">No Cover</span>
                                </div>
                            )}
                            
                            {/* Price Tag */}
                            <div className="absolute top-4 right-4 z-20">
                                <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-gray-900 font-extrabold text-sm shadow-lg">
                                    ${book.price}
                                </span>
                            </div>

                            {/* Category Tag */}
                            <div className="absolute bottom-4 left-4 z-20">
                                <span className="inline-block px-3 py-1 rounded-lg bg-black/50 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider border border-white/10">
                                    {book.category || 'General'}
                                </span>
                            </div>
                        </div>
                        
                        {/* Book Details */}
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="mb-4 flex-1">
                                <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-purple-600 transition-colors line-clamp-2">
                                    {book.title}
                                </h3>
                                <p className="text-sm text-gray-500 font-medium mb-3 flex items-center gap-2">
                                    <span className="w-6 h-0.5 bg-purple-200 rounded-full"></span>
                                    {book.author}
                                </p>
                                <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                                    {book.description || "A comprehensive legal resource tailored for professionals. Enhance your understanding of this subject."}
                                </p>
                            </div>
                            
                            <div className="pt-4 border-t border-gray-50 mt-auto">
                                <button 
                                    onClick={() => handleAddToCart(book)}
                                    className="w-full group/btn relative flex items-center justify-center gap-2 bg-gray-900 text-white py-3.5 rounded-xl font-bold overflow-hidden transition-all duration-300 hover:bg-purple-600 hover:shadow-lg hover:shadow-purple-500/40"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        Add to Cart <ShoppingCart className="w-4 h-4" />
                                    </span>
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        ) : (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100 border-dashed">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <BookIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No books found</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                    We couldn't find any books matching your criteria. Try adjusting your search or category filter.
                </p>
                {/* Database Warning for Demo */}
                <div className="mt-8 p-4 bg-red-50 text-red-700 rounded-xl inline-block text-left max-w-lg border border-red-100">
                    <p className="font-bold flex items-center gap-2 mb-1">
                         ⚠️ Connection Error
                    </p>
                    <p className="text-sm opacity-90 mb-2">
                        If you are seeing this message, the backend is likely unreachable or returning an error.
                    </p>
                    {errorDetails && (
                        <div className="bg-red-100 p-3 rounded-lg border border-red-200 overflow-x-auto">
                            <p className="text-xs font-mono font-bold break-all text-red-800">
                                {errorDetails}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        )}
      </main>
      <PublicFooter />
    </div>
  );
}
