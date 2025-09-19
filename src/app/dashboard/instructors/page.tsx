'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  UserPlusIcon,
  MagnifyingGlassIcon,
  StarIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { User } from '@/lib/auth';
import { toast } from 'react-hot-toast';

interface Instructor {
  id: number;
  instructor_code: string;
  license_number: string;
  certification_level: string;
  specialties: string[];
  hourly_rate: number;
  years_experience: number;
  rating: number;
  total_lessons: number;
  is_available: boolean;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

export default function InstructorsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        fetchInstructors();
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      router.push('/login');
    }
  };

  const fetchInstructors = async () => {
    try {
      const response = await fetch('/api/instructors');
      if (response.ok) {
        const data = await response.json();
        setInstructors(data.data || []);
      } else {
        toast.error('Failed to load instructors');
      }
    } catch (error) {
      console.error('Error fetching instructors:', error);
      toast.error('Failed to load instructors');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading instructors...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const filteredInstructors = instructors.filter(instructor =>
    instructor.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.instructor_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCertificationBadgeColor = (level: string) => {
    switch (level) {
      case 'expert':
        return 'bg-purple-100 text-purple-800';
      case 'advanced':
        return 'bg-blue-100 text-blue-800';
      case 'beginner':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <DashboardLayout user={user}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Instructors</h1>
              <p className="mt-2 text-gray-600">Manage driving instructors and their assignments</p>
            </div>
            {(user.role === 'super_admin' || user.role === 'admin') && (
              <motion.button
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <UserPlusIcon className="w-5 h-5 mr-2" />
                Add Instructor
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search instructors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </motion.div>

        {/* Instructors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInstructors.map((instructor, index) => (
            <motion.div
              key={instructor.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold text-blue-600">
                      {instructor.first_name.charAt(0)}{instructor.last_name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    {instructor.is_available ? (
                      <CheckCircleIcon className="w-6 h-6 text-green-500" title="Available" />
                    ) : (
                      <XCircleIcon className="w-6 h-6 text-red-500" title="Unavailable" />
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {instructor.first_name} {instructor.last_name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Code: {instructor.instructor_code}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  {instructor.email}
                </p>

                <div className="flex items-center mb-3">
                  <div className="flex">{getRatingStars(instructor.rating)}</div>
                  <span className="ml-2 text-sm text-gray-600">
                    {instructor.rating.toFixed(1)} ({instructor.total_lessons} lessons)
                  </span>
                </div>

                <div className="mb-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getCertificationBadgeColor(instructor.certification_level)}`}>
                    {instructor.certification_level}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex justify-between">
                    <span>Experience:</span>
                    <span>{instructor.years_experience} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hourly Rate:</span>
                    <span>${instructor.hourly_rate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>License:</span>
                    <span>{instructor.license_number}</span>
                  </div>
                </div>

                {instructor.specialties.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Specialties:</p>
                    <div className="flex flex-wrap gap-1">
                      {instructor.specialties.map((specialty, idx) => (
                        <span
                          key={idx}
                          className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                        >
                          {specialty.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <motion.button
                    className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View Profile
                  </motion.button>
                  {(user.role === 'super_admin' || user.role === 'admin') && (
                    <motion.button
                      className="flex-1 px-3 py-2 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Assign Students
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredInstructors.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-gray-500">
              <UserPlusIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium mb-2">No instructors found</h3>
              <p>
                {searchTerm
                  ? `No instructors match "${searchTerm}"`
                  : 'No instructors have been added yet'}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}