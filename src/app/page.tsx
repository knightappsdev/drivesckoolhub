import Navigation from '@/components/landing/Navigation';
import HeroSection from '@/components/landing/HeroSection';
import CallToActionOne from '@/components/landing/CallToActionOne';
import CoursesSection from '@/components/landing/CoursesSection';
import CountdownCTA from '@/components/landing/CountdownCTA';
import InstructorsSection from '@/components/landing/InstructorsSection';
import InstructorCTA from '@/components/landing/InstructorCTA';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import Footer from '@/components/landing/Footer';
import WhatsAppChat from '@/components/landing/WhatsAppChat';
import ScrollToTop from '@/components/landing/ScrollToTop';
import ExitIntentPopup from '@/components/landing/ExitIntentPopup';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <CallToActionOne />
      <CoursesSection />
      <CountdownCTA />
      <InstructorsSection />
      <InstructorCTA />
      <TestimonialsSection />
      <Footer />
      <WhatsAppChat />
      <ScrollToTop />
      <ExitIntentPopup />
    </div>
  );
}