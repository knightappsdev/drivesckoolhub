'use client';

import { ReactNode, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bars3Icon, 
  XMarkIcon,
  HomeIcon,
  UsersIcon,
  CalendarIcon,
  CreditCardIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  CogIcon,
  UserCircleIcon,
  PowerIcon,
  ShieldCheckIcon,
  BellIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { User } from '@/lib/auth';
import { toast } from 'react-hot-toast';
import ChatIntegration from '@/components/chat/ChatIntegration';
import NotificationBell from '@/components/notifications/NotificationBell';

interface DashboardLayoutProps {
  children: ReactNode;
  user: User;
}

const navigationItems = {
  super_admin: [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Users', href: '/dashboard/users', icon: UsersIcon },
    { name: 'Instructors', href: '/dashboard/instructors', icon: UserCircleIcon },
    { name: 'Students', href: '/dashboard/students', icon: UsersIcon },
    { name: 'Bookings', href: '/dashboard/bookings', icon: CalendarIcon },
    { name: 'Payments', href: '/dashboard/payments', icon: CreditCardIcon },
    { name: 'Messages', href: '/dashboard/messages', icon: ChatBubbleLeftRightIcon },
    { name: 'Notifications', href: '/dashboard/notifications', icon: BellIcon },
    { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBarIcon },
    { name: 'Audit Trail', href: '/dashboard/audit', icon: ShieldCheckIcon },
    { name: 'Settings', href: '/dashboard/settings', icon: CogIcon },
    { name: 'Layout Manager', href: '/dashboard/settings/layout', icon: Cog6ToothIcon },
  ],
  admin: [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Instructors', href: '/dashboard/instructors', icon: UserCircleIcon },
    { name: 'Students', href: '/dashboard/students', icon: UsersIcon },
    { name: 'Bookings', href: '/dashboard/bookings', icon: CalendarIcon },
    { name: 'Payments', href: '/dashboard/payments', icon: CreditCardIcon },
    { name: 'Messages', href: '/dashboard/messages', icon: ChatBubbleLeftRightIcon },
    { name: 'Notifications', href: '/dashboard/notifications', icon: BellIcon },
    { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBarIcon },
  ],
  instructor: [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'My Students', href: '/dashboard/students', icon: UsersIcon },
    { name: 'Schedule', href: '/dashboard/bookings', icon: CalendarIcon },
    { name: 'Lessons', href: '/dashboard/lessons', icon: ChartBarIcon },
    { name: 'Messages', href: '/dashboard/messages', icon: ChatBubbleLeftRightIcon },
    { name: 'Notifications', href: '/dashboard/notifications', icon: BellIcon },
    { name: 'Profile', href: '/dashboard/profile', icon: UserCircleIcon },
  ],
  student: [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'My Lessons', href: '/dashboard/lessons', icon: CalendarIcon },
    { name: 'Bookings', href: '/dashboard/bookings', icon: CalendarIcon },
    { name: 'Payments', href: '/dashboard/payments', icon: CreditCardIcon },
    { name: 'Messages', href: '/dashboard/messages', icon: ChatBubbleLeftRightIcon },
    { name: 'Notifications', href: '/dashboard/notifications', icon: BellIcon },
    { name: 'Profile', href: '/dashboard/profile', icon: UserCircleIcon },
  ],
};

export default function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        toast.success('Logged out successfully');
        router.push('/');
      } else {
        toast.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  const navigation = navigationItems[user.role] || [];

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 40
      }
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 40
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-white shadow-lg">
          <div className="flex items-center flex-shrink-0 px-6 py-4 border-b">
            <a href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
              DriveSchool Pro
            </a>
          </div>
          
          <div className="flex flex-col flex-1 overflow-y-auto">
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </motion.a>
                );
              })}
            </nav>

            {/* User Profile Section */}
            <div className="px-4 py-6 border-t">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">
                    {user.first_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{user.role.replace('_', ' ')}</p>
                </div>
              </div>
              
              <motion.button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <PowerIcon className="w-5 h-5 mr-3" />
                Logout
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
            />
            <motion.div
              className="fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg lg:hidden"
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                  <a href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                    DriveSchool Pro
                  </a>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-1 rounded-md hover:bg-gray-100"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
                
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={item.name}
                        href={item.href}
                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        {item.name}
                      </a>
                    );
                  })}
                </nav>

                <div className="px-4 py-6 border-t">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-white">
                        {user.first_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">{user.role.replace('_', ' ')}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <PowerIcon className="w-5 h-5 mr-3" />
                    Logout
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 lg:pl-64">
        {/* Desktop Top Bar */}
        <div className="hidden lg:block bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex-1" />
            <div className="flex items-center space-x-4">
              <NotificationBell userId={user.id} />
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">
                    {user.first_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{user.role.replace('_', ' ')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Top Bar */}
        <div className="bg-white shadow-sm border-b lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">DriveSchool Pro</h1>
            <NotificationBell userId={user.id} />
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1">
          <motion.div
            className="py-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
      
      {/* Chat Integration */}
      <ChatIntegration token={user.token} />
    </div>
  );
}