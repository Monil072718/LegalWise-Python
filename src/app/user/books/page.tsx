"use client";

import { useState, useEffect } from 'react';
import { BookOpen, Star, Download, Search, Filter, Calendar } from 'lucide-react';
import { api } from '../../../services/api';
import { Book } from '../../../types';

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    fetchBooks();
  }, [filterCategory]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await api.getClientBooks(filterCategory === 'all' ? undefined : filterCategory);
      setBooks(data);
    } catch (err: any) {
      // Only show error for actual failures, not empty results
      console.error('Error fetching books:', err);
      // Don't show error to user - they just have no books yet
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = Array.from(new Set(books.map(b => b.category)));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Library</h1>
        <p className="text-gray-500">Your purchased legal books collection</p>
      </div>

      {/* Stats Card */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm font-medium mb-1">Total Books</p>
            <h2 className="text-4xl font-bold">{books.length}</h2>
            <p className="text-purple-100 text-sm mt-2">In your library</p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <BookOpen className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search your library..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        
        {categories.length > 0 && (
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {books.length === 0 ? 'No books in your library' : 'No books found'}
          </h3>
          <p className="text-gray-500">
            {books.length === 0 
              ? 'Purchase books to build your legal reference library'
              : 'Try adjusting your search or filters'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Book Cover */}
              <div className="h-48 bg-gradient-to-br from-purple-500 to-indigo-600 relative overflow-hidden">
                {book.cover_image ? (
                  <img 
                    src={book.cover_image} 
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="w-20 h-20 text-white opacity-50" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                    <Download className="w-3 h-3" />
                    OWNED
                  </span>
                </div>
              </div>

              <div className="p-5">
                {/* Title and Category */}
                <div className="mb-3">
                  <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-2">{book.title}</h3>
                  <p className="text-sm text-gray-600">{book.author}</p>
                  <span className="inline-block mt-2 px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-xs font-medium">
                    {book.category}
                  </span>
                </div>

                {/* Description */}
                {book.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{book.description}</p>
                )}

                {/* Rating and Stats */}
                <div className="flex items-center gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium text-gray-700">{book.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Download className="w-4 h-4" />
                    <span>{book.downloads} downloads</span>
                  </div>
                </div>

                {/* ISBN */}
                {book.isbn && (
                  <p className="text-xs text-gray-500 mb-4">ISBN: {book.isbn}</p>
                )}

                {/* Published Date */}
                <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    Published: {new Date(book.publishedAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Download/Read Button */}
                <button
                  className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all font-semibold shadow-md hover:shadow-lg"
                >
                  <Download className="w-5 h-5" />
                  <span>Read Book</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
