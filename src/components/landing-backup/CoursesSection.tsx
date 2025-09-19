'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckIcon, XMarkIcon, ClockIcon, CurrencyPoundIcon, TruckIcon } from '@heroicons/react/24/outline';

const courses = [
  {
    id: 1,
    name: 'Complete Beginner Course',
    duration: '40 Hours',
    price: 1200,
    description: 'Perfect for absolute beginners with no driving experience',
    features: [
      'Highway Code training',
      'Basic vehicle controls',
      'Traffic rules and regulations',
      'Parking techniques',
      'Theory test preparation'
    ],
    vehicleTypes: ['Manual', 'Automatic'],
    whyChoose: [
      'Structured learning path designed for beginners',
      'Patient and experienced instructors',
      '95% pass rate for first-time learners',
      'Flexible scheduling options'
    ],
    liveStats: {
      enrolled: 1247,
      completed: 1183,
      passRate: 95
    }
  },
  {
    id: 2,
    name: 'Intensive Crash Course',
    duration: '20 Hours',
    price: 800,
    description: 'Fast-track course for quick learners and test preparation',
    features: [
      'Accelerated learning program',
      'Test booking assistance',
      'Mock driving tests',
      'Quick theory preparation',
      'Last-minute practice sessions'
    ],
    vehicleTypes: ['Manual', 'Automatic'],
    whyChoose: [
      'Get test-ready in just 2-3 weeks',
      'Intensive practice sessions',
      'High success rate for urgent learners',
      'Priority test booking support'
    ],
    liveStats: {
      enrolled: 892,
      completed: 825,
      passRate: 92
    }
  },
  {
    id: 3,
    name: 'Refresher Course',
    duration: '10 Hours',
    price: 400,
    description: 'For drivers returning after a break or building confidence',
    features: [
      'Confidence building sessions',
      'Modern traffic updates',
      'Advanced parking techniques',
      'Motorway driving practice',
      'Defensive driving skills'
    ],
    vehicleTypes: ['Manual', 'Automatic'],
    whyChoose: [
      'Rebuild confidence quickly',
      'Update knowledge with new traffic rules',
      'Practice in challenging conditions',
      'Experienced instructors for nervous drivers'
    ],
    liveStats: {
      enrolled: 634,
      completed: 598,
      passRate: 94
    }
  }
];

interface CourseModalProps {
  course: any;
  isOpen: boolean;
  onClose: () => void;
}

function CourseModal({ course, isOpen, onClose }: CourseModalProps) {
  const [selectedVehicle, setSelectedVehicle] = useState('Manual');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: course?.name || ''
  });

  const handleBookNow = () => {
    const message = `Hi! I'd like to book the ${course.name} (${selectedVehicle}) - £${course.price}. 
Name: ${formData.name}
Email: ${formData.email} 
Phone: ${formData.phone}`;
    
    window.open(`https://wa.me/447756183484?text=${encodeURIComponent(message)}`, '_blank');
    setShowBookingForm(false);
    onClose();
  };

  const handleOptOut = () => {
    // Simple opt-out form simulation
    const reason = prompt('What made you change your mind? (Optional feedback)');
    onClose();
  };

  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">{course.name}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {!showBookingForm ? (
            <>
              {/* Live Course Stats */}
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-blue-900 mb-3">🔴 Live Course Stats</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{course.liveStats.enrolled}</div>
                    <div className="text-sm text-gray-600">Enrolled</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{course.liveStats.completed}</div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{course.liveStats.passRate}%</div>
                    <div className="text-sm text-gray-600">Pass Rate</div>
                  </div>
                </div>
              </div>

              {/* Duration and Price */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <ClockIcon className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-semibold">Duration</div>
                    <div className="text-gray-600">{course.duration}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <CurrencyPoundIcon className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-semibold">Price</div>
                    <div className="text-gray-600">£{course.price}</div>
                  </div>
                </div>
              </div>

              {/* Vehicle Type Selection */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3 flex items-center">
                  <TruckIcon className="h-5 w-5 mr-2" />
                  Vehicle Type
                </h4>
                <div className="flex gap-3">
                  {course.vehicleTypes.map((type: string) => (
                    <button
                      key={type}
                      onClick={() => setSelectedVehicle(type)}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                        selectedVehicle === type
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* What's Included */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">What's Included</h4>
                <ul className="space-y-2">
                  {course.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Why Choose This Course */}
              <div className="mb-6 bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-3">Why Choose This Course</h4>
                <ul className="space-y-2">
                  {course.whyChoose.map((reason: string, index: number) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                      <span className="text-green-700">{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleOptOut}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Maybe Later
                </button>
                <button
                  onClick={() => setShowBookingForm(true)}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Book Now - £{course.price}
                </button>
              </div>
            </>
          ) : (
            /* Booking Form */
            <div>
              <h4 className="text-xl font-semibold mb-4">Book Your Course</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => setShowBookingForm(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleBookNow}
                    disabled={!formData.name || !formData.email || !formData.phone}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CoursesSection() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (course: any) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  return (
    <>
      <section id="courses" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Perfect Course
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From complete beginners to advanced drivers, we have the perfect course for your skill level
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: course.id * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow"
              >
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{course.name}</h3>
                  <p className="text-gray-600 mb-4">{course.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">{course.duration}</span>
                    <span className="text-2xl font-bold text-blue-600">£{course.price}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">What you'll learn:</h4>
                  <ul className="space-y-2 mb-3">
                    {course.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <CheckIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm text-blue-600 font-medium">+More benefits</p>
                </div>

                <button
                  onClick={() => openModal(course)}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  View Details & Book Now
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CourseModal 
        course={selectedCourse} 
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />
    </>
  );
}