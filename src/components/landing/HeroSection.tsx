'use client';

import { motion } from 'framer-motion';
import { ChevronRightIcon, PlayIcon } from '@heroicons/react/24/outline';

export default function HeroSection() {
  const cars = [
    { id: 1, color: 'bg-red-500', delay: 0 },
    { id: 2, color: 'bg-blue-500', delay: 2 },
    { id: 3, color: 'bg-green-500', delay: 4 },
    { id: 4, color: 'bg-yellow-500', delay: 6 },
  ];

  return (
    <section id="hero" className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden pt-16">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Road */}
        <div className="absolute bottom-20 left-0 right-0 h-32 bg-gray-800 transform -skew-y-1">
          {/* Road Lines */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-white opacity-60">
            <motion.div
              className="h-full w-full bg-gradient-to-r from-transparent via-yellow-400 to-transparent"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </div>
          
          {/* Animated Cars */}
          <div className="absolute top-2 left-0 right-0 h-20">
            {cars.map((car) => (
              <motion.div
                key={car.id}
                className={`absolute w-16 h-8 ${car.color} rounded-lg shadow-lg`}
                style={{ top: `${Math.random() * 40}px` }}
                animate={{
                  x: ['-100px', 'calc(100vw + 100px)'],
                }}
                transition={{
                  duration: 8,
                  delay: car.delay,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                {/* Car Details */}
                <div className="absolute top-1 left-2 w-3 h-2 bg-blue-200 rounded-sm opacity-80" />
                <div className="absolute top-1 right-2 w-3 h-2 bg-blue-200 rounded-sm opacity-80" />
                <div className="absolute -bottom-1 left-2 w-3 h-3 bg-black rounded-full" />
                <div className="absolute -bottom-1 right-2 w-3 h-3 bg-black rounded-full" />
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-20"
          animate={{
            y: [0, 20, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Content */}
          <motion.div
            className="text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Master the Road with
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                DriveSchool Pro
              </span>
            </motion.h1>
            
            <motion.p
              className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              The UK's most trusted driving school with expert instructors, 
              flexible scheduling, and a 95% first-time pass rate.
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 flex items-center justify-center"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Start Your Journey
                <ChevronRightIcon className="ml-2 w-5 h-5" />
              </motion.button>
              
              <motion.button
                className="px-8 py-4 bg-white text-gray-800 font-semibold rounded-full shadow-lg border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl transform transition-all duration-300 flex items-center justify-center"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <PlayIcon className="mr-2 w-5 h-5" />
                Watch Demo
              </motion.button>
            </motion.div>
            
            {/* Stats */}
            <motion.div
              className="mt-12 grid grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">95%</div>
                <div className="text-sm text-gray-600">Pass Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">50K+</div>
                <div className="text-sm text-gray-600">Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">15+</div>
                <div className="text-sm text-gray-600">Years</div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Right Content - Floating Car */}
          <motion.div
            className="relative flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.div
              className="relative w-80 h-80 md:w-96 md:h-96"
              animate={{
                y: [0, -20, 0],
                rotate: [0, 1, 0, -1, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {/* Main Car Illustration */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl shadow-2xl transform rotate-12">
                <div className="absolute top-8 left-8 right-8 bottom-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl">
                  {/* Car Windows */}
                  <div className="absolute top-4 left-4 right-4 h-16 bg-gradient-to-r from-blue-200 to-blue-300 rounded-lg opacity-80" />
                  
                  {/* L Plate */}
                  <motion.div
                    className="absolute top-2 left-2 w-8 h-8 bg-yellow-400 rounded border-2 border-red-500 flex items-center justify-center"
                    animate={{ rotate: [0, 5, 0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="text-red-500 font-bold text-sm">L</span>
                  </motion.div>
                  
                  {/* Wheels */}
                  <motion.div
                    className="absolute bottom-2 left-8 w-12 h-12 bg-black rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  />
                  <motion.div
                    className="absolute bottom-2 right-8 w-12 h-12 bg-black rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  />
                </div>
              </div>
              
              {/* Floating Elements Around Car */}
              <motion.div
                className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                ⭐
              </motion.div>
              
              <motion.div
                className="absolute -bottom-4 -left-4 w-16 h-16 bg-green-400 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, -180, -360],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                ✓
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll Down Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-gray-400 rounded-full mt-2"
            animate={{
              y: [0, 12, 0],
              opacity: [1, 0, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
      </motion.div>
    </section>
  );
}