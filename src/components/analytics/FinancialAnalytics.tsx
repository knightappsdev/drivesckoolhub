'use client';

import { useState, useEffect } from 'react';
import { 
  CurrencyDollarIcon, 
  CreditCardIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

interface FinancialData {
  summary: {
    totalRevenue: number;
    monthlyGrowth: number;
    avgMonthlyRevenue: number;
    totalTransactions: number;
    avgTransactionValue: number;
    refunds: number;
    refundAmount: number;
    pendingPayments: number;
    pendingAmount: number;
  };
  charts: {
    monthlyRevenue: Array<{
      month: string;
      revenue: number;
      transactions: number;
      avgTransaction: number;
    }>;
    paymentMethods: Array<{
      method: string;
      count: number;
      amount: number;
      percentage: number;
    }>;
    courseRevenue: Array<{
      type: string;
      name: string;
      bookings: number;
      revenue: number;
      avgPrice: number;
    }>;
    instructorEarnings: Array<{
      name: string;
      email: string;
      totalLessons: number;
      totalEarned: number;
      avgPerLesson: number;
    }>;
  };
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const FinancialStatCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  format = 'number',
  color = 'blue' 
}: {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ComponentType<any>;
  format?: 'currency' | 'number' | 'percentage';
  color?: string;
}) => {
  const formatValue = (val: string | number) => {
    const numVal = typeof val === 'string' ? parseFloat(val) : val;
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(numVal);
      case 'percentage':
        return `${numVal.toFixed(1)}%`;
      default:
        return numVal.toLocaleString();
    }
  };

  const colorClasses = {
    blue: 'bg-blue-500 text-blue-600 bg-blue-50',
    green: 'bg-green-500 text-green-600 bg-green-50',
    yellow: 'bg-yellow-500 text-yellow-600 bg-yellow-50',
    red: 'bg-red-500 text-red-600 bg-red-50',
    purple: 'bg-purple-500 text-purple-600 bg-purple-50',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{formatValue(value)}</p>
          {change !== undefined && (
            <div className="flex items-center mt-1">
              {change > 0 ? (
                <TrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${
                change > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {Math.abs(change).toFixed(1)}%
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color as keyof typeof colorClasses].split(' ')[2]}`}>
          <Icon className={`h-6 w-6 ${colorClasses[color as keyof typeof colorClasses].split(' ')[1]}`} />
        </div>
      </div>
    </div>
  );
};

interface FinancialAnalyticsProps {
  period: string;
}

export default function FinancialAnalytics({ period }: FinancialAnalyticsProps) {
  const [data, setData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFinancialData();
  }, [period]);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/analytics/financial?period=${period}`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch financial data');
      }
      
      setData(result.data);
    } catch (err) {
      console.error('Financial analytics fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load financial data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
          <div className="text-red-600 text-sm font-medium">
            Error loading financial data: {error}
          </div>
          <button
            onClick={fetchFinancialData}
            className="ml-4 text-red-700 hover:text-red-800 text-sm underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Financial Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FinancialStatCard
          title="Total Revenue"
          value={data.summary.totalRevenue}
          change={data.summary.monthlyGrowth}
          icon={CurrencyDollarIcon}
          format="currency"
          color="green"
        />
        <FinancialStatCard
          title="Avg Monthly Revenue"
          value={data.summary.avgMonthlyRevenue}
          icon={TrendingUpIcon}
          format="currency"
          color="blue"
        />
        <FinancialStatCard
          title="Total Transactions"
          value={data.summary.totalTransactions}
          icon={CreditCardIcon}
          color="purple"
        />
        <FinancialStatCard
          title="Avg Transaction Value"
          value={data.summary.avgTransactionValue}
          icon={CurrencyDollarIcon}
          format="currency"
          color="yellow"
        />
      </div>

      {/* Warning Cards */}
      {(data.summary.refunds > 0 || data.summary.pendingPayments > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.summary.refunds > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    {data.summary.refunds} Refunds ({formatCurrency(data.summary.refundAmount)})
                  </p>
                  <p className="text-xs text-yellow-600">Monitor refund patterns for issues</p>
                </div>
              </div>
            </div>
          )}
          
          {data.summary.pendingPayments > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-orange-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-orange-800">
                    {data.summary.pendingPayments} Pending Payments ({formatCurrency(data.summary.pendingAmount)})
                  </p>
                  <p className="text-xs text-orange-600">Follow up on pending payments</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Trend */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.charts.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.charts.paymentMethods}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ method, percentage }) => `${method}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="amount"
              >
                {data.charts.paymentMethods.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Course Revenue */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.charts.courseRevenue.slice(0, 8)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Bar dataKey="revenue" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Transaction Volume */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Volume</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.charts.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="transactions"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ fill: '#f59e0b' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Earning Instructors */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Earning Instructors</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Instructor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Lessons
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Earned
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg per Lesson
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.charts.instructorEarnings.map((instructor, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {instructor.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {instructor.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {instructor.totalLessons}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                    {formatCurrency(instructor.totalEarned)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(instructor.avgPerLesson)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}