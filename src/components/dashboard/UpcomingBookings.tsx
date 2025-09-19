'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { format, parseISO } from 'date-fns';

interface Booking {
  id: number;
  booking_date: string;
  start_time: string;
  end_time: string;
  student_name: string;
  instructor_name: string;
  course_name: string;
  status: string;
}

const statusColors = {
  scheduled: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
  rescheduled: 'bg-purple-100 text-purple-800',
};

export default function UpcomingBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      
      const data = await response.json();
      if (data.success) {
        setBookings(data.data.upcomingBookings || []);
      } else {
        throw new Error(data.error || 'Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to load upcoming bookings');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <motion.div 
        className="bg-white shadow-lg rounded-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Upcoming Bookings</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex space-x-4">
                  <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="bg-white shadow-lg rounded-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Upcoming Bookings</h3>
        </div>
        <div className="p-6">
          <div className="text-center text-red-600">{error}</div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="bg-white shadow-lg rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Upcoming Bookings</h3>
          <CalendarDaysIcon className="h-6 w-6 text-gray-400" />
        </div>
      </div>
      
      <div className="divide-y divide-gray-200">
        {bookings.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <p>No upcoming bookings found</p>
          </div>
        ) : (
          bookings.map((booking, index) => (
            <motion.div
              key={booking.id}
              className="p-6 hover:bg-gray-50 transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ClockIcon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {booking.course_name}
                    </p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      statusColors[booking.status as keyof typeof statusColors]
                    }`}>
                      {booking.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="mt-2 flex items-center text-sm text-gray-500 space-x-4">
                    <div className="flex items-center">
                      <CalendarDaysIcon className="w-4 h-4 mr-1" />
                      {format(parseISO(booking.booking_date), 'MMM dd, yyyy')}
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      {booking.start_time} - {booking.end_time}
                    </div>
                  </div>
                  
                  <div className="mt-2 flex items-center text-sm text-gray-600 space-x-4">
                    <div className="flex items-center">
                      <UserIcon className="w-4 h-4 mr-1" />
                      Student: {booking.student_name}
                    </div>
                    <div className="flex items-center">
                      <AcademicCapIcon className="w-4 h-4 mr-1" />
                      Instructor: {booking.instructor_name}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
      
      {bookings.length > 0 && (
        <div className="px-6 py-3 border-t border-gray-200">
          <motion.a
            href="/dashboard/bookings"
            className="text-sm text-blue-600 hover:text-blue-500 font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            View all bookings →
          </motion.a>
        </div>
      )}
    </motion.div>
  );
}