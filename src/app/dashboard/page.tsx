'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardStats from '@/components/dashboard/DashboardStats';
import UpcomingBookings from '@/components/dashboard/UpcomingBookings';
import { User } from '@/lib/auth';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
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
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    let greeting = 'Hello';
    
    if (hour < 12) greeting = 'Good morning';
    else if (hour < 18) greeting = 'Good afternoon';
    else greeting = 'Good evening';
    
    return `${greeting}, ${user.first_name}!`;
  };

  const getRoleDashboardContent = () => {
    switch (user.role) {
      case 'super_admin':
        return (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DashboardStats />
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              <UpcomingBookings />
              
              <motion.div
                className="bg-white shadow-lg rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <motion.a
                      href="/dashboard/users"
                      className="p-4 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-2xl mb-2">👥</div>
                      <div className="text-sm font-medium">Manage Users</div>
                    </motion.a>
                    <motion.a
                      href="/dashboard/instructors"
                      className="p-4 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-2xl mb-2">🎓</div>
                      <div className="text-sm font-medium">Assign Instructors</div>
                    </motion.a>
                    <motion.a
                      href="/dashboard/analytics"
                      className="p-4 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-2xl mb-2">📊</div>
                      <div className="text-sm font-medium">View Analytics</div>
                    </motion.a>
                    <motion.a
                      href="/dashboard/settings"
                      className="p-4 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-2xl mb-2">⚙️</div>
                      <div className="text-sm font-medium">System Settings</div>
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        );
      
      case 'admin':
        return (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DashboardStats />
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              <UpcomingBookings />
              
              <motion.div
                className="bg-white shadow-lg rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Admin Actions</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <motion.a
                      href="/dashboard/instructors"
                      className="p-4 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-2xl mb-2">🎓</div>
                      <div className="text-sm font-medium">Manage Instructors</div>
                    </motion.a>
                    <motion.a
                      href="/dashboard/students"
                      className="p-4 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-2xl mb-2">👨‍🎓</div>
                      <div className="text-sm font-medium">Manage Students</div>
                    </motion.a>
                    <motion.a
                      href="/dashboard/bookings"
                      className="p-4 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-2xl mb-2">📅</div>
                      <div className="text-sm font-medium">Manage Bookings</div>
                    </motion.a>
                    <motion.a
                      href="/dashboard/analytics"
                      className="p-4 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-2xl mb-2">📊</div>
                      <div className="text-sm font-medium">View Reports</div>
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        );
      
      case 'instructor':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              className="bg-white shadow-lg rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Today's Schedule</h3>
              </div>
              <div className="p-6">
                <div className="text-center text-gray-500">
                  <div className="text-3xl mb-3">📅</div>
                  <p>No lessons scheduled for today</p>
                  <motion.a
                    href="/dashboard/bookings"
                    className="mt-4 inline-block text-blue-600 hover:text-blue-500"
                    whileHover={{ scale: 1.02 }}
                  >
                    View full schedule →
                  </motion.a>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              className="bg-white shadow-lg rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">My Students</h3>
              </div>
              <div className="p-6">
                <div className="text-center text-gray-500">
                  <div className="text-3xl mb-3">👨‍🎓</div>
                  <p>No students assigned yet</p>
                  <motion.a
                    href="/dashboard/students"
                    className="mt-4 inline-block text-blue-600 hover:text-blue-500"
                    whileHover={{ scale: 1.02 }}
                  >
                    View all students →
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </div>
        );
      
      case 'student':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              className="bg-white shadow-lg rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">My Progress</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm font-medium mb-1">
                      <span>Lessons Completed</span>
                      <span>12 / 20</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div 
                        className="bg-blue-600 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: '60%' }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm font-medium mb-1">
                      <span>Hours Completed</span>
                      <span>24 / 40</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div 
                        className="bg-green-600 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: '60%' }}
                        transition={{ duration: 1, delay: 0.7 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              className="bg-white shadow-lg rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <motion.a
                    href="/dashboard/bookings"
                    className="p-4 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-2xl mb-2">📅</div>
                    <div className="text-sm font-medium">Book Lesson</div>
                  </motion.a>
                  <motion.a
                    href="/dashboard/lessons"
                    className="p-4 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-2xl mb-2">📚</div>
                    <div className="text-sm font-medium">View Lessons</div>
                  </motion.a>
                  <motion.a
                    href="/dashboard/payments"
                    className="p-4 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-2xl mb-2">💳</div>
                    <div className="text-sm font-medium">Make Payment</div>
                  </motion.a>
                  <motion.a
                    href="/dashboard/messages"
                    className="p-4 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-2xl mb-2">💬</div>
                    <div className="text-sm font-medium">Messages</div>
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </div>
        );
      
      default:
        return (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <p className="text-gray-600">Welcome to DriveSchool Pro!</p>
          </div>
        );
    }
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
          <h1 className="text-3xl font-bold text-gray-900">
            {getWelcomeMessage()}
          </h1>
          <p className="mt-2 text-gray-600 capitalize">
            {user.role.replace('_', ' ')} Dashboard
          </p>
        </motion.div>

        {getRoleDashboardContent()}
      </div>
    </DashboardLayout>
  );
}