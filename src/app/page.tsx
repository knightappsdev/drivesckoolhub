'use client';

import { useState } from 'react';
import HeroSection from '@/components/driving-school/landing/hero-section';
import UKLicenseProcess from '@/components/driving-school/process/uk-license-process';
import CourseCard from '@/components/driving-school/courses/course-card';
import CourseModal from '@/components/driving-school/courses/course-modal';
import { CoursePurchaseCounter } from '@/components/ui/course-purchase-counter';
import InstructorCard from '@/components/driving-school/instructors/instructor-card';
import InstructorFilters from '@/components/driving-school/instructors/instructor-filters';
import WhatsAppWidget from '@/components/driving-school/whatsapp/whatsapp-widget';
import ExitIntentPopup from '@/components/driving-school/retargeting/exit-intent-popup';
import ScrollToTop from '@/components/scroll-to-top';
// Removed RatingSystem import as Reviews section was removed
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCourses } from '@/hooks/use-courses';
import { drivingInstructors, getInstructorsByFilters } from '@/lib/data/instructors';
import { Course } from '@/components/driving-school/courses/course-card';
import { Instructor } from '@/components/driving-school/instructors/instructor-card';
import { useExitIntent } from '@/hooks/use-exit-intent';
import { ArrowRight, Star, Users, CheckCircle, Calendar, MessageCircle, Phone } from 'lucide-react';

