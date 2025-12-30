import { Star, Quote } from 'lucide-react';
import ScrollAnimation from '../ui/ScrollAnimation';

const reviews = [
    {
        name: "Sarah Jenkins",
        role: "Business Owner",
        content: "LegalWise made finding a corporate lawyer incredibly easy. The detailed profiles and client reviews helped me choose the perfect match for my startup.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
    },
    {
        name: "Michael Chen",
        role: "Real Estate Investor",
        content: "I needed urgent advice on a property dispute. The 'Find Lawyer' feature connected me with a local expert within minutes. Highly recommended!",
        rating: 5,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
    },
    {
        name: "Emily Rodriguez",
        role: "Freelancer",
        content: "The legal articles and books section provided me with so much clarity before I even spoke to a lawyer. It's a comprehensive platform for anyone.",
        rating: 4,
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80"
    }
];

export default function ReviewsSection() {
  return (
    <section className="py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation direction="up" className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Trusted by Thousands</h2>
            <p className="text-xl text-gray-500">
                Don't just take our word for it. Hear from the people who have found justice through LegalWise.
            </p>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, idx) => (
                <ScrollAnimation 
                    key={idx} 
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
      </div>
    </section>
  );
}
