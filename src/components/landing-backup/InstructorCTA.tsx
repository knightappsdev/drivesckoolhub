'use client';

import React from 'react';
import { Phone, MessageCircle, Users, Star, MapPin } from 'lucide-react';

const InstructorCTA = () => {
  const handleBookNow = () => {
    const phoneNumber = "+2347038781234";
    const message = "Hi! I'd like to book driving lessons with one of your professional instructors. Can you help me choose the right instructor and schedule?";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCallNow = () => {
    window.open('tel:+2347038781234', '_self');
  };

  return (
    <section className="py-20 bg-gradient-to-br from-teal-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Ready to Start Your Driving Journey?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of successful students who learned with our expert instructors
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                <div className="text-gray-600">Happy Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-600 mb-2">15+</div>
                <div className="text-gray-600">Expert Instructors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
                <div className="text-gray-600">Pass Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500 mb-2">5★</div>
                <div className="text-gray-600">Average Rating</div>
              </div>
            </div>
          </div>

          {/* Main CTA Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border-2 border-blue-100">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left Side - Benefits */}
              <div>
                <h3 className="text-3xl font-bold text-gray-800 mb-6">
                  Why Choose Our Instructors?
                </h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Star className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Certified Professionals</h4>
                      <p className="text-gray-600">All instructors are fully licensed and certified</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="bg-teal-100 p-2 rounded-lg">
                      <Users className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Patient & Friendly</h4>
                      <p className="text-gray-600">Supportive teaching approach for all skill levels</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <MapPin className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Flexible Locations</h4>
                      <p className="text-gray-600">Lessons available across multiple areas</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Action */}
              <div className="text-center">
                <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl p-8 mb-6">
                  <h4 className="text-2xl font-bold mb-4">Start Today!</h4>
                  <p className="text-lg mb-6">Book your first lesson and get started on your driving journey</p>
                  
                  <div className="text-3xl font-bold mb-2">₦25,000</div>
                  <div className="text-lg opacity-90">Complete Course Package</div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <button
                    onClick={handleBookNow}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 text-lg"
                  >
                    <MessageCircle className="w-6 h-6" />
                    Book via WhatsApp
                  </button>
                  
                  <button
                    onClick={handleCallNow}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 text-lg"
                  >
                    <Phone className="w-6 h-6" />
                    Call Now
                  </button>
                  
                  <p className="text-sm text-gray-500">
                    Free consultation • Flexible scheduling • Money-back guarantee
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Still have questions? We're here to help!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center gap-2 text-gray-700">
                <Phone className="w-5 h-5 text-blue-600" />
                <span>+234 703 878 1234</span>
              </div>
              <div className="hidden sm:block text-gray-400">•</div>
              <div className="flex items-center gap-2 text-gray-700">
                <MessageCircle className="w-5 h-5 text-green-600" />
                <span>Available on WhatsApp 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstructorCTA;