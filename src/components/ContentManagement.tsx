"use client";

import { useState, useEffect } from 'react';
import { Search, Plus, Eye, Edit, Trash2, BookOpen, FileText, Download, Star } from 'lucide-react';
import { Book, Article } from '../types';
import { api } from '../services/api';

export default function ContentManagement() {
  const [activeTab, setActiveTab] = useState<'books' | 'articles'>('books');
  const [books, setBooks] = useState<Book[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksData, articlesData] = await Promise.all([
          api.get<Book[]>('/books'),
          api.get<Article[]>('/articles')
        ]);
        setBooks(booksData);
        setArticles(articlesData);
      } catch (error) {
        console.error('Failed to fetch content:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getArticleStatusBadge = (status: string) => {
    const styles = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-100 text-gray-800'
    };
    return styles[status as keyof typeof styles] || styles.draft;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Content</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Books</p>
              <p className="text-2xl font-bold text-blue-600">{books.length}</p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Downloads</p>
              <p className="text-2xl font-bold text-green-600">
                {books.reduce((sum, book) => sum + book.downloads, 0)}
              </p>
            </div>
            <Download className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Published Articles</p>
              <p className="text-2xl font-bold text-purple-600">
                {articles.filter(a => a.status === 'published').length}
              </p>
            </div>
            <FileText className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-orange-600">
                {articles.reduce((sum, article) => sum + article.views, 0)}
              </p>
            </div>
            <Eye className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('books')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                activeTab === 'books'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Books Management
            </button>
            <button
              onClick={() => setActiveTab('articles')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                activeTab === 'articles'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Articles & Blogs
            </button>
          </nav>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            />
          </div>
        </div>

        {/* Content Tables */}
        <div className="overflow-x-auto">
          {activeTab === 'books' ? (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Book Details</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Author</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Category</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Price</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Downloads</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Rating</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBooks.map((book) => (
                  <tr key={book.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{book.title}</div>
                        <div className="text-sm text-gray-500">
                          Published: {new Date(book.publishedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{book.author}</td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {book.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">${book.price}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Download className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{book.downloads}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{book.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button className="p-1 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200">
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
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Article Details</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Author</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Category</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Views</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Likes</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{article.title}</div>
                        <div className="text-sm text-gray-500">
                          Published: {new Date(article.publishedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{article.author}</td>
                    <td className="px-6 py-4">
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                        {article.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{article.views}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{article.likes}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getArticleStatusBadge(article.status)}`}>
                        {article.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button className="p-1 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}