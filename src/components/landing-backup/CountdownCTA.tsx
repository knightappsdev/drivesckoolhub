'use client';

import React, { useState, useEffect } from 'react';
import { Clock, BookOpen, Users, Award } from 'lucide-react';

const CountdownCTA = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Set target date to 30 days from now
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleBookNow = () => {
    const phoneNumber = "+2347038781234";
    const message = "Hi! I'm interested in booking driving lessons with the special offer. Can you help me get started?";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-white rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-3/4 w-20 h-20 bg-white rounded-full animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center text-white">
          <div className="mb-8">
            <Clock className="w-16 h-16 mx-auto mb-4 animate-bounce" />
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Limited Time Offer!
            </h2>
            <p className="text-xl md:text-2xl mb-2">
              Get 20% Off All Driving Courses
            </p>
            <p className="text-lg opacity-90">
              Professional lessons with certified instructors
            </p>
          </div>

          {/* Countdown Timer */}
          <div className="mb-12">
            <p className="text-lg mb-6">Offer expires in:</p>
            <div className="flex justify-center items-center gap-4 md:gap-8">
              {[
                { value: timeLeft.days, label: 'Days' },
                { value: timeLeft.hours, label: 'Hours' },
                { value: timeLeft.minutes, label: 'Minutes' },
                { value: timeLeft.seconds, label: 'Seconds' }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="bg-white text-blue-600 rounded-lg p-4 md:p-6 font-bold text-2xl md:text-4xl min-w-[80px] shadow-lg">
                    {String(item.value).padStart(2, '0')}
                  </div>
                  <p className="text-sm mt-2 uppercase tracking-wide">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="flex flex-col items-center">
              <BookOpen className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Comprehensive Course</h3>
              <p className="opacity-90">Theory and practical lessons included</p>
            </div>
            <div className="flex flex-col items-center">
              <Users className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Expert Instructors</h3>
              <p className="opacity-90">Certified professionals with years of experience</p>
            </div>
            <div className="flex flex-col items-center">
              <Award className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2">High Pass Rate</h3>
              <p className="opacity-90">95% of our students pass on first attempt</p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="space-y-4">
            <button
              onClick={handleBookNow}
              className="bg-white text-blue-600 hover:bg-gray-100 font-bold text-xl px-12 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Book Now & Save 20%
            </button>
            <p className="text-sm opacity-90">
              *Offer valid for new students only. Limited slots available.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CountdownCTA;