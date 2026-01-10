"use client";

import { useState, useEffect } from 'react';
import { FileText, Eye, Heart, Search, Filter, Calendar, User, AlertCircle, X } from 'lucide-react';
import { api } from '../../../services/api';
import { Article } from '../../../types';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [liking, setLiking] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles();
  }, [filterCategory]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const data = await api.getClientArticles(filterCategory === 'all' ? undefined : filterCategory);
      setArticles(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const handleReadArticle = async (articleId: string) => {
    try {
      const article = await api.getClientArticle(articleId);
      setSelectedArticle(article);
    } catch (err: any) {
      alert(err.message || 'Failed to load article');
    }
  };

  const handleLike = async (articleId: string) => {
    try {
      setLiking(articleId);
      const result = await api.likeClientArticle(articleId);
      
      // Update the article in the list
      setArticles(prev => prev.map(a => 
        a.id === articleId ? { ...a, likes: result.likes } : a
      ));
      
      // Update selected article if open
      if (selectedArticle?.id === articleId) {
        setSelectedArticle(prev => prev ? { ...prev, likes: result.likes } : null);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to like article');
    } finally {
      setLiking(null);
    }
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = Array.from(new Set(articles.map(a => a.category)));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Legal Articles</h1>
          <p className="text-gray-500">Read insightful articles on various legal topics</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-500">
              {searchQuery || filterCategory !== 'all'
                ? 'Try adjusting your filters'
                : 'No articles are available at this time'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
              >
                {/* Article Image */}
                <div className="h-48 bg-gradient-to-br from-purple-500 to-pink-600 relative overflow-hidden">
                  {article.image ? (
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="w-20 h-20 text-white opacity-50" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 bg-white text-gray-700 rounded-full text-xs font-medium shadow-lg">
                      {article.category}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  {/* Title */}
                  <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">
                    {article.title}
                  </h3>

                  {/* Author and Date */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Eye className="w-4 h-4" />
                      <span>{article.views} views</span>
                    </div>
                    <div className="flex items-center gap-1 text-red-600">
                      <Heart className="w-4 h-4 fill-red-600" />
                      <span>{article.likes} likes</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleReadArticle(article.id)}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Read More
                    </button>
                    <button
                      onClick={() => handleLike(article.id)}
                      disabled={liking === article.id}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      {liking === article.id ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                      ) : (
                        <Heart className="w-5 h-5 text-red-600" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedArticle.title}</h2>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{selectedArticle.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(selectedArticle.publishedAt).toLocaleDateString()}</span>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium">
                    {selectedArticle.category}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {selectedArticle.image && (
                <img 
                  src={selectedArticle.image} 
                  alt={selectedArticle.title}
                  className="w-full h-64 object-cover rounded-xl mb-6"
                />
              )}
              
              <div className="prose max-w-none">
                {selectedArticle.content ? (
                  <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selectedArticle.content}
                  </div>
                ) : (
                  <p className="text-gray-500">No content available for this article.</p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-gray-600">
                  <Eye className="w-4 h-4" />
                  <span>{selectedArticle.views} views</span>
                </div>
                <div className="flex items-center gap-1 text-red-600">
                  <Heart className="w-4 h-4 fill-red-600" />
                  <span>{selectedArticle.likes} likes</span>
                </div>
              </div>
              <button
                onClick={() => handleLike(selectedArticle.id)}
                disabled={liking === selectedArticle.id}
                className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                <Heart className="w-5 h-5" />
                {liking === selectedArticle.id ? 'Liking...' : 'Like'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
