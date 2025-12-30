import PublicHeader from '../components/public/PublicHeader';
import Hero from '../components/public/Hero';
import ServicesSection from '../components/public/ServicesSection';
import HowItWorks from '../components/public/HowItWorks';
import FeaturedLawyers from '../components/public/FeaturedLawyers';
import AboutSection from '../components/public/AboutSection';
import ReviewsSection from '../components/public/ReviewsSection';
import FAQSection from '../components/public/FAQSection';
import PublicFooter from '../components/public/PublicFooter';

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <main>
        <Hero />
        <ServicesSection />
        <HowItWorks />
        <FeaturedLawyers />
        <AboutSection />
        <ReviewsSection />
        <FAQSection />
      </main>
      <PublicFooter />
    </div>
  );
}
