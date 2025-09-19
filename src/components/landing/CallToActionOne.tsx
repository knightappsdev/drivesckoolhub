'use client';

import { motion } from 'framer-motion';
import { ChevronRightIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function CallToActionOne() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-10 left-10 w-32 h-32 bg-white opacity-10 rounded-full"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-24 h-24 bg-yellow-400 opacity-20 rounded-full"
          animate={{
            x: [0, -80, 0],
            y: [0, 30, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-r from-pink-400 to-purple-400 opacity-10 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        {/* Icon */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <SparklesIcon className="w-10 h-10 text-yellow-300" />
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.h2
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Ready Now to Start Your
          <motion.span
            className="block text-yellow-300"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Driving Journey?
          </motion.span>
        </motion.h2>

        <motion.p
          className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          Join over 50,000 successful drivers who chose DriveSchool Pro. 
          <span className="block font-semibold text-yellow-200 mt-2">
            95% first-time pass rate guaranteed!
          </span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.button
            onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-white text-blue-600 font-bold rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 flex items-center justify-center min-w-[200px] group"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Choose Your Course</span>
            <motion.div
              className="ml-2"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </motion.div>
          </motion.button>

          <motion.a
            href="https://wa.me/447756183484?text=Hi! I'm interested in starting my driving lessons. Can you help me choose the right course?"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-blue-600 transform transition-all duration-300 flex items-center justify-center min-w-[200px]"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            💬 Get Free Consultation
          </motion.a>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <div>
            <div className="text-2xl md:text-3xl font-bold text-yellow-300">95%</div>
            <div className="text-blue-100 text-sm">Pass Rate</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-yellow-300">50K+</div>
            <div className="text-blue-100 text-sm">Happy Students</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-yellow-300">DVSA</div>
            <div className="text-blue-100 text-sm">Approved</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-yellow-300">15+</div>
            <div className="text-blue-100 text-sm">Years Experience</div>
          </div>
        </motion.div>

        {/* Urgency Element */}
        <motion.div
          className="mt-8 inline-flex items-center px-6 py-3 bg-yellow-400 bg-opacity-20 rounded-full backdrop-blur-sm border border-yellow-300"
          animate={{
            scale: [1, 1.02, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <motion.span
            className="w-3 h-3 bg-yellow-300 rounded-full mr-3"
            animate={{
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
            }}
          />
          <span className="text-yellow-100 font-medium">
            ⚡ Limited Time: Free Theory Course with Any Package
          </span>
        </motion.div>
      </div>
    </section>
  );
}