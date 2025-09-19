'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  X,
  Clock,
  Users,
  MapPin,
  Calendar,
  Star,
  CheckCircle,
  Award,
  BookOpen,
  DollarSign,
  AlertCircle,
  User,
  Phone,
  Mail
} from 'lucide-react';

interface Course {
  id: number;
  title: string;
  description: string;
  level: string;
  totalHours: number;
  price: number;
  features: string[];
  instructor: string;
  location: string;
  duration: string;
  startDate: string;
  availability: number;
  enrolled: number;
  maxStudents: number;
  rating: number;
  reviews: number;
  category: string;
  prerequisites?: string[];
  certification: boolean;
}

interface CourseDetailModalProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
  onEnroll: () => void;
}

export default function CourseDetailModal({ course, isOpen, onClose, onEnroll }: CourseDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'instructor' | 'reviews'>('overview');

  if (!isOpen) return null;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const curriculum = [
    {
      week: 1,
      title: 'Foundation & Basic Controls',
      topics: ['Vehicle familiarization', 'Basic controls', 'Safety checks', 'Starting & stopping']
    },
    {
      week: 2,
      title: 'Traffic Navigation',
      topics: ['Traffic lights', 'Road signs', 'Roundabouts', 'Lane discipline']
    },
    {
      week: 3,
      title: 'Advanced Maneuvers',
      topics: ['Parallel parking', 'Three-point turns', 'Bay parking', 'Emergency stop']
    },
    {
      week: 4,
      title: 'Test Preparation',
      topics: ['Mock tests', 'Route practice', 'Confidence building', 'Final assessment']
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold">{course.title}</h2>
            <div className="flex items-center gap-2 mt-2">
              <Badge>{course.category}</Badge>
              <Badge variant="outline">{course.level.replace('-', ' ')}</Badge>
              {course.certification && (
                <Badge className="bg-green-100 text-green-800">
                  <Award className="w-3 h-3 mr-1" />
                  Certified
                </Badge>
              )}
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'curriculum', label: 'Curriculum' },
            { id: 'instructor', label: 'Instructor' },
            { id: 'reviews', label: 'Reviews' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 font-medium ${
                activeTab === tab.id 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Course Stats */}
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="font-bold text-lg">{course.totalHours}</div>
                  <div className="text-sm text-gray-600">Total Hours</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <div className="font-bold text-lg">{course.enrolled}/{course.maxStudents}</div>
                  <div className="text-sm text-gray-600">Enrolled</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <Calendar className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                  <div className="font-bold text-lg">{course.duration}</div>
                  <div className="text-sm text-gray-600">Duration</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <DollarSign className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <div className="font-bold text-lg">£{course.price}</div>
                  <div className="text-sm text-gray-600">Total Cost</div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-bold text-lg mb-3">Course Description</h3>
                <p className="text-gray-700 leading-relaxed">{course.description}</p>
              </div>

              {/* What You'll Learn */}
              <div>
                <h3 className="font-bold text-lg mb-3">What You'll Learn</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {course.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                      </div>
              ))}
            </div>
          </div>

          {/* Prerequisites */}
          {course.prerequisites && course.prerequisites.length > 0 && (
            <div>
              <h3 className="font-bold text-lg mb-3">Prerequisites</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-yellow-800 mb-2">Requirements:</div>
                    <ul className="space-y-1">
                      {course.prerequisites.map((req, index) => (
                        <li key={index} className="text-yellow-700">• {req}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Course Details */}
          <div>
            <h3 className="font-bold text-lg mb-3">Course Details</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span><strong>Location:</strong> {course.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span><strong>Start Date:</strong> {new Date(course.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span><strong>Class Size:</strong> Max {course.maxStudents} students</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-gray-400" />
                <span><strong>Level:</strong> {course.level.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'curriculum' && (
        <div className="space-y-6">
          <h3 className="font-bold text-lg">Course Curriculum</h3>
          <div className="space-y-4">
            {curriculum.map((week, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                      {week.week}
                    </div>
                    Week {week.week}: {week.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid md:grid-cols-2 gap-2">
                    {week.topics.map((topic, topicIndex) => (
                      <div key={topicIndex} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {topic}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">Completion Benefits</h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Official course completion certificate</li>
              <li>• Detailed progress report</li>
              <li>• Test readiness assessment</li>
              <li>• 30-day support access</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'instructor' && (
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg">{course.instructor}</h3>
              <p className="text-gray-600 mb-3">Senior Driving Instructor</p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  {renderStars(5)}
                  <span className="ml-1 font-medium">5.0</span>
                </div>
                <span className="text-gray-500">•</span>
                <span>8+ years experience</span>
                <span className="text-gray-500">•</span>
                <span>450+ students taught</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">About the Instructor</h4>
            <p className="text-gray-700 leading-relaxed">
              With over 8 years of professional driving instruction experience, {course.instructor} has helped hundreds of students 
              become confident, safe drivers. Specializing in nervous drivers and first-time learners, they bring patience, 
              expertise, and a proven track record of success to every lesson.
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-3">Specializations</h4>
            <div className="grid md:grid-cols-2 gap-2">
              {['Nervous drivers', 'First-time learners', 'Test preparation', 'City driving', 'Motorway confidence', 'Refresher courses'].map((spec, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {spec}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Certifications</h4>
            <div className="space-y-2">
              {[
                'ADI (Approved Driving Instructor) License',
                'Advanced Driving Certificate',
                'Defensive Driving Specialist',
                'First Aid Certified'
              ].map((cert, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Award className="w-4 h-4 text-blue-500" />
                  {cert}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium mb-2">Contact Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>Available during course hours</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>Direct messaging through student portal</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg">Student Reviews</h3>
            <div className="flex items-center gap-2">
              <div className="flex">{renderStars(Math.floor(course.rating))}</div>
              <span className="font-bold">{course.rating}</span>
              <span className="text-gray-500">({course.reviews} reviews)</span>
            </div>
          </div>

          {/* Review Summary */}
          <div className="grid grid-cols-5 gap-2 text-sm">
            {[5, 4, 3, 2, 1].map(stars => (
              <div key={stars} className="flex items-center gap-2">
                <span>{stars}</span>
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full" 
                    style={{ width: `${stars === 5 ? 70 : stars === 4 ? 20 : stars === 3 ? 7 : stars === 2 ? 2 : 1}%` }}
                  ></div>
                </div>
                <span className="text-gray-500">
                  {stars === 5 ? '70%' : stars === 4 ? '20%' : stars === 3 ? '7%' : stars === 2 ? '2%' : '1%'}
                </span>
              </div>
            ))}
          </div>

          {/* Individual Reviews */}
          <div className="space-y-4">
            {[
              {
                name: 'Sarah M.',
                rating: 5,
                date: '2 weeks ago',
                comment: 'Excellent course! The instructor was patient and knowledgeable. I passed my test first time thanks to this course.'
              },
              {
                name: 'Mike R.',
                rating: 5,
                date: '1 month ago',
                comment: 'Very comprehensive and well-structured. Great value for money and the flexible scheduling was perfect for my work schedule.'
              },
              {
                name: 'Emma L.',
                rating: 4,
                date: '1 month ago',
                comment: 'Good course overall. Would have liked more practice on motorways but otherwise very satisfied with the instruction.'
              }
            ].map((review, index) => (
              <Card key={index}>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium">{review.name}</div>
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>

    {/* Footer */}
    <div className="border-t p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold text-blue-600">£{course.price}</div>
          <div className="text-sm text-gray-500">Total course fee</div>
          {course.availability <= 5 && course.availability > 0 && (
            <div className="text-sm text-orange-600 font-medium">
              Only {course.availability} spots remaining!
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button 
            onClick={onEnroll}
            disabled={course.availability === 0}
            className="px-8"
          >
            {course.availability > 0 ? 'Enroll Now' : 'Join Waitlist'}
          </Button>
        </div>
      </div>
    </div>
  </div>
</div>
); }