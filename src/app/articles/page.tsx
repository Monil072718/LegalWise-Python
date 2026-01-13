"use client";

import { getImageUrl } from '../../utils/image';

import { useState, useEffect } from 'react';
import PublicHeader from '../../components/public/PublicHeader';
import PublicFooter from '../../components/public/PublicFooter';
import { api } from '../../services/api';
import { Article } from '../../types';
import { FileText, Eye, ThumbsUp, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';

export default function PublicArticlesPage() {
  const handleReadMore = async (articleId: string, link: string | undefined) => {
    // Optimistic update
    setArticles(prev => prev.map(a => 
      a.id === articleId ? { ...a, views: a.views + 1 } : a
    ));
    
    // Call backend
    try {
        await api.incrementArticleView(articleId);
    } catch (e) {
        console.error("Failed to increment view", e);
    }

    // Navigate/Open
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
        // Since we are using Next.js Link for internal navigation usually, 
        // we might need router.push if we replace the Link component.
        // But for internal detail view, the view count should update on fetch.
    }
  };
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

  const handleLike = async (e: React.MouseEvent, articleId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Optimistic update
    setArticles(prev => prev.map(a => 
      a.id === articleId ? { ...a, likes: a.likes + 1 } : a
    ));

    try {
      await api.likeArticle(articleId);
    } catch (e) {
      console.error("Failed to like article", e);
      // Revert if failed
      setArticles(prev => prev.map(a => 
        a.id === articleId ? { ...a, likes: a.likes - 1 } : a
      ));
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
                        <div key={article.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col h-full">
                            {/* Article Image */}
                            <div className="h-48 w-full bg-gray-100 relative overflow-hidden">
                                {article.image ? (
                                    <img 
                                        src={getImageUrl(article.image)} 
                                        alt={article.title} 
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                                        <FileText className="w-12 h-12" />
                                    </div>
                                )}
                                <div className="absolute top-4 left-4 z-10">
                                     <span className="inline-block px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-indigo-600 text-xs font-bold uppercase tracking-wide shadow-sm">
                                        {article.category}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="p-8 flex flex-col flex-1">
                                <div className="flex items-center justify-between mb-4">
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
                                    <button 
                                        onClick={(e) => handleLike(e, article.id)}
                                        className="flex items-center gap-1.5 text-gray-400 hover:text-red-500 transition-colors cursor-pointer" 
                                        title="Like"
                                    >
                                        <ThumbsUp className="w-4 h-4" />
                                        <span>{article.likes}</span>
                                    </button>
                                </div>

                                {article.link ? (
                                    <button 
                                        onClick={() => handleReadMore(article.id, article.link)}
                                        className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all bg-transparent border-none cursor-pointer"
                                    >
                                        Read More <ArrowRight className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <Link 
                                        href={`/articles/${article.id}`} 
                                        className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all"
                                    >
                                        Read More <ArrowRight className="w-4 h-4" />
                                    </Link>
                                )}

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
