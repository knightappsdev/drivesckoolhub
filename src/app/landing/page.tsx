'use client';

import { motion } from 'framer-motion';
import Navigation from '@/components/landing/Navigation';
import HeroSection from '@/components/landing/HeroSection';
import ProcessSection from '@/components/landing/ProcessSection';
import CoursesSection from '@/components/landing/CoursesSection';
import CallToActionOne from '@/components/landing/CallToActionOne';
import InstructorsSection from '@/components/landing/InstructorsSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import FinalCallToAction from '@/components/landing/FinalCallToAction';
import ExitIntentPopup from '@/components/landing/ExitIntentPopup';
import WhatsAppChat from '@/components/landing/WhatsAppChat';
import ScrollToTop from '@/components/landing/ScrollToTop';

export default function LandingPage() {

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navigation />
      {/* Hero Section */}
      <HeroSection />
      
      {/* UK Driver's License Process Section */}
      <ProcessSection />
      
      {/* Call to Action One */}
      <CallToActionOne />
      
      {/* Driving Courses Section */}
      <CoursesSection />
      
      {/* Call to Action Two */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Learn with Confidence, Drive with Pride
          </motion.h2>
          <motion.p
            className="text-xl text-blue-100 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Join thousands of successful drivers who started their journey with us
          </motion.p>
        </div>
      </section>
      
      {/* Instructors Section */}
      <InstructorsSection />
      
      {/* Testimonials Section */}
      <TestimonialsSection />
      
      {/* Final Call to Action */}
      <FinalCallToAction />
      
      {/* Exit Intent Popup */}
      <ExitIntentPopup />
      
      {/* WhatsApp Chat Widget */}
      <WhatsAppChat />
      
      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
}