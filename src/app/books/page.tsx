"use client";

import { useState, useEffect } from 'react';
import PublicHeader from '../../components/public/PublicHeader';
import PublicFooter from '../../components/public/PublicFooter';
import { api } from '../../services/api';
import { Book } from '../../types';
import { Download, Book as BookIcon, Star, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useCart } from '../../context/CartContext';


export default function PublicBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const router = useRouter();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const data = await api.getAvailableBooks();
      setBooks(data);
    } catch (error) {
      console.error('Failed to fetch books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (book: Book) => {
      addItem(book);
      router.push('/user/cart');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <PublicHeader />
      <main className="pt-20">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <span className="inline-block px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-xs font-bold uppercase tracking-wider mb-4">
                    Knowledge Base
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                    Premium Legal <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Library</span>
                </h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                    Master legal concepts with our curated collection of expert-written books and resources.
                </p>
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {loading ? (
                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {books.map((book) => (
                        <div key={book.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 flex flex-col h-full">
                            <div className="h-64 bg-gray-100 relative overflow-hidden group-hover:bg-gray-200 transition-colors">
                                {book.cover_image ? (
                                    <img src={book.cover_image} alt={book.title} className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <BookIcon className="w-20 h-20 text-gray-300" />
                                    </div>
                                )}
                                <div className="absolute top-4 right-4">
                                    <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold shadow-sm text-gray-900">
                                        ${book.price}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="mb-4">
                                    <span className="text-xs font-bold text-purple-600 uppercase tracking-wide">
                                        {book.category}
                                    </span>
                                    <h3 className="text-lg font-bold text-gray-900 mt-2 leading-snug line-clamp-2 group-hover:text-purple-600 transition-colors">
                                        {book.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">by {book.author}</p>
                                </div>
                                
                                <div className="mt-auto">
                                    <button 
                                        onClick={() => handleAddToCart(book)}
                                        className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-purple-600 transition-colors shadow-lg shadow-gray-200"
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}

