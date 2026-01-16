"use client";

import { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';
import ScrollAnimation from '../ui/ScrollAnimation';
import { api } from '../../services/api';
import { Review } from '../../types';

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
        const data = await api.getReviews();
        setReviews(data);
    } catch (error) {
        console.error("Failed to fetch reviews", error);
    } finally {
        setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation direction="up" className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Trusted by Thousands</h2>
            <p className="text-xl text-gray-500">
                Don't just take our word for it. Hear from the people who have found justice through LegalWise.
            </p>
        </ScrollAnimation>

        {loading ? (
             <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
             </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {reviews.map((review, idx) => (
                    <ScrollAnimation 
                        key={review.id} 
                        delay={idx * 0.1}
                        className="h-full"
                    >
                        <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 relative h-full flex flex-col">
                            <Quote className="absolute top-8 right-8 w-10 h-10 text-gray-100" />
                            
                            <div className="flex gap-1 mb-6">
                                {[...Array(review.rating)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                                ))}
                            </div>

                            <p className="text-gray-600 leading-relaxed mb-8 relative z-10 flex-1">
                                "{review.content}"
                            </p>

                            <div className="flex items-center gap-4 mt-auto">
                                <img src={review.image} alt={review.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-md" />
                                <div>
                                    <h4 className="font-bold text-gray-900 leading-tight">{review.name}</h4>
                                    <p className="text-xs text-blue-600 font-semibold uppercase">{review.role}</p>
                                </div>
                            </div>
                        </div>
                    </ScrollAnimation>
                ))}
            </div>
        )}
      </div>
    </section>
  );
}
