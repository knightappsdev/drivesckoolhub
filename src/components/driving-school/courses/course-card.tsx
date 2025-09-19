'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Car, Users, Trophy, Star } from 'lucide-react';

export interface Course {
  id: string;
  title: string;
  description: string;
  level: 'absolute-beginner' | 'beginner' | 'intermediate' | 'advanced';
  totalHours: number;
  price: number;
  features: string[];
  icon: React.ComponentType<any>;
  color: string;
  recommended?: boolean;
}

interface CourseCardProps {
  course: Course;
  onViewDetails: (course: Course) => void;
}

const levelIcons = {
  'absolute-beginner': Users,
  'beginner': Car,
  'intermediate': Clock,
  'advanced': Trophy
};

const levelColors = {
  'absolute-beginner': 'from-green-400 to-green-600',
  'beginner': 'from-blue-400 to-blue-600', 
  'intermediate': 'from-orange-400 to-orange-600',
  'advanced': 'from-red-400 to-red-600'
};

export default function CourseCard({ course, onViewDetails }: CourseCardProps) {
  const IconComponent = levelIcons[course.level];
  const gradientColor = levelColors[course.level];

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer relative ${course.recommended ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
      {course.recommended && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 z-10">
          <Star className="w-3 h-3 fill-white" />
          Recommended
        </div>
      )}
      <CardHeader className="pb-3">
        <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${gradientColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
          <IconComponent className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
          {course.title}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {course.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>{course.totalHours} hours</span>
          </div>
          <div className="font-bold text-lg text-primary">£{course.price}</div>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium text-sm">What you'll learn:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            {course.features.slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                {feature}
              </li>
            ))}
            {course.features.length > 3 && (
              <li className="text-primary font-medium">
                +{course.features.length - 3} more benefits
              </li>
            )}
          </ul>
        </div>

        <Button 
          onClick={() => onViewDetails(course)} 
          className="w-full group-hover:bg-primary/90 transition-colors"
        >
          View Details & Book
        </Button>
      </CardContent>
    </Card>
  );
}