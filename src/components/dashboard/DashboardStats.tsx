'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  UsersIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  AcademicCapIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

interface DashboardStatsData {
  totalUsers: number;
  totalInstructors: number;
  totalStudents: number;
  upcomingBookings: number;
  completedLessons: number;
  totalRevenue: number;
}

interface StatCardProps {
  name: string;
  value: string | number;
  icon: React.ElementType;
  change?: string;
  changeType?: 'positive' | 'negative';
  delay?: number;
}

function StatCard({ name, value, icon: Icon, change, changeType = 'positive', delay = 0 }: StatCardProps) {
  return (
    <motion.div
      className="bg-white overflow-hidden shadow-lg rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
    >
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{name}</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
        {change && (
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <ArrowTrendingUpIcon 
                className={`h-4 w-4 ${
                  changeType === 'positive' ? 'text-green-500' : 'text-red-500'
                }`} 
              />
              <span 
                className={`ml-1 ${
                  changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {change}
              </span>
              <span className="ml-1 text-gray-500">from last month</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function DashboardStats() {
  const [stats, setStats] = useState<DashboardStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      
      const data = await response.json();
      if (data.success) {
        setStats(data.data.stats);
      } else {
        throw new Error(data.error || 'Failed to fetch stats');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white overflow-hidden shadow rounded-lg animate-pulse">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-6 w-6 bg-gray-200 rounded"></div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-700">{error}</div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const statCards = [
    {
      name: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: UsersIcon,
      change: '+4.75%',
      changeType: 'positive' as const,
    },
    {
      name: 'Active Instructors',
      value: stats.totalInstructors.toLocaleString(),
      icon: AcademicCapIcon,
      change: '+2.02%',
      changeType: 'positive' as const,
    },
    {
      name: 'Enrolled Students',
      value: stats.totalStudents.toLocaleString(),
      icon: UserGroupIcon,
      change: '+8.12%',
      changeType: 'positive' as const,
    },
    {
      name: 'Upcoming Bookings',
      value: stats.upcomingBookings.toLocaleString(),
      icon: CalendarDaysIcon,
      change: '+3.48%',
      changeType: 'positive' as const,
    },
    {
      name: 'Completed Lessons',
      value: stats.completedLessons.toLocaleString(),
      icon: AcademicCapIcon,
      change: '+12.03%',
      changeType: 'positive' as const,
    },
    {
      name: 'Monthly Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: CurrencyDollarIcon,
      change: '+16.24%',
      changeType: 'positive' as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {statCards.map((stat, index) => (
        <StatCard
          key={stat.name}
          name={stat.name}
          value={stat.value}
          icon={stat.icon}
          change={stat.change}
          changeType={stat.changeType}
          delay={index * 0.1}
        />
      ))}
    </div>
  );
}