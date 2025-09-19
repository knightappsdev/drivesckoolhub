'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from 'lucide-react';

interface PurchaseNotification {
  id: string;
  userName: string;
  courseName: string;
  timestamp: Date;
}

const SAMPLE_USERS = [
  'Sarah M.', 'James K.', 'Emily R.', 'David L.', 'Lisa P.', 'Michael S.',
  'Anna T.', 'Chris W.', 'Jessica H.', 'Daniel B.', 'Sophie C.', 'Ryan F.',
  'Maria G.', 'Alex J.', 'Katie N.', 'Tom V.', 'Emma D.', 'Luke H.',
  'Grace L.', 'Ben M.', 'Chloe R.', 'Jack S.', 'Mia T.', 'Noah W.'
];

const SAMPLE_COURSES = [
  'Complete Beginner Course',
  'Advanced Driving Skills',
  'Intensive Weekly Course',
  'Weekend Driving Course',
  'Automatic Transmission Course',
  'Manual Transmission Course',
  'Pass Plus Course'
];

export function CoursePurchaseCounter() {
  const [recentNotifications, setRecentNotifications] = useState<PurchaseNotification[]>([]);

  // Generate random purchase notification
  const generatePurchaseNotification = (): PurchaseNotification => {
    const randomUser = SAMPLE_USERS[Math.floor(Math.random() * SAMPLE_USERS.length)];
    const randomCourse = SAMPLE_COURSES[Math.floor(Math.random() * SAMPLE_COURSES.length)];
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      userName: randomUser,
      courseName: randomCourse,
      timestamp: new Date()
    };
  };

  // Simulate purchase notifications
  const simulateClientSidePurchase = useCallback(() => {
    const newNotification = generatePurchaseNotification();
    setRecentNotifications(prev => {
      const updated = [newNotification, ...prev.slice(0, 0)]; // Only keep the latest one
      return updated;
    });
  }, []);

  // Add purchase simulation for demonstration
  useEffect(() => {
    // Show initial notification after 2 seconds
    const initialTimer = setTimeout(simulateClientSidePurchase, 2000);
    
    const interval = setInterval(() => {
      // 40% chance to simulate a purchase every 30-60 seconds
      if (Math.random() < 0.4) {
        const randomDelay = 30000 + Math.random() * 30000; // 30-60 seconds
        setTimeout(simulateClientSidePurchase, randomDelay);
      }
    }, 45000); // Check every 45 seconds

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [simulateClientSidePurchase]);

  // Auto-hide notifications after 6 seconds
  useEffect(() => {
    if (recentNotifications.length > 0) {
      const timer = setTimeout(() => {
        setRecentNotifications([]);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [recentNotifications]);

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {/* Simplified Purchase Notifications */}
      <AnimatePresence>
        {recentNotifications.slice(0, 1).map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: -100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="bg-white/95 backdrop-blur-sm border border-green-200 rounded-lg shadow-lg p-2 w-44 border-l-4 border-l-green-500"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-3 h-3 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-800 truncate">
                  {notification.userName}
                </p>
                <p className="text-xs text-gray-600 truncate">
                  {notification.courseName}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}