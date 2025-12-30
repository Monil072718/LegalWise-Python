"use client";

import { useState, useEffect } from 'react';
import PublicHeader from '../../components/public/PublicHeader';
import PublicFooter from '../../components/public/PublicFooter';
import { api } from '../../services/api';
import { Article } from '../../types';
import { FileText, Eye, ThumbsUp } from 'lucide-react';
import Link from 'next/link';

export default function PublicArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const data = await api.getArticles();
      setArticles(data);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <main>
        <div className="bg-indigo-900 text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Legal Insights</h1>
            <p className="text-indigo-200 text-lg max-w-2xl mx-auto">
                Stay informed with the latest legal articles, news, and guides.
            </p>
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {loading ? (
                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((article) => (
                        <div key={article.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                                    {article.category}
                                </span>
                                <span className="text-xs text-gray-500">{new Date(article.publishedAt).toLocaleDateString()}</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{article.title}</h3>
                            <p className="text-sm text-gray-600 mb-4">By {article.author}</p>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                                <div className="flex items-center gap-1">
                                    <Eye className="w-4 h-4" />
                                    <span>{article.views}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <ThumbsUp className="w-4 h-4" />
                                    <span>{article.likes}</span>
                                </div>
                            </div>

                            <Link 
                                href="/user/login"
                                className="inline-flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700"
                            >
                                Read Article ->
                            </Link>
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
