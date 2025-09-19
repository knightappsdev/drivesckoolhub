'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  BookOpen, 
  CheckCircle, 
  Calendar, 
  Car, 
  Award,
  ArrowRight,
  ExternalLink,
  Phone
} from 'lucide-react';

interface ProcessStep {
  id: number;
  title: string;
  icon: React.ComponentType<any>;
  description: string;
  hoverInfo: string;
  actionButton?: {
    text: string;
    action: () => void;
    variant?: 'default' | 'outline' | 'secondary';
  };
}

export default function UKLicenseProcess() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const processSteps: ProcessStep[] = [
    {
      id: 1,
      title: "Apply for a DVLA Provisional License",
      icon: FileText,
      description: "Get your provisional driving license to start learning",
      hoverInfo: "You can apply online at gov.uk or by post. You must be at least 17 years old (16 for moped). You'll need proof of identity and address. The license costs £34 online or £43 by post.",
      actionButton: {
        text: "Apply via DVLA",
        action: () => window.open('https://www.gov.uk/apply-first-provisional-driving-licence', '_blank'),
        variant: 'default'
      }
    },
    {
      id: 2,
      title: "Start your theory lessons",
      icon: BookOpen,
      description: "Learn the Highway Code and traffic rules",
      hoverInfo: "Study the Highway Code, road signs, and traffic laws. Use official DVSA apps and practice tests. We recommend at least 20 hours of theory study. You can study independently or take our theory courses.",
      actionButton: {
        text: "Book Theory Course",
        action: () => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' }),
        variant: 'outline'
      }
    },
    {
      id: 3,
      title: "Prepare and pass your theory test",
      icon: CheckCircle,
      description: "Take the official DVSA theory test",
      hoverInfo: "The theory test has 50 multiple choice questions (pass mark: 43/50) plus a hazard perception test (pass mark: 44/75). The test costs £23 and you'll get your results immediately.",
      actionButton: {
        text: "Book Theory Test",
        action: () => window.open('https://www.gov.uk/book-theory-test', '_blank'),
        variant: 'default'
      }
    },
    {
      id: 4,
      title: "Book for your practical test",
      icon: Calendar,
      description: "Schedule your practical driving test",
      hoverInfo: "You can only book your practical test after passing your theory test. The practical test costs £62 (£75 evenings/weekends). Book early as waiting times can be several weeks.",
      actionButton: {
        text: "Book Practical Test",
        action: () => window.open('https://www.gov.uk/book-practical-driving-test', '_blank'),
        variant: 'default'
      }
    },
    {
      id: 5,
      title: "Start your practical classes",
      icon: Car,
      description: "Learn to drive with professional instructors",
      hoverInfo: "The average learner needs 40-50 hours of professional lessons plus 20+ hours of private practice. We offer flexible scheduling, expert instructors, and modern dual-control cars for your safety.",
      actionButton: {
        text: "Book Lessons",
        action: () => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' }),
        variant: 'outline'
      }
    },
    {
      id: 6,
      title: "Prepare and pass your practical test",
      icon: Award,
      description: "Get your full UK driving license",
      hoverInfo: "The practical test lasts about 40 minutes including independent driving and possibly a manoeuvre. Pass rate is around 45%. If you pass, you'll get your full license within 3 weeks!",
      actionButton: {
        text: "Contact Us",
        action: () => {
          const message = `Hi! I'd like information about preparing for my practical driving test and booking lessons.`;
          const encodedMessage = encodeURIComponent(message);
          window.open(`https://wa.me/447756183484?text=${encodedMessage}`, '_blank');
        },
        variant: 'secondary'
      }
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            UK Driver's License Process Simplified
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Follow our step-by-step guide to get your full UK driving license. 
            We'll support you through every stage of your driving journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {processSteps.map((step, index) => {
            const Icon = step.icon;
            const isHovered = hoveredCard === step.id;
            
            return (
              <Card
                key={step.id}
                className={`relative overflow-hidden transition-all duration-500 hover:shadow-2xl cursor-pointer group ${
                  isHovered 
                    ? 'scale-105 shadow-2xl ring-2 ring-blue-500/20' 
                    : 'hover:scale-102 shadow-lg'
                }`}
                onMouseEnter={() => setHoveredCard(step.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Card Number Badge */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-600 to-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg z-10">
                  {step.id}
                </div>

                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-500 ${
                  isHovered 
                    ? 'from-blue-600/5 to-green-600/5 opacity-100' 
                    : 'from-blue-600/2 to-green-600/2 opacity-0'
                }`} />

                <CardContent className="p-8 relative z-10">
                  {/* Icon */}
                  <div className={`mb-6 transition-all duration-500 ${
                    isHovered ? 'scale-110' : 'scale-100'
                  }`}>
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold mb-4 text-gray-900 leading-tight">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {isHovered ? step.hoverInfo : step.description}
                  </p>

                  {/* Action Button */}
                  {step.actionButton && (
                    <div className={`transition-all duration-500 ${
                      isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}>
                      <Button
                        onClick={step.actionButton.action}
                        variant={step.actionButton.variant || 'default'}
                        className="w-full group/btn"
                      >
                        {step.actionButton.text}
                        <ExternalLink className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  )}

                  {/* Connection Arrow for larger screens */}
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-20">
                      <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-blue-200">
                        <ArrowRight className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                  )}
                </CardContent>

                {/* Animated Progress Indicator */}
                <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-600 to-green-600 transition-all duration-700 ${
                  isHovered ? 'w-full' : 'w-0'
                }`} />
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto border border-gray-100">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">
              Ready to Start Your Driving Journey?
            </h3>
            <p className="text-gray-600 mb-6 text-lg">
              Our expert instructors will guide you through every step. Get personalized support and increase your chances of passing first time!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-6 text-lg"
                onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Car className="w-5 h-5 mr-2" />
                Book Your First Lesson
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-6 text-lg"
                onClick={() => {
                  const message = `Hi! I'd like to know more about the UK driving license process and how you can help me get licensed.`;
                  const encodedMessage = encodeURIComponent(message);
                  window.open(`https://wa.me/447756183484?text=${encodedMessage}`, '_blank');
                }}
              >
                <Phone className="w-5 h-5 mr-2" />
                Get Free Consultation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}