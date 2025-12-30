import Link from 'next/link';
import { Scale, Users, Heart, Briefcase, Key, Shield } from 'lucide-react';

const services = [
    {
        icon: Briefcase,
        title: "Corporate Law",
        desc: "From startups to mergers, get expert advice on business structure and compliance."
    },
    {
        icon: Users,
        title: "Family Law",
        desc: "Compassionate support for divorce, custody, and family related legal matters."
    },
    {
        icon: Shield,
        title: "Criminal Defense",
        desc: "Aggressive representation to protect your rights and your future."
    },
    {
        icon: Scale,
        title: "Civil Litigation",
        desc: "Resolving disputes efficiently through negotiation or courtroom advocacy."
    },
    {
        icon: Key,
        title: "Real Estate",
        desc: "Navigate property transactions, disputes, and zoning laws with ease."
    },
    {
        icon: Heart,
        title: "Personal Injury",
        desc: "Fighting for the compensation you deserve after an accident."
    }
];

export default function ServicesSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-slide-up">
            <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wide mb-4">
                Our Expertise
            </span>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Comprehensive Legal Solutions</h2>
            <p className="text-xl text-gray-500">
                We cover a wide spectrum of legal practice areas to ensure you find the exact help you need.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => (
                <div 
                    key={idx} 
                    className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 animate-slide-up"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                >
                    <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                        <service.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                    <p className="text-gray-500 leading-relaxed mb-6">
                        {service.desc}
                    </p>
                    <Link href="/find-lawyer" className="text-sm font-bold text-blue-600 border-b-2 border-transparent group-hover:border-blue-600 transition-colors">
                        Find a Specialist
                    </Link>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
}
