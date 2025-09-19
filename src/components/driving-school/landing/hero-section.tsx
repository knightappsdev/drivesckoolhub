'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import TypewriterText from '@/components/ui/typewriter-text';
import DrivingAnimation from './driving-animation';
import { Play, Star, Users, MapPin, Clock, CheckCircle, Calendar, MessageCircle } from 'lucide-react';

interface HeroSectionProps {
  onBookLessons: () => void;
  onFreeConsultation: () => void;
}

export default function HeroSection({ onBookLessons, onFreeConsultation }: HeroSectionProps) {

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                UK's Most Trusted Driving School
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <TypewriterText 
                  text="Learn to Drive with Expert Instructors"
                  speed={80}
                  delay={500}
                  className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600"
                />
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Professional driving lessons across the UK. Find qualified instructors, 
                book your perfect course, and start your driving journey today with confidence.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">10K+</div>
                <div className="text-sm text-gray-600">Happy Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-gray-600">Expert instructors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">98%</div>
                <div className="text-sm text-gray-600">Pass Rate</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={onBookLessons}
                size="lg"
                className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 transform hover:scale-105 transition-all duration-200"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book Lessons
              </Button>
              <Button 
                onClick={onFreeConsultation}
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 group hover:bg-blue-50 transition-all duration-200"
              >
                <MessageCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Free Consultation
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm font-medium">4.9/5 from 2,500+ reviews</span>
              </div>
            </div>
          </div>

          {/* Right Content - Driving Animation */}
          <div className="relative h-full flex items-center">
            <Card className="relative overflow-hidden bg-gradient-to-br from-blue-100 to-green-100 border-0 shadow-2xl w-full">
              <div className="h-96 relative">
                <DrivingAnimation />
              </div>
            </Card>

            {/* Floating Elements */}
            <div className="absolute -top-6 -left-6 bg-white rounded-lg shadow-lg p-4 animate-float">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-sm">500+ Instructors</div>
                  <div className="text-xs text-gray-500">Available Now</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-6 bg-white rounded-lg shadow-lg p-4 animate-float animation-delay-2000">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Flexible Hours</div>
                  <div className="text-xs text-gray-500">7 Days a Week</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Background Styles */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes text-gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }
        
        .animate-text-gradient {
          background-size: 200% 200%;
          animation: text-gradient 3s ease-in-out infinite;
        }
        
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
}