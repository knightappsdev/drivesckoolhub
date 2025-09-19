import { Course } from '@/components/driving-school/courses/course-card';

export const drivingCourses: Course[] = [
  {
    id: 'absolute-beginner',
    title: 'Absolute Beginner',
    description: 'Perfect for those who have never been behind the wheel',
    level: 'absolute-beginner',
    totalHours: 40,
    price: 1200,
    features: [
      'Complete introduction to vehicle controls and safety',
      'Dual-control vehicle for maximum safety',
      'Patient, experienced instructors specializing in new drivers',
      'Theory test preparation and mock tests included',
      'Basic road awareness and highway code training',
      'Parking and maneuvering fundamentals',
      'Confidence building exercises in quiet areas',
      'Progress tracking and personalized feedback',
      'Flexible scheduling to fit your lifestyle',
      'Certificate of completion'
    ],
    icon: () => null,
    color: 'green'
  },
  {
    id: 'beginner',
    title: 'Beginners',
    description: 'For those with some basic knowledge but limited practical experience',
    level: 'beginner',
    totalHours: 30,
    price: 900,
    features: [
      'Build upon existing basic knowledge',
      'Focus on practical driving skills development',
      'Urban and suburban driving practice',
      'Traffic navigation and road positioning',
      'Roundabout and junction handling',
      'Parking skills improvement (parallel, bay, reverse)',
      'Theory test support and practice',
      'Mock driving test preparation',
      'Hazard perception training',
      'Independent driving preparation'
    ],
    icon: () => null,
    color: 'blue',
    recommended: true
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    description: 'Advance your skills with more complex driving scenarios',
    level: 'intermediate',
    totalHours: 20,
    price: 600,
    features: [
      'Advanced junction and roundabout navigation',
      'Dual carriageway and motorway preparation',
      'Complex parking maneuvers mastery',
      'Night driving and adverse weather conditions',
      'Advanced hazard awareness and anticipation',
      'Independent driving route planning',
      'Mock test practice in test conditions',
      'Advanced vehicle control techniques',
      'Eco-driving techniques for fuel efficiency',
      'Final test preparation and polish'
    ],
    icon: () => null,
    color: 'orange'
  },
  {
    id: 'advanced',
    title: 'Advanced',
    description: 'Master advanced techniques and prepare for your test',
    level: 'advanced',
    totalHours: 15,
    price: 450,
    features: [
      'Test-standard driving practice',
      'Advanced maneuvering techniques',
      'Motorway driving instruction (Pass Plus preparation)',
      'Defensive driving strategies',
      'Advanced parking in challenging spaces',
      'Test route familiarization',
      'Last-minute test preparation',
      'Post-test advanced skills development',
      'Commercial vehicle preparation (optional)',
      'Instructor development pathway guidance'
    ],
    icon: () => null,
    color: 'red'
  }
];

export const getCourseById = (id: string): Course | undefined => {
  return drivingCourses.find(course => course.id === id);
};

export const getCoursesByLevel = (level: Course['level']): Course[] => {
  return drivingCourses.filter(course => course.level === level);
};