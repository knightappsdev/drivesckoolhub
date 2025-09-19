'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon,
  StarIcon,
  ClockIcon,
  CurrencyPoundIcon,
  UserIcon,
  CheckCircleIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

export default function CoursesSection() {
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const courses = [
    {
      id: 1,
      name: "Absolute Beginner",
      subtitle: "Never Been Behind the Wheel?",
      description: "Perfect for complete beginners who have never driven before. We'll start from the very basics.",
      duration: "40 hours",
      cost: 1200,
      originalCost: 1500,
      enrolledStudents: 2847,
      rating: 4.9,
      successRate: 94,
      transmissionTypes: ["Manual", "Automatic"],
      courseBreakdown: [
        "Vehicle familiarization and controls",
        "Basic driving skills and coordination",
        "Traffic awareness and road positioning",
        "Junction handling and roundabouts",
        "Parking and reversing maneuvers",
        "Test preparation and mock tests"
      ],
      whyChoose: [
        "Specially designed for absolute beginners",
        "Patient and experienced instructors",
        "Gradual learning progression",
        "Extra support and confidence building",
        "Free theory course included"
      ],
      color: "from-green-500 to-green-600",
      popular: false
    },
    {
      id: 2,
      name: "Beginner",
      subtitle: "Some Basic Knowledge",
      description: "Ideal for those with basic driving knowledge who need structured learning and practice.",
      duration: "30 hours",
      cost: 900,
      originalCost: 1100,
      enrolledStudents: 3421,
      rating: 4.8,
      successRate: 96,
      transmissionTypes: ["Manual", "Automatic"],
      courseBreakdown: [
        "Refresher on basic controls",
        "Building confidence on roads",
        "Advanced junction techniques",
        "Independent driving skills",
        "Hazard awareness training",
        "Test preparation intensive"
      ],
      whyChoose: [
        "Builds on existing knowledge",
        "Accelerated learning program",
        "Focus on test preparation",
        "Individual progress tracking",
        "Flexible scheduling options"
      ],
      color: "from-blue-500 to-blue-600",
      popular: true
    },
    {
      id: 3,
      name: "Intermediate",
      subtitle: "Ready for the Next Level",
      description: "For learners with some driving experience who need polish and test preparation.",
      duration: "20 hours",
      cost: 650,
      originalCost: 800,
      enrolledStudents: 1876,
      rating: 4.9,
      successRate: 98,
      transmissionTypes: ["Manual", "Automatic"],
      courseBreakdown: [
        "Advanced driving techniques",
        "Test route familiarization",
        "Fine-tuning driving skills",
        "Mock test sessions",
        "Confidence building exercises",
        "Last-minute preparation"
      ],
      whyChoose: [
        "Intensive test preparation",
        "High success rate",
        "Experienced test instructors",
        "Route-specific training",
        "Quick results guaranteed"
      ],
      color: "from-purple-500 to-purple-600",
      popular: false
    },
    {
      id: 4,
      name: "Customize / Flexi Course",
      subtitle: "Tailored to Your Needs",
      description: "Completely customizable course based on your specific requirements and schedule.",
      duration: "Flexible",
      cost: 45,
      originalCost: 55,
      enrolledStudents: 987,
      rating: 4.7,
      successRate: 92,
      transmissionTypes: ["Manual", "Automatic", "Both"],
      courseBreakdown: [
        "Personalized assessment",
        "Custom lesson planning",
        "Flexible timing options",
        "Specific skill focus",
        "Pay-as-you-go option",
        "Progress review sessions"
      ],
      whyChoose: [
        "Completely flexible schedule",
        "Personalized learning approach",
        "Pay per lesson option",
        "Suitable for busy lifestyles",
        "Custom pace and intensity"
      ],
      color: "from-orange-500 to-orange-600",
      popular: false,
      isPerHour: true
    }
  ];

  const handleViewDetails = (course: any) => {
    setSelectedCourse(course);
  };

  const handleBookNow = () => {
    setShowBookingForm(true);
    setSelectedCourse(null);
  };

  const handleMaybeLater = () => {
    // This will trigger the exit intent form
    setSelectedCourse(null);
    localStorage.removeItem('exitIntentShown');
  };

  return (
    <section id="courses" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Driving Lesson
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Courses
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect course for your learning level. All courses include theory support, 
            mock tests, and our guarantee of success.
          </p>
        </motion.div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group ${
                course.popular ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
              }`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              {/* Popular Badge */}
              {course.popular && (
                <div className="absolute top-4 left-4 z-10">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    🔥 Most Popular
                  </div>
                </div>
              )}

              {/* Course Header */}
              <div className={`bg-gradient-to-r ${course.color} p-6 text-white relative overflow-hidden`}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <motion.div
                    className="absolute -top-4 -right-4 w-24 h-24 border border-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  />
                  <motion.div
                    className="absolute -bottom-4 -left-4 w-16 h-16 border border-white rounded-full"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                  />
                </div>

                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-2">{course.name}</h3>
                  <p className="text-sm opacity-90 mb-4">{course.subtitle}</p>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-3xl font-bold">
                        £{course.cost}
                        {course.isPerHour && <span className="text-lg">/hour</span>}
                      </span>
                      {course.originalCost !== course.cost && (
                        <span className="block text-sm line-through opacity-75">
                          £{course.originalCost}
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="flex items-center">
                        <StarIcon className="w-4 h-4 fill-current mr-1" />
                        <span className="font-semibold">{course.rating}</span>
                      </div>
                      <div className="text-sm opacity-90">{course.enrolledStudents} enrolled</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Course Content */}
              <div className="p-6">
                <p className="text-gray-600 mb-6 leading-relaxed">{course.description}</p>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <ClockIcon className="w-4 h-4 mr-2 text-blue-500" />
                    <span>Duration: {course.duration}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <UserIcon className="w-4 h-4 mr-2 text-green-500" />
                    <span>{course.successRate}% Success Rate</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <AcademicCapIcon className="w-4 h-4 mr-2 text-purple-500" />
                    <span>{course.transmissionTypes.join(', ')}</span>
                  </div>
                </div>

                <motion.button
                  onClick={() => handleViewDetails(course)}
                  className={`w-full py-3 bg-gradient-to-r ${course.color} text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View Details & Book
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Course Details Modal */}
      <AnimatePresence>
        {selectedCourse && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Modal Header */}
              <div className={`bg-gradient-to-r ${selectedCourse.color} text-white p-6 relative`}>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="absolute top-4 right-4 w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-200"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
                
                <h2 className="text-3xl font-bold mb-2">{selectedCourse.name} Course</h2>
                <p className="opacity-90">{selectedCourse.subtitle}</p>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Live Course Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{selectedCourse.enrolledStudents}</div>
                    <div className="text-sm text-gray-600">Enrolled Students</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{selectedCourse.rating}</div>
                    <div className="text-sm text-gray-600">Rating</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{selectedCourse.successRate}%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      £{selectedCourse.cost}
                      {selectedCourse.isPerHour && <span className="text-lg">/hr</span>}
                    </div>
                    <div className="text-sm text-gray-600">Course Price</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div>
                    <h3 className="text-xl font-bold mb-4">Course Breakdown</h3>
                    <div className="space-y-3 mb-6">
                      {selectedCourse.courseBreakdown.map((item: string, index: number) => (
                        <motion.div
                          key={index}
                          className="flex items-start"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mb-6">
                      <h4 className="font-semibold mb-2">Transmission Types</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCourse.transmissionTypes.map((type: string) => (
                          <span
                            key={type}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div>
                    <h3 className="text-xl font-bold mb-4">Why Choose This Course</h3>
                    <div className="space-y-3 mb-6">
                      {selectedCourse.whyChoose.map((reason: string, index: number) => (
                        <motion.div
                          key={index}
                          className="flex items-start"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <StarIcon className="w-5 h-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{reason}</span>
                        </motion.div>
                      ))}
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2">Special Offer</h4>
                      <p className="text-green-700 text-sm">
                        Book now and get a FREE theory course + 1 mock test session!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t">
                  <motion.button
                    onClick={handleBookNow}
                    className={`flex-1 py-4 bg-gradient-to-r ${selectedCourse.color} text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    📚 Book Now
                  </motion.button>
                  <motion.button
                    onClick={handleMaybeLater}
                    className="flex-1 py-4 bg-gray-100 text-gray-800 font-semibold rounded-lg border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-200 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    🤔 Maybe Later
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Form Modal */}
      <AnimatePresence>
        {showBookingForm && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-md w-full p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Book Your Course</h3>
                <p className="text-gray-600">We'll contact you within 15 minutes!</p>
              </div>

              <form className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Select Driving Level</option>
                    <option value="absolute_beginner">Absolute Beginner</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <motion.button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Submit
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setShowBookingForm(false)}
                    className="flex-1 py-3 bg-gray-100 text-gray-800 font-semibold rounded-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}