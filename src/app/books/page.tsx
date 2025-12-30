"use client";

import { useState, useEffect } from 'react';
import PublicHeader from '../../components/public/PublicHeader';
import PublicFooter from '../../components/public/PublicFooter';
import { api } from '../../services/api';
import { Book } from '../../types';
import { Download, Book as BookIcon } from 'lucide-react';
import Link from 'next/link';

export default function PublicBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <main>
        <div className="bg-purple-900 text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Legal Library</h1>
            <p className="text-purple-200 text-lg max-w-2xl mx-auto">
                Explore our collection of legal books and resources to empower yourself with knowledge.
            </p>
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {loading ? (
                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {books.map((book) => (
                        <div key={book.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="h-48 bg-gray-100 flex items-center justify-center relative">
                                {book.cover_image ? (
                                    <img src={book.cover_image} alt={book.title} className="h-full w-full object-cover" />
                                ) : (
                                    <BookIcon className="w-16 h-16 text-gray-400" />
                                )}
                                <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md text-sm font-bold shadow-sm">
                                    ${book.price}
                                </div>
                            </div>
                            <div className="p-6">
                                <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                                    {book.category}
                                </span>
                                <h3 className="text-lg font-bold text-gray-900 mt-3 mb-1 line-clamp-2">{book.title}</h3>
                                <p className="text-sm text-gray-600 mb-4">{book.author}</p>
                                
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <Link href="/user/login" className="block w-full text-center bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">
                                        Sign in to Buy
                                    </Link>
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
