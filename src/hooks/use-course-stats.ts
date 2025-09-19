'use client';

import { useState, useEffect } from 'react';

interface CourseStats {
  studentsPurchased: number;
  recentActivity: string[];
}

const COURSE_STATS_KEY = 'course_purchase_stats';
const RELOAD_INCREMENT = 2;

// Sample activity messages
const ACTIVITY_MESSAGES = [
  'Sarah from London enrolled 2 hours ago',
  'James from Manchester just signed up',
  'Emily from Birmingham joined yesterday', 
  'David from Leeds purchased this course',
  'Lisa from Liverpool enrolled recently',
  'Michael from Sheffield just booked',
  'Anna from Bristol signed up today',
  'Chris from Nottingham joined 1 hour ago',
  'Jessica from Newcastle enrolled',
  'Daniel from Cardiff just purchased'
];

export function useCourseStats(courseId: string | number) {
  const [stats, setStats] = useState<CourseStats>({
    studentsPurchased: 100,
    recentActivity: []
  });

  useEffect(() => {
    // Get stored stats from localStorage
    const stored = localStorage.getItem(COURSE_STATS_KEY);
    let allStats: Record<string, CourseStats> = {};
    
    if (stored) {
      try {
        allStats = JSON.parse(stored);
      } catch (error) {
        console.error('Error parsing stored stats:', error);
      }
    }

    // Get or initialize stats for this course
    let courseStats = allStats[courseId.toString()];
    
    if (!courseStats) {
      // Initialize new course stats
      courseStats = {
        studentsPurchased: 100 + Math.floor(Math.random() * 50), // 100-150 base
        recentActivity: ACTIVITY_MESSAGES.slice(0, 3).sort(() => Math.random() - 0.5)
      };
      allStats[courseId.toString()] = courseStats;
    } else {
      // Increment by 2 for each page reload/revisit
      courseStats.studentsPurchased += RELOAD_INCREMENT;
      
      // Update activity occasionally
      if (Math.random() < 0.3) {
        const newActivity = ACTIVITY_MESSAGES[Math.floor(Math.random() * ACTIVITY_MESSAGES.length)];
        courseStats.recentActivity = [newActivity, ...courseStats.recentActivity.slice(0, 2)];
      }
    }

    // Save updated stats
    localStorage.setItem(COURSE_STATS_KEY, JSON.stringify(allStats));
    
    setStats(courseStats);
  }, [courseId]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.2) { // 20% chance every 30 seconds
        setStats(prev => ({
          ...prev,
          studentsPurchased: prev.studentsPurchased + 1
        }));

        // Update localStorage
        const stored = localStorage.getItem(COURSE_STATS_KEY);
        if (stored) {
          try {
            const allStats = JSON.parse(stored);
            if (allStats[courseId.toString()]) {
              allStats[courseId.toString()].studentsPurchased += 1;
              localStorage.setItem(COURSE_STATS_KEY, JSON.stringify(allStats));
            }
          } catch (error) {
            console.error('Error updating stats:', error);
          }
        }
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [courseId]);

  return stats;
}