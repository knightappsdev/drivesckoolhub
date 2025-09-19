'use client';

import { motion } from 'framer-motion';
import { 
  AcademicCapIcon, 
  PhoneIcon, 
  ClockIcon,
  CheckCircleIcon,
  StarIcon,
  MapPinIcon,
  CreditCardIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

export default function FinalCallToAction() {
  const benefits = [
    { icon: <CheckCircleIcon className="w-6 h-6" />, text: "DVSA Approved Instructors" },
    { icon: <StarIcon className="w-6 h-6" />, text: "94% First Time Pass Rate" },
    { icon: <ClockIcon className="w-6 h-6" />, text: "Flexible Scheduling" },
    { icon: <MapPinIcon className="w-6 h-6" />, text: "Nationwide Coverage" },
    { icon: <CreditCardIcon className="w-6 h-6" />, text: "Multiple Payment Options" },
    { icon: <ShieldCheckIcon className="w-6 h-6" />, text: "Fully Insured Vehicles" }
  ];

  const handleBookLesson = () => {
    // Scroll to courses section
    const coursesSection = document.getElementById('courses');
    if (coursesSection) {
      coursesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFreeConsultation = () => {
    const message = `Hi! I'm interested in a free consultation to discuss my driving lessons. Can we schedule a call?`;
    window.open(`https://wa.me/447756183484?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-blue-400 rounded-full opacity-10"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-24 h-24 bg-purple-400 rounded-full opacity-10"
          animate={{
            y: [0, 15, 0],
            x: [0, 10, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-20 h-20 bg-yellow-400 rounded-full opacity-10"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-40 right-1/3 w-28 h-28 bg-green-400 rounded-full opacity-10"
          animate={{
            y: [0, -25, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Start Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                Driving Journey
              </span>
              <span className="block">Today</span>
            </h2>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Don&apos;t wait any longer. Get behind the wheel with the UK&apos;s most trusted driving school.
            <span className="block mt-2 text-lg">
              Professional instruction • Proven results • Exceptional support
            </span>
          </motion.p>
        </div>

        {/* Benefits Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="flex items-center space-x-3 text-white bg-white bg-opacity-10 rounded-lg p-3 backdrop-blur-sm"
              whileHover={{ 
                scale: 1.05,
                backgroundColor: "rgba(255, 255, 255, 0.2)"
              }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-yellow-400 flex-shrink-0">
                {benefit.icon}
              </div>
              <span className="text-sm md:text-base font-medium">{benefit.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <motion.button
            onClick={handleBookLesson}
            className="group relative px-12 py-5 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold text-lg rounded-2xl shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 overflow-hidden"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center justify-center space-x-3">
              <AcademicCapIcon className="w-7 h-7" />
              <span>Book Your Lesson</span>
            </div>
          </motion.button>

          <motion.button
            onClick={handleFreeConsultation}
            className="group relative px-12 py-5 bg-transparent border-2 border-white text-white font-bold text-lg rounded-2xl shadow-2xl hover:bg-white hover:text-gray-900 transition-all duration-300 overflow-hidden"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative flex items-center justify-center space-x-3">
              <PhoneIcon className="w-7 h-7" />
              <span>Free Consultation</span>
            </div>
          </motion.button>
        </motion.div>

        {/* Urgency and Trust Elements */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl p-6 mb-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-2">
              🔥 Limited Time Offer
            </h3>
            <p className="text-red-100 text-lg">
              Book this month and get <strong>20% off</strong> your first 5 lessons!
            </p>
            <div className="mt-4 text-sm text-red-200">
              *Valid for new students only. Offer expires soon!
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center max-w-3xl mx-auto">
            <motion.div
              className="bg-white bg-opacity-10 rounded-xl p-4 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl mb-2">🏆</div>
              <div className="text-white font-semibold text-sm">Award Winning School</div>
            </motion.div>
            <motion.div
              className="bg-white bg-opacity-10 rounded-xl p-4 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl mb-2">⭐</div>
              <div className="text-white font-semibold text-sm">5-Star Rated</div>
            </motion.div>
            <motion.div
              className="bg-white bg-opacity-10 rounded-xl p-4 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl mb-2">🛡️</div>
              <div className="text-white font-semibold text-sm">Fully Licensed</div>
            </motion.div>
            <motion.div
              className="bg-white bg-opacity-10 rounded-xl p-4 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl mb-2">💯</div>
              <div className="text-white font-semibold text-sm">Money Back Guarantee</div>
            </motion.div>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          className="mt-12 text-center text-blue-100"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-lg mb-4">Questions? We&apos;re here to help!</p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <a 
              href="tel:+447756183484"
              className="flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 transition-colors"
            >
              <PhoneIcon className="w-5 h-5" />
              <span className="font-semibold">+44 7756 183484</span>
            </a>
            <a 
              href="mailto:info@driveschoolpro.com"
              className="flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
              </svg>
              <span className="font-semibold">info@driveschoolpro.com</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}