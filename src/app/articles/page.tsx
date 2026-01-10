"use client";

import { useState, useEffect } from 'react';
import PublicHeader from '../../components/public/PublicHeader';
import PublicFooter from '../../components/public/PublicFooter';
import { api } from '../../services/api';
import { Article } from '../../types';
import { FileText, Eye, ThumbsUp, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';

export default function PublicArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const data = await api.getPublicArticles();
      setArticles(data);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />
      <main className="pt-20">
        <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-4">
                    Latest Updates
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                    Legal <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">Insights</span>
                </h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                    Stay informed with expert analysis, legal news, and in-depth guides from top professionals.
                </p>
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {loading ? (
                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((article) => (
                        <div key={article.id} className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col h-full">
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wide">
                                    {article.category}
                                </span>
                                <div className="flex items-center gap-1 text-gray-400 text-xs">
                                     <Clock className="w-3 h-3" />
                                     <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            
                            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors leading-tight">
                                {article.title}
                            </h3>
                            
                            <p className="text-gray-500 mb-8 line-clamp-3 leading-relaxed flex-1">
                                {article.content ? article.content.substring(0, 150) : "No description available..."}...
                            </p>
                            
                            <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-100">
                                <div className="flex items-center gap-4 text-sm text-gray-400 font-medium">
                                    <div className="flex items-center gap-1.5 hover:text-gray-600 transition-colors">
                                        <Eye className="w-4 h-4" />
                                        <span>{article.views}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 hover:text-gray-600 transition-colors">
                                        <ThumbsUp className="w-4 h-4" />
                                        <span>{article.likes}</span>
                                    </div>
                                </div>

                                {article.link ? (
                                    <a 
                                        href={article.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all"
                                    >
                                        Read More <ArrowRight className="w-4 h-4" />
                                    </a>
                                ) : (
                                    <Link 
                                        href={`/articles/${article.id}`} // Or fallback to login if preferred, but detail view is better
                                        className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all"
                                    >
                                        Read More <ArrowRight className="w-4 h-4" />
                                    </Link>
                                )}
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