export default function HomePage() {
  const { courses: drivingCourses, loading: coursesLoading, error: coursesError } = useCourses();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isExitIntentPopupOpen, setIsExitIntentPopupOpen] = useState(false);
  const [showWhatsAppOnExit, setShowWhatsAppOnExit] = useState(false);
  const [instructorFilters, setInstructorFilters] = useState({
    location: '',
    transmission: '',
    nationality: '',
    religion: '',
    ethnicity: '',
    gender: ''
  });
  const [filteredInstructors, setFilteredInstructors] = useState<Instructor[]>(drivingInstructors.slice(0, 6));

  // Exit intent detection
  useExitIntent({
    onExitIntent: () => {
      if (!isExitIntentPopupOpen) {
        setIsExitIntentPopupOpen(true);
        setShowWhatsAppOnExit(true);
      }
    }
  });

  const handleCourseViewDetails = (course: Course) => {
    setSelectedCourse(course);
    setIsCourseModalOpen(true);
  };

  const handleBookCourse = async (course: Course, transmissionType: string) => {
    console.log('Booking course:', course.title, 'Transmission:', transmissionType);
    setIsCourseModalOpen(false);
  };

  const handleMaybeLater = () => {
    setIsExitIntentPopupOpen(true);
  };

  const handleInstructorFiltersChange = (filters: typeof instructorFilters) => {
    setInstructorFilters(filters);
    const filtered = getInstructorsByFilters({
      location: filters.location || undefined,
      transmission: filters.transmission as 'manual' | 'automatic' || undefined,
      nationality: filters.nationality || undefined,
      religion: filters.religion || undefined,
      ethnicity: filters.ethnicity || undefined,
      gender: filters.gender as 'Male' | 'Female' | 'Non-binary' || undefined
    });
    setFilteredInstructors(filtered.length > 0 ? filtered.slice(0, 6) : drivingInstructors.slice(0, 6));
  };

  const handleExitIntentSubmit = async (data: { email: string; phone: string; name: string }) => {
    console.log('Exit intent form submitted:', data);
    const message = `New free lesson request from ${data.name}\\nEmail: ${data.email}\\nPhone: ${data.phone}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/447756183484?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleInstructorContact = (instructor: Instructor, method: 'phone' | 'whatsapp') => {
    if (method === 'phone') {
      window.open(`tel:+447123456789`, '_self');
    } else {
      const message = `Hi! I'd like to book driving lessons with ${instructor.name}. Can you help me?`;
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/447123456789?text=${encodedMessage}`, '_blank');
    }
  };

  const handleBookLessons = () => {
    document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFreeConsultation = () => {
    const message = `Hi! I'd like a free consultation to discuss my driving learning needs and get personalized advice on the best course for me.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/447756183484?text=${encodedMessage}`, '_blank');
  };

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <HeroSection onBookLessons={handleBookLessons} onFreeConsultation={handleFreeConsultation} />

      {/* UK License Process Section */}
      <UKLicenseProcess />

      {/* Courses Section */}
      <section id="courses" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Choose Your Perfect Course</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From complete beginners to advanced drivers, we have the perfect course for your skill level
            </p>
          </div>

          {coursesLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-lg h-64"></div>
                </div>
              ))}
            </div>
          ) : coursesError ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">Failed to load courses</div>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {drivingCourses.map((course) => (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  onViewDetails={handleCourseViewDetails}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Start Your Driving Journey?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of successful drivers who learned with DriveSchool Pro. Book your first lesson today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6"
              onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Calendar className="w-5 h-5 mr-2" />
              Book Now
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-white text-lg px-8 py-6 font-bold shadow-lg animate-pulse hover:animate-none transition-all duration-300 border-2"
              onClick={() => window.open('tel:+447756183484', '_self')}
            >
              <Phone className="w-5 h-5 mr-2" />
              📞 Call Us Today
            </Button>
          </div>
        </div>
      </section>

      {/* Instructors Section */}
      <section id="instructors" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Find Your Perfect Instructor</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Search by location to find experienced, qualified instructors in your area
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <InstructorFilters 
                onFiltersChange={handleInstructorFiltersChange}
                filters={instructorFilters}
              />
            </div>

            <div className="lg:col-span-3">
              {filteredInstructors.length > 0 ? (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredInstructors.map((instructor) => (
                    <InstructorCard
                      key={instructor.id}
                      instructor={instructor}
                      onViewProfile={(instructor) => {
                        const message = `Hi! I'd like to view the profile and get more information about instructor ${instructor.name}. Please provide me with detailed information about their availability and teaching style.`;
                        const encodedMessage = encodeURIComponent(message);
                        window.open(`https://wa.me/447756183484?text=${encodedMessage}`, '_blank');
                      }}
                      onContact={handleInstructorContact}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold mb-2">No instructors found</h3>
                  <p className="text-gray-600">Try adjusting your filters or contact us for availability</p>
                </div>
              )}

              {Object.values(instructorFilters).some(v => v !== '') && filteredInstructors.length > 0 && (
                <div className="text-center mt-8">
                  <Button variant="outline" size="lg">
                    View All Matching Instructors
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">What Our Students Say</h2>
            <p className="text-xl text-gray-600">Hear from thousands of successful drivers</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Emily Johnson",
                location: "City Centre",
                rating: 5,
                text: "Sarah was an amazing instructor! I passed my test on the first try thanks to her patient teaching and excellent preparation."
              },
              {
                name: "Michael Chen",
                location: "North Region",
                rating: 5,
                text: "The intensive course was perfect for me. James helped me gain confidence quickly and I felt fully prepared for my test."
              },
              {
                name: "Lucy Williams",
                location: "Central Region",
                rating: 5,
                text: "As a nervous driver, Emma made me feel comfortable from day one. Her teaching style is perfect for anxious learners."
              }
            ].map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.location}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Start Your Driving Journey Today</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Don&apos;t wait any longer. Get behind the wheel with the UK&apos;s most trusted driving school.
          </p>
          <div className="flex items-center justify-center gap-4 mb-8">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <span>No upfront payment required</span>
            <CheckCircle className="w-6 h-6 text-green-400" />
            <span>Cancel anytime</span>
            <CheckCircle className="w-6 h-6 text-green-400" />
            <span>100% satisfaction guarantee</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-lg px-8 py-6"
              onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Calendar className="w-5 h-5 mr-2" />
              Book Lessons
            </Button>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white text-lg px-8 py-6 transform hover:scale-105 transition-all duration-200"
              onClick={() => {
                const message = `Hi! I'd like a free consultation to discuss my driving learning needs and get personalized advice on the best course for me.`;
                const encodedMessage = encodeURIComponent(message);
                window.open(`https://wa.me/447756183484?text=${encodedMessage}`, '_blank');
              }}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Free Consultation
            </Button>
          </div>
        </div>
      </section>

      {/* Powered By Footer */}
      <section className="py-8 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Powered by{' '}
              <a 
                href="https://knightappsdev.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                knightappsdev
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Modals and Widgets */}
      <CourseModal
        course={selectedCourse}
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        onBookNow={handleBookCourse}
        onMaybeLater={handleMaybeLater}
      />

      <ExitIntentPopup
        isOpen={isExitIntentPopupOpen}
        onClose={() => setIsExitIntentPopupOpen(false)}
        onSubmit={handleExitIntentSubmit}
      />

      <WhatsAppWidget 
        showOnExitIntent={showWhatsAppOnExit}
        onExitIntentShow={() => setShowWhatsAppOnExit(false)}
      />

      <CoursePurchaseCounter />
      <ScrollToTop />
    </main>
  );
}