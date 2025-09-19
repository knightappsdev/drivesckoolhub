'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

const stats = [
  { number: '5000+', label: 'Students Trained' },
  { number: '95%', label: 'Pass Rate' },
  { number: '200+', label: 'Expert Instructors' },
  { number: '50+', label: 'Cities Covered' }
];

export default function HeroSection() {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  
  const fullText = 'Learn to Drive with Expert Instructors';

  useEffect(() => {
    let i = 0;
    const typingEffect = setInterval(() => {
      if (i < fullText.length) {
        setDisplayText(fullText.slice(0, i + 1));
        i++;
      } else {
        setIsTyping(false);
        clearInterval(typingEffect);
      }
    }, 100);

    return () => clearInterval(typingEffect);
  }, []);

  const scrollToCourses = () => {
    const element = document.querySelector('#courses');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/447756183484', '_blank');
  };

  return (
    <section id="hero" className="min-h-screen flex items-center bg-gradient-to-br from-blue-50 to-green-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                {displayText}
                {isTyping && <span className="animate-pulse">|</span>}
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Professional driving lessons across the UK. Find qualified instructors, 
                book your perfect course, and start your driving journey today with confidence.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 1 }}
                  className="text-center"
                >
                  <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={scrollToCourses}
                className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
              >
                Book Lessons
              </button>
              <button
                onClick={openWhatsApp}
                className="px-8 py-4 border-2 border-green-600 text-green-600 font-semibold rounded-lg hover:bg-green-600 hover:text-white transition-colors"
              >
                Free Consultation
              </button>
            </div>
          </div>

          {/* Right Animation */}
          <div className="relative h-full min-h-[500px] flex items-center justify-center">
            <div className="w-full max-w-lg">
              {/* Road */}
              <div className="relative bg-gray-800 rounded-2xl p-8 overflow-hidden">
                {/* Road markings */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-1 h-full bg-yellow-400 opacity-60"></div>
                </div>
                
                {/* Traffic Lights */}
                <motion.div
                  className="absolute top-4 right-4 bg-gray-900 p-3 rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="space-y-2">
                    <motion.div 
                      className="w-4 h-4 bg-red-500 rounded-full"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <div className="w-4 h-4 bg-yellow-300 rounded-full opacity-30" />
                    <div className="w-4 h-4 bg-green-400 rounded-full opacity-30" />
                  </div>
                </motion.div>

                <motion.div
                  className="absolute top-4 left-4 bg-gray-900 p-3 rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="space-y-2">
                    <div className="w-4 h-4 bg-red-300 rounded-full opacity-30" />
                    <div className="w-4 h-4 bg-yellow-300 rounded-full opacity-30" />
                    <motion.div 
                      className="w-4 h-4 bg-green-500 rounded-full"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    />
                  </div>
                </motion.div>

                {/* Cars with L plates */}
                <div className="relative h-80 flex flex-col justify-center space-y-8">
                  <motion.div
                    className="flex items-center"
                    initial={{ x: -100 }}
                    animate={{ x: 50 }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity, 
                      repeatType: 'reverse',
                      ease: 'linear' 
                    }}
                  >
                    <div className="bg-blue-500 w-20 h-10 rounded-lg shadow-lg relative">
                      <div className="absolute -top-2 -right-2 bg-white w-6 h-6 rounded border-2 border-red-500 flex items-center justify-center text-xs font-bold text-red-500">
                        L
                      </div>
                      {/* Headlights */}
                      <motion.div 
                        className="absolute -left-1 top-1 w-2 h-2 bg-yellow-300 rounded-full"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                      <motion.div 
                        className="absolute -left-1 bottom-1 w-2 h-2 bg-yellow-300 rounded-full"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-center justify-end"
                    initial={{ x: 100 }}
                    animate={{ x: -50 }}
                    transition={{ 
                      duration: 5, 
                      repeat: Infinity, 
                      repeatType: 'reverse',
                      ease: 'linear',
                      delay: 1 
                    }}
                  >
                    <div className="bg-green-500 w-20 h-10 rounded-lg shadow-lg relative">
                      <div className="absolute -top-2 -left-2 bg-white w-6 h-6 rounded border-2 border-red-500 flex items-center justify-center text-xs font-bold text-red-500">
                        L
                      </div>
                      {/* Headlights */}
                      <motion.div 
                        className="absolute -right-1 top-1 w-2 h-2 bg-yellow-300 rounded-full"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                      />
                      <motion.div 
                        className="absolute -right-1 bottom-1 w-2 h-2 bg-yellow-300 rounded-full"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-center"
                    initial={{ x: -100 }}
                    animate={{ x: 60 }}
                    transition={{ 
                      duration: 6, 
                      repeat: Infinity, 
                      repeatType: 'reverse',
                      ease: 'linear',
                      delay: 2 
                    }}
                  >
                    <div className="bg-purple-500 w-20 h-10 rounded-lg shadow-lg relative">
                      <div className="absolute -top-2 -right-2 bg-white w-6 h-6 rounded border-2 border-red-500 flex items-center justify-center text-xs font-bold text-red-500">
                        L
                      </div>
                      {/* Headlights */}
                      <motion.div 
                        className="absolute -left-1 top-1 w-2 h-2 bg-yellow-300 rounded-full"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 1 }}
                      />
                      <motion.div 
                        className="absolute -left-1 bottom-1 w-2 h-2 bg-yellow-300 rounded-full"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 1 }}
                      />
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}