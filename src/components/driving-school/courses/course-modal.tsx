'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { X, Clock, Car, CheckCircle, Users, TrendingUp, Activity } from 'lucide-react';
import { Course } from './course-card';
import { useCourseStats } from '@/hooks/use-course-stats';

interface CourseModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onBookNow: (course: Course, transmissionType: string) => void;
  onMaybeLater: () => void;
}

export default function CourseModal({ course, isOpen, onClose, onBookNow, onMaybeLater }: CourseModalProps) {
  const [transmissionType, setTransmissionType] = useState<string>('manual');
  const courseStats = useCourseStats(course?.id || 0);

  if (!isOpen || !course) return null;

  const handleBookNow = () => {
    // Create booking message for WhatsApp and email
    const message = `Hello! I'd like to book the ${course.title} course.

Course Details:
- Course: ${course.title}
- Duration: ${course.totalHours} hours
- Price: £${course.price}
- Transmission: ${transmissionType}

Please contact me to arrange the booking. Thank you!`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/447756183484?text=${encodedMessage}`;
    const emailSubject = encodeURIComponent(`Booking Request: ${course.title} Course`);
    const emailBody = encodeURIComponent(message);
    const emailUrl = `mailto:drivingschool@ofemo.uk?subject=${emailSubject}&body=${emailBody}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Also open email client
    setTimeout(() => {
      window.open(emailUrl, '_blank');
    }, 1000);
    
    onBookNow(course, transmissionType);
  };

  const handleMaybeLater = () => {
    onMaybeLater();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <CardTitle className="text-2xl font-bold pr-12">{course.title}</CardTitle>
          <CardDescription className="text-base">{course.description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Live Stats Banner */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <h3 className="font-semibold text-green-800">Live Course Stats</h3>
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-3">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Students</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">{courseStats.studentsPurchased}</div>
                <div className="text-xs text-gray-600">enrolled</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Activity className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Rating</span>
                </div>
                <div className="text-2xl font-bold text-green-600">4.8</div>
                <div className="text-xs text-gray-600">out of 5</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">Success</span>
                </div>
                <div className="text-2xl font-bold text-purple-600">94%</div>
                <div className="text-xs text-gray-600">pass rate</div>
              </div>
            </div>
            
            <div className="border-t border-green-200 pt-3">
              <div className="text-sm font-medium text-gray-700 mb-2">Recent Activity:</div>
              <div className="space-y-1">
                {courseStats.recentActivity.slice(0, 2).map((activity, index) => (
                  <div key={index} className="text-xs text-gray-600 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    {activity}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Course Overview */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Clock className="w-6 h-6 text-primary" />
              <div>
                <div className="font-medium">Total Hours</div>
                <div className="text-2xl font-bold text-primary">{course.totalHours}h</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Car className="w-6 h-6 text-primary" />
              <div>
                <div className="font-medium">Course Price</div>
                <div className="text-2xl font-bold text-primary">£{course.price}</div>
              </div>
            </div>
          </div>

          {/* Transmission Type Selection */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Choose Transmission Type</h3>
            <RadioGroup value={transmissionType} onValueChange={setTransmissionType}>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="manual" id="manual" />
                <Label htmlFor="manual" className="flex-1 cursor-pointer">
                  <div className="font-medium">Manual Transmission</div>
                  <div className="text-sm text-muted-foreground">
                    Learn with traditional manual gearbox - more control and skills
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="automatic" id="automatic" />
                <Label htmlFor="automatic" className="flex-1 cursor-pointer">
                  <div className="font-medium">Automatic Transmission</div>
                  <div className="text-sm text-muted-foreground">
                    Focus on road skills without worrying about gear changes
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Course Features */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">What's Included</h3>
            <div className="grid gap-2">
              {course.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Course Benefits */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Why Choose This Course?</h4>
            <div className="grid gap-2 text-sm text-blue-800">
              <div>✓ Qualified and experienced instructors</div>
              <div>✓ Flexible scheduling to fit your lifestyle</div>
              <div>✓ Modern, dual-control vehicles</div>
              <div>✓ Theory test preparation included</div>
              <div>✓ Mock test sessions</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={handleMaybeLater} className="flex-1">
              Maybe Later
            </Button>
            <Button onClick={handleBookNow} className="flex-1 bg-primary hover:bg-primary/90">
              Book Now - £{course.price}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}