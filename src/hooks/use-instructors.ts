'use client';

import { useState, useEffect } from 'react';
import { Instructor } from '@/components/driving-school/instructors/instructor-card';

interface DatabaseInstructor {
  id: number;
  name: string;
  avatar?: string;
  rating?: number;
  reviews?: number;
  location?: string;
  experience?: number;
  specialties?: string[];
  transmissionTypes?: string[];
  pricePerHour?: number;
  availability?: string;
  bio?: string;
  languages?: string[];
  nationality?: string;
  religion?: string;
  ethnicity?: string;
  gender?: string;
}

interface InstructorsResponse {
  success: boolean;
  instructors: DatabaseInstructor[];
  total: number;
  filterOptions?: {
    locations: string[];
    specialties: string[];
    languages: string[];
    genders: string[];
    nationalities: string[];
    priceRange: { min: number; max: number };
  };
  error?: string;
}

interface InstructorFilters {
  location: string;
  transmission: string;
  specialty: string;
  minRating: string;
  maxPrice: string;
  language: string;
  gender: string;
  nationality: string;
}

export function useInstructors(filters?: Partial<InstructorFilters>) {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState<InstructorsResponse['filterOptions'] | null>(null);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        setLoading(true);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (filters?.location) params.append('location', filters.location);
        if (filters?.transmission) params.append('transmission', filters.transmission);
        if (filters?.specialty) params.append('specialty', filters.specialty);
        if (filters?.minRating) params.append('minRating', filters.minRating);
        if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice);
        if (filters?.language) params.append('language', filters.language);
        if (filters?.gender) params.append('gender', filters.gender);
        if (filters?.nationality) params.append('nationality', filters.nationality);

        const response = await fetch(`/api/instructors/enhanced?${params}`);
        const data: InstructorsResponse = await response.json();
        
        if (data.success && data.instructors) {
          // Transform database format to component format
          const transformedInstructors = data.instructors.map(instructor => ({
            id: instructor.id.toString(),
            name: instructor.name,
            avatar: instructor.avatar || `https://placehold.co/100x100/E5E7EB/374151?text=${instructor.name?.[0] || 'I'}`,
            rating: instructor.rating || 0,
            reviews: instructor.reviews || 0,
            location: instructor.location || 'Not specified',
            experience: instructor.experience || 0,
            specialties: instructor.specialties || [],
            transmissionTypes: instructor.transmissionTypes || ['manual'],
            pricePerHour: instructor.pricePerHour || 0,
            availability: instructor.availability || 'Contact for availability',
            bio: instructor.bio || 'Experienced driving instructor',
            languages: instructor.languages || ['English'],
            nationality: instructor.nationality || 'British',
            religion: instructor.religion || 'Not specified',
            ethnicity: instructor.ethnicity || 'Not specified',
            gender: instructor.gender || 'Not specified'
          }));
          
          setInstructors(transformedInstructors);
          
          if (data.filterOptions) {
            setFilterOptions(data.filterOptions);
          }
        } else {
          setError(data.error || 'Failed to fetch instructors');
        }
      } catch (err) {
        console.error('Error fetching instructors:', err);
        setError('Failed to fetch instructors');
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, [filters?.location, filters?.transmission, filters?.specialty, filters?.minRating, filters?.maxPrice, filters?.language, filters?.gender, filters?.nationality]);

  return { 
    instructors, 
    loading, 
    error, 
    filterOptions,
    refetch: () => window.location.reload() 
  };
}