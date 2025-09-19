'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  StarIcon,
  MapPinIcon,
  ClockIcon,
  PhoneIcon,
  FunnelIcon,
  UserIcon,
  CurrencyPoundIcon
} from '@heroicons/react/24/outline';

export default function InstructorsSection() {
  const [filters, setFilters] = useState({
    location: '',
    carType: '',
    gender: '',
    nationality: '',
    religion: '',
    ethnicity: ''
  });

  const instructors = [
    {
      id: 1,
      name: "Sarah Johnson",
      location: "Birmingham City Centre",
      experience: 8,
      rate: 45,
      rating: 4.9,
      availability: "Available Today",
      gender: "Female",
      nationality: "British",
      religion: "Christian",
      ethnicity: "White British",
      carType: "Manual & Automatic",
      specialties: ["Test Routes", "Nervous Drivers"],
      image: "👩‍🏫",
      languages: ["English", "French"],
      passRate: 96
    },
    {
      id: 2,
      name: "Ahmed Khan",
      location: "Manchester",
      experience: 12,
      rate: 50,
      rating: 4.8,
      availability: "Available Tomorrow",
      gender: "Male",
      nationality: "British Pakistani",
      religion: "Islam",
      ethnicity: "Asian",
      carType: "Manual",
      specialties: ["Highway Driving", "City Navigation"],
      image: "👨‍🏫",
      languages: ["English", "Urdu", "Hindi"],
      passRate: 94
    },
    {
      id: 3,
      name: "Emma Williams",
      location: "London",
      experience: 6,
      rate: 48,
      rating: 4.7,
      availability: "Available Now",
      gender: "Female",
      nationality: "British",
      religion: "None",
      ethnicity: "White British",
      carType: "Automatic",
      specialties: ["Beginner Friendly", "Parking"],
      image: "👩‍💼",
      languages: ["English"],
      passRate: 92
    },
    {
      id: 4,
      name: "David Patel",
      location: "Leeds",
      experience: 15,
      rate: 55,
      rating: 5.0,
      availability: "Booking Required",
      gender: "Male",
      nationality: "British Indian",
      religion: "Hindu",
      ethnicity: "Asian",
      carType: "Manual & Automatic",
      specialties: ["Advanced Skills", "Test Preparation"],
      image: "👨‍💻",
      languages: ["English", "Gujarati"],
      passRate: 98
    },
    {
      id: 5,
      name: "Lisa Thompson",
      location: "Bristol",
      experience: 10,
      rate: 42,
      rating: 4.6,
      availability: "Available Today",
      gender: "Female",
      nationality: "British",
      religion: "Christian",
      ethnicity: "White British",
      carType: "Manual",
      specialties: ["Motorway Training", "Confidence Building"],
      image: "👩‍🎓",
      languages: ["English", "Welsh"],
      passRate: 90
    },
    {
      id: 6,
      name: "James Wilson",
      location: "Edinburgh",
      experience: 9,
      rate: 46,
      rating: 4.8,
      availability: "Available Tomorrow",
      gender: "Male",
      nationality: "Scottish",
      religion: "Presbyterian",
      ethnicity: "White Scottish",
      carType: "Automatic",
      specialties: ["Eco Driving", "Senior Learners"],
      image: "👨‍🔧",
      languages: ["English", "Gaelic"],
      passRate: 95
    }
  ];

  const filterOptions = {
    location: ["Birmingham", "Manchester", "London", "Leeds", "Bristol", "Edinburgh"],
    carType: ["Manual", "Automatic", "Manual & Automatic"],
    gender: ["Male", "Female"],
    nationality: ["British", "British Pakistani", "British Indian", "Scottish"],
    religion: ["Christian", "Islam", "Hindu", "Presbyterian", "None"],
    ethnicity: ["White British", "Asian", "White Scottish"]
  };

  const filteredInstructors = instructors.filter(instructor => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      return instructor[key as keyof typeof instructor]?.toString().includes(value);
    });
  });

  const handleWhatsApp = (instructor: any) => {
    const message = `Hi! I'm interested in booking driving lessons with ${instructor.name}. Can you help me get started?`;
    window.open(`https://wa.me/447756183484?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleCall = (instructor: any) => {
    const message = `Hi! I'd like to speak about booking lessons with instructor ${instructor.name}.`;
    window.open(`https://wa.me/447756183484?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <section id="instructors" className="py-20 bg-gradient-to-b from-gray-50 to-white">
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
            Find Your Perfect
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Instructor
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our DVSA approved instructors are carefully selected for their expertise, 
            patience, and commitment to your success.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center mb-4">
              <FunnelIcon className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Filter Instructors</h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(filterOptions).map(([key, options]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <select
                    value={filters[key as keyof typeof filters]}
                    onChange={(e) => setFilters(prev => ({ ...prev, [key]: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">All</option>
                    {options.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            
            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {filteredInstructors.length} instructor{filteredInstructors.length !== 1 ? 's' : ''} found
              </span>
              <button
                onClick={() => setFilters({
                  location: '', carType: '', gender: '', nationality: '', religion: '', ethnicity: ''
                })}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </motion.div>

        {/* Instructors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredInstructors.map((instructor, index) => (
            <motion.div
              key={instructor.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              {/* Instructor Header */}
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                
                <div className="relative z-10 flex items-start justify-between">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-3xl mr-4 backdrop-blur-sm">
                      {instructor.image}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1">{instructor.name}</h3>
                      <div className="flex items-center text-sm opacity-90">
                        <MapPinIcon className="w-4 h-4 mr-1" />
                        {instructor.location}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center">
                      <StarIcon className="w-4 h-4 fill-current text-yellow-300 mr-1" />
                      <span className="font-bold">{instructor.rating}</span>
                    </div>
                    <div className="text-sm opacity-90">{instructor.passRate}% pass rate</div>
                  </div>
                </div>
              </div>

              {/* Instructor Details */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <ClockIcon className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                    <div className="text-sm font-semibold">{instructor.experience} Years</div>
                    <div className="text-xs text-gray-600">Experience</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <CurrencyPoundIcon className="w-5 h-5 text-green-500 mx-auto mb-1" />
                    <div className="text-sm font-semibold">£{instructor.rate}/hour</div>
                    <div className="text-xs text-gray-600">Rate</div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Car Type: </span>
                    <span className="text-sm text-gray-600">{instructor.carType}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Availability: </span>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      instructor.availability.includes('Now') 
                        ? 'bg-green-100 text-green-800' 
                        : instructor.availability.includes('Today') || instructor.availability.includes('Tomorrow')
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {instructor.availability}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Languages: </span>
                    <span className="text-sm text-gray-600">{instructor.languages.join(', ')}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="text-sm font-medium text-gray-700 mb-2">Specialties:</div>
                  <div className="flex flex-wrap gap-2">
                    {instructor.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <motion.button
                    onClick={() => window.open(`#instructor-${instructor.id}`, '_self')}
                    className="px-3 py-2 bg-gray-100 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    👤 Profile
                  </motion.button>
                  
                  <motion.button
                    onClick={() => handleCall(instructor)}
                    className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    📞 Call
                  </motion.button>
                  
                  <motion.button
                    onClick={() => handleWhatsApp(instructor)}
                    className="px-3 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    💬 WhatsApp
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredInstructors.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <UserIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No instructors found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your filters to see more results</p>
            <button
              onClick={() => setFilters({
                location: '', carType: '', gender: '', nationality: '', religion: '', ethnicity: ''
              })}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
          </motion.div>
        )}

        {/* Contact Info */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Can't Find the Right Instructor?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Contact our team and we'll help match you with the perfect instructor 
              based on your specific needs, location, and preferences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="https://wa.me/447756183484?text=Hi! I need help finding the right driving instructor. Can you assist me?"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                💬 Get Personal Assistance
              </motion.a>
              <motion.a
                href="tel:+447756183484"
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                📞 Call Now: +44 7756 183484
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}