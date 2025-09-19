'use client';

import { useState, useEffect } from 'react';
import { Course } from '@/components/driving-school/courses/course-card';

interface CoursesResponse {
  success: boolean;
  courses: Course[];
  error?: string;
}

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/courses');
        const data: CoursesResponse = await response.json();
        
        if (data.success && data.courses) {
          // Transform database format to component format
          const transformedCourses = data.courses.map(course => ({
            id: course.id,
            title: course.title,
            description: course.description,
            level: course.level as 'absolute-beginner' | 'beginner' | 'intermediate' | 'advanced',
            totalHours: course.total_hours || course.totalHours,
            price: parseFloat(course.price?.toString() || '0'),
            features: Array.isArray(course.features) ? course.features : 
                     typeof course.features === 'string' ? JSON.parse(course.features) : [],
            icon: course.icon ? () => null : () => null, // Icon function (can be enhanced later)
            color: course.color || 'blue',
            recommended: course.recommended || false
          }));
          
          setCourses(transformedCourses);
        } else {
          setError(data.error || 'Failed to fetch courses');
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return { courses, loading, error, refetch: () => window.location.reload() };
}