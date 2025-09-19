'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  MagnifyingGlassIcon,
  EyeIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  UserIcon,
  ComputerDesktopIcon,
  ClockIcon,
  FilterIcon
} from '@heroicons/react/24/outline';

interface AuditLog {
  id: number;
  action: string;
  table_name?: string;
  record_id?: number;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

interface SystemEvent {
  id: number;
  event_type: string;
  event_data?: Record<string, any>;
  severity: 'info' | 'warning' | 'error' | 'critical';
  source?: string;
  created_at: string;
}

interface LoginAttempt {
  id: number;
  email: string;
  ip_address: string;
  user_agent?: string;
  success: boolean;
  failure_reason?: string;
  created_at: string;
}

const AuditLogRow = ({ log }: { log: AuditLog }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getActionColor = (action: string) => {
    const colors = {
      CREATE: 'bg-green-100 text-green-800',
      UPDATE: 'bg-blue-100 text-blue-800',
      DELETE: 'bg-red-100 text-red-800',
      LOGIN: 'bg-purple-100 text-purple-800',
      LOGOUT: 'bg-gray-100 text-gray-800',
      PAYMENT_CREATED: 'bg-yellow-100 text-yellow-800',
      PAYMENT_COMPLETED: 'bg-green-100 text-green-800',
      PAYMENT_FAILED: 'bg-red-100 text-red-800',
    };
    return colors[action as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <>
      <tr className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-8 w-8">
              {log.user ? (
                <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold text-white">
                    {log.user.firstName.charAt(0)}{log.user.lastName.charAt(0)}
                  </span>
                </div>
              ) : (
                <div className="h-8 w-8 bg-gray-400 rounded-full flex items-center justify-center">
                  <ComputerDesktopIcon className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">
                {log.user ? `${log.user.firstName} ${log.user.lastName}` : 'System'}
              </div>
              <div className="text-sm text-gray-500">
                {log.user?.email || log.ip_address}
              </div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActionColor(log.action)}`}>
            {log.action}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {log.table_name || '-'}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {log.record_id || '-'}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {format(new Date(log.created_at), 'MMM dd, yyyy HH:mm')}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {log.ip_address || '-'}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-blue-600 hover:text-blue-900"
          >
            <EyeIcon className="h-5 w-5" />
          </button>
        </td>
      </tr>
      {showDetails && (
        <tr className="bg-gray-50">
          <td colSpan={7} className="px-6 py-4">
            <div className="space-y-3">
              {log.old_values && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Previous Values:</h4>
                  <pre className="mt-1 text-xs text-gray-600 bg-white p-2 rounded border overflow-x-auto">
                    {JSON.stringify(log.old_values, null, 2)}
                  </pre>
                </div>
              )}
              {log.new_values && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900">New Values:</h4>
                  <pre className="mt-1 text-xs text-gray-600 bg-white p-2 rounded border overflow-x-auto">
                    {JSON.stringify(log.new_values, null, 2)}
                  </pre>
                </div>
              )}
              {log.user_agent && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900">User Agent:</h4>
                  <p className="mt-1 text-xs text-gray-600">{log.user_agent}</p>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

const SystemEventRow = ({ event }: { event: SystemEvent }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getSeverityColor = (severity: string) => {
    const colors = {
      info: 'bg-blue-100 text-blue-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
      critical: 'bg-red-200 text-red-900 font-bold',
    };
    return colors[severity as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <>
      <tr className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          {event.event_type}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(event.severity)}`}>
            {event.severity.toUpperCase()}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {event.source || 'System'}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {format(new Date(event.created_at), 'MMM dd, yyyy HH:mm')}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-blue-600 hover:text-blue-900"
          >
            <EyeIcon className="h-5 w-5" />
          </button>
        </td>
      </tr>
      {showDetails && event.event_data && (
        <tr className="bg-gray-50">
          <td colSpan={5} className="px-6 py-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Event Data:</h4>
              <pre className="mt-1 text-xs text-gray-600 bg-white p-2 rounded border overflow-x-auto">
                {JSON.stringify(event.event_data, null, 2)}
              </pre>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

const LoginAttemptRow = ({ attempt }: { attempt: LoginAttempt }) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {attempt.email}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          attempt.success 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {attempt.success ? 'Success' : 'Failed'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {attempt.ip_address}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {attempt.failure_reason || '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {format(new Date(attempt.created_at), 'MMM dd, yyyy HH:mm')}
      </td>
    </tr>
  );
};

export default function AuditPage() {
  const [activeTab, setActiveTab] = useState('logs');
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [systemEvents, setSystemEvents] = useState<SystemEvent[]>([]);
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    action: '',
    severity: '',
    email: '',
    success: ''
  });

  const tabs = [
    { id: 'logs', name: 'Audit Logs', icon: ShieldCheckIcon },
    { id: 'events', name: 'System Events', icon: ComputerDesktopIcon },
    { id: 'logins', name: 'Login Attempts', icon: UserIcon },
  ];

  useEffect(() => {
    fetchData();
  }, [activeTab, filters]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      let url = '';
      const params = new URLSearchParams();

      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      switch (activeTab) {
        case 'logs':
          url = '/api/audit/logs';
          if (filters.action) params.append('action', filters.action);
          break;
        case 'events':
          url = '/api/audit/events';
          if (filters.severity) params.append('severity', filters.severity);
          break;
        case 'logins':
          url = '/api/audit/login-attempts';
          if (filters.email) params.append('email', filters.email);
          if (filters.success) params.append('success', filters.success);
          break;
      }

      const response = await fetch(`${url}?${params.toString()}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch data');
      }

      switch (activeTab) {
        case 'logs':
          setAuditLogs(result.data.logs);
          break;
        case 'events':
          setSystemEvents(result.data.events);
          break;
        case 'logins':
          setLoginAttempts(result.data.attempts);
          break;
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (error && error.includes('Insufficient permissions')) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Access Denied</h3>
          <p className="text-red-600">
            You need super admin privileges to access the audit trail system.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Audit Trail</h1>
        <p className="mt-1 text-sm text-gray-600">
          Monitor system activities, user actions, and security events
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-center mb-3">
          <FilterIcon className="h-5 w-5 text-gray-500 mr-2" />
          <h3 className="text-sm font-medium text-gray-900">Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="block w-full text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="block w-full text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {activeTab === 'logs' && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Action</label>
              <select
                value={filters.action}
                onChange={(e) => handleFilterChange('action', e.target.value)}
                className="block w-full text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Actions</option>
                <option value="CREATE">Create</option>
                <option value="UPDATE">Update</option>
                <option value="DELETE">Delete</option>
                <option value="LOGIN">Login</option>
                <option value="LOGOUT">Logout</option>
                <option value="PAYMENT_CREATED">Payment Created</option>
                <option value="PAYMENT_COMPLETED">Payment Completed</option>
              </select>
            </div>
          )}

          {activeTab === 'events' && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Severity</label>
              <select
                value={filters.severity}
                onChange={(e) => handleFilterChange('severity', e.target.value)}
                className="block w-full text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Severities</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          )}

          {activeTab === 'logins' && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="text"
                  placeholder="Search by email..."
                  value={filters.email}
                  onChange={(e) => handleFilterChange('email', e.target.value)}
                  className="block w-full text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Result</label>
                <select
                  value={filters.success}
                  onChange={(e) => handleFilterChange('success', e.target.value)}
                  className="block w-full text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Results</option>
                  <option value="true">Success</option>
                  <option value="false">Failed</option>
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchData}
              className="mt-2 text-blue-600 hover:text-blue-800 text-sm underline"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {activeTab === 'logs' && (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Table
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Record ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IP Address
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {auditLogs.map((log) => (
                    <AuditLogRow key={log.id} log={log} />
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'events' && (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Severity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {systemEvents.map((event) => (
                    <SystemEventRow key={event.id} event={event} />
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'logins' && (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Result
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IP Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Failure Reason
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loginAttempts.map((attempt) => (
                    <LoginAttemptRow key={attempt.id} attempt={attempt} />
                  ))}
                </tbody>
              </table>
            )}

            {((activeTab === 'logs' && auditLogs.length === 0) ||
              (activeTab === 'events' && systemEvents.length === 0) ||
              (activeTab === 'logins' && loginAttempts.length === 0)) && (
              <div className="p-8 text-center">
                <ClockIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No records found for the selected criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}