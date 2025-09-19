'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StarIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Emma Thompson",
      age: 19,
      location: "Birmingham",
      course: "Absolute Beginner",
      instructor: "Sarah Johnson",
      rating: 5,
      comment: "DriveSchool Pro changed my life! I was terrified of driving but Sarah made me feel so comfortable. Her patience and teaching style helped me pass on my first attempt. The online booking system made everything so easy!",
      avatar: "👩‍🎓",
      passedDate: "March 2024",
      testAttempts: 1
    },
    {
      id: 2,
      name: "Mohammed Ahmed",
      age: 24,
      location: "Manchester",
      course: "Beginner Course",
      instructor: "Ahmed Khan",
      rating: 5,
      comment: "Excellent driving school! Ahmed was fantastic - very professional and knowledgeable. The structured lessons and theory support helped me understand everything clearly. Passed with only 2 minors!",
      avatar: "👨‍💼",
      passedDate: "February 2024",
      testAttempts: 1
    },
    {
      id: 3,
      name: "Jessica Williams",
      age: 28,
      location: "London",
      course: "Intensive Course",
      instructor: "Emma Williams",
      rating: 5,
      comment: "I needed to pass quickly for work and the intensive course was perfect. Emma was incredibly supportive and the course structure was well-planned. Great value for money and amazing results!",
      avatar: "👩‍💻",
      passedDate: "April 2024",
      testAttempts: 1
    },
    {
      id: 4,
      name: "David Chen",
      age: 22,
      location: "Leeds",
      course: "Flexi Course",
      instructor: "David Patel",
      rating: 5,
      comment: "The flexibility of choosing my own schedule was exactly what I needed as a university student. David is an amazing instructor with great teaching techniques. Highly recommended!",
      avatar: "👨‍🎓",
      passedDate: "January 2024",
      testAttempts: 2
    },
    {
      id: 5,
      name: "Sophie Robinson",
      age: 17,
      location: "Bristol",
      course: "Absolute Beginner",
      instructor: "Lisa Thompson",
      rating: 5,
      comment: "As a nervous teenager, Lisa made learning to drive fun and stress-free. The mock tests and theory support were brilliant. I felt fully prepared for both my theory and practical tests!",
      avatar: "👧",
      passedDate: "March 2024",
      testAttempts: 1
    }
  ];

  // Auto-slide every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse" />
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-yellow-200 rounded-full opacity-20 animate-pulse delay-2000" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Student
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Success Stories
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from our successful students who achieved their driving goals with DriveSchool Pro
          </p>
        </motion.div>

        {/* Main Testimonial Display */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 relative overflow-hidden"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full -translate-y-16 translate-x-16 opacity-50" />
              
              {/* Rating Stars */}
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <StarIcon 
                    key={i} 
                    className="w-8 h-8 text-yellow-400 fill-current"
                  />
                ))}
              </div>

              {/* Testimonial Content */}
              <div className="text-center mb-8">
                <p className="text-lg md:text-xl text-gray-700 italic leading-relaxed mb-6">
                  "{testimonials[currentIndex].comment}"
                </p>

                {/* Student Info */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl text-white shadow-lg">
                      {testimonials[currentIndex].avatar}
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-lg text-gray-900">
                        {testimonials[currentIndex].name}
                      </h4>
                      <p className="text-gray-600">
                        Age {testimonials[currentIndex].age} • {testimonials[currentIndex].location}
                      </p>
                    </div>
                  </div>

                  <div className="hidden md:block w-px h-16 bg-gray-300" />

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-blue-600">Course</div>
                      <div className="text-gray-700">{testimonials[currentIndex].course}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-blue-600">Instructor</div>
                      <div className="text-gray-700">{testimonials[currentIndex].instructor}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-green-600">Passed</div>
                      <div className="text-gray-700">{testimonials[currentIndex].passedDate}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-purple-600">Attempts</div>
                      <div className="text-gray-700">
                        {testimonials[currentIndex].testAttempts === 1 ? 'First Try!' : `${testimonials[currentIndex].testAttempts} tries`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-blue-600 hover:shadow-xl transition-all duration-300 z-10"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>

          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-blue-600 hover:shadow-xl transition-all duration-300 z-10"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Testimonial Indicators */}
        <div className="flex justify-center mt-8 space-x-3">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-blue-600 w-8' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Additional Stats */}
        <motion.div
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {[
            { number: "2,500+", label: "Happy Students", icon: "🎓" },
            { number: "94%", label: "First Time Pass Rate", icon: "✅" },
            { number: "15+", label: "Expert Instructors", icon: "👨‍🏫" },
            { number: "5 Years", label: "Experience", icon: "🏆" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Join Our Success Stories?
            </h3>
            <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
              Start your driving journey today and become our next success story. 
              Join thousands of students who passed with DriveSchool Pro!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="#courses"
                className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                📚 Book Your Course
              </motion.a>
              <motion.a
                href="https://wa.me/447756183484?text=Hi! I'd like to start my driving lessons and become a success story too!"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                💬 Start Now
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}