'use client';

import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, parseISO, isToday, isSameMonth } from 'date-fns';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  CalendarDaysIcon,
  BoltIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  type: 'booking' | 'availability' | 'blocked';
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  instructor_name?: string;
  student_name?: string;
  course_name?: string;
  color?: string;
}

interface ScheduleSuggestion {
  instructor_id: number;
  instructor_name: string;
  date: string;
  start_time: string;
  end_time: string;
  score: number;
  reasons: string[];
}

interface EnhancedCalendarProps {
  instructorId?: number;
  userRole: 'admin' | 'super_admin' | 'instructor' | 'student';
  onEventClick?: (event: CalendarEvent) => void;
  onDateClick?: (date: string) => void;
  showAutoSchedule?: boolean;
}

export default function EnhancedCalendar({
  instructorId,
  userRole,
  onEventClick,
  onDateClick,
  showAutoSchedule = false
}: EnhancedCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<ScheduleSuggestion[]>([]);
  const [availabilityView, setAvailabilityView] = useState(false);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  useEffect(() => {
    if (instructorId) {
      fetchScheduleData();
    }
  }, [instructorId, currentDate]);

  const fetchScheduleData = async () => {
    if (!instructorId) return;

    setLoading(true);
    try {
      const startDate = format(monthStart, 'yyyy-MM-dd');
      const endDate = format(monthEnd, 'yyyy-MM-dd');

      const response = await fetch(
        `/api/calendar/schedule?instructor_id=${instructorId}&start_date=${startDate}&end_date=${endDate}`
      );

      if (response.ok) {
        const result = await response.json();
        const formattedEvents: CalendarEvent[] = [
          ...result.data.bookings.map((booking: any) => ({
            id: booking.id,
            title: booking.title,
            date: booking.lesson_date,
            start_time: booking.start_time,
            end_time: booking.end_time,
            type: 'booking' as const,
            status: booking.status,
            instructor_name: booking.instructor_name,
            student_name: `${booking.student_first_name} ${booking.student_last_name}`,
            course_name: booking.course_name,
            color: getEventColor(booking.status)
          })),
          ...result.data.availability.map((avail: any) => ({
            id: `avail-${avail.id}`,
            title: avail.title,
            date: avail.date,
            start_time: avail.start_time,
            end_time: avail.end_time,
            type: 'availability' as const,
            color: avail.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }))
        ];

        setEvents(formattedEvents);
      }
    } catch (error) {
      console.error('Error fetching schedule data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return events.filter(event => event.date === dateStr);
  };

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDateClick = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    setSelectedDate(dateStr);
    onDateClick?.(dateStr);
  };

  const handleAutoSchedule = async (date: string) => {
    try {
      const response = await fetch('/api/calendar/auto-schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          course_id: 1, // This would come from a form
          instructor_id: instructorId,
          student_id: 1, // This would come from context
          duration_minutes: 60,
          preferred_dates: [date],
          earliest_date: date,
          latest_date: format(addMonths(parseISO(date), 1), 'yyyy-MM-dd')
        })
      });

      if (response.ok) {
        const result = await response.json();
        setSuggestions(result.data.suggestions);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Error getting auto-schedule suggestions:', error);
    }
  };

  const renderDayEvents = (date: Date) => {
    const dayEvents = getEventsForDate(date);
    
    if (dayEvents.length === 0) return null;

    return (
      <div className="mt-1 space-y-1">
        {dayEvents.slice(0, 2).map((event) => (
          <div
            key={event.id}
            className={`text-xs px-1 py-0.5 rounded truncate cursor-pointer ${event.color}`}
            onClick={() => onEventClick?.(event)}
            title={`${event.title} ${event.start_time}-${event.end_time}`}
          >
            <div className="flex items-center">
              {event.type === 'booking' && (
                <ClockIcon className="h-3 w-3 mr-1 flex-shrink-0" />
              )}
              <span className="truncate">{event.title}</span>
            </div>
          </div>
        ))}
        {dayEvents.length > 2 && (
          <div className="text-xs text-gray-500 px-1">
            +{dayEvents.length - 2} more
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center space-x-1">
            <button
              onClick={handlePreviousMonth}
              className="p-1 rounded hover:bg-gray-100"
            >
              <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1 rounded hover:bg-gray-100"
            >
              <ChevronRightIcon className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {userRole === 'instructor' && (
            <button
              onClick={() => setAvailabilityView(!availabilityView)}
              className={`px-3 py-1 text-sm rounded-md ${
                availabilityView
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <CalendarDaysIcon className="h-4 w-4 inline mr-1" />
              Availability
            </button>
          )}

          {showAutoSchedule && (
            <button
              onClick={() => setShowSuggestions(true)}
              className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200"
            >
              <BoltIcon className="h-4 w-4 inline mr-1" />
              Auto Schedule
            </button>
          )}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="py-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date) => {
            const dayEvents = getEventsForDate(date);
            const isSelected = selectedDate === format(date, 'yyyy-MM-dd');
            
            return (
              <div
                key={date.toISOString()}
                className={`min-h-[100px] p-2 border border-gray-200 cursor-pointer hover:bg-gray-50 ${
                  isToday(date) ? 'bg-blue-50 border-blue-200' : ''
                } ${
                  isSelected ? 'bg-blue-100 border-blue-300' : ''
                } ${
                  !isSameMonth(date, currentDate) ? 'text-gray-400 bg-gray-50' : ''
                }`}
                onClick={() => handleDateClick(date)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-medium ${
                    isToday(date) ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    {format(date, 'd')}
                  </span>
                  
                  {dayEvents.length > 0 && (
                    <div className="flex items-center space-x-1">
                      {dayEvents.some(e => e.type === 'booking') && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                      {dayEvents.some(e => e.type === 'availability' && e.color?.includes('green')) && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                    </div>
                  )}
                </div>

                {renderDayEvents(date)}

                {/* Quick action buttons for admins/instructors */}
                {(userRole === 'admin' || userRole === 'super_admin' || userRole === 'instructor') && isSelected && (
                  <div className="mt-2 flex space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle add availability
                      }}
                      className="p-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                      title="Add availability"
                    >
                      <PlusIcon className="h-3 w-3" />
                    </button>
                    {showAutoSchedule && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAutoSchedule(format(date, 'yyyy-MM-dd'));
                        }}
                        className="p-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                        title="Auto-schedule"
                      >
                        <BoltIcon className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="px-4 pb-4">
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded mr-2"></div>
            <span>Bookings</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-100 border border-green-300 rounded mr-2"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-100 border border-red-300 rounded mr-2"></div>
            <span>Unavailable</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded mr-2"></div>
            <span>Pending</span>
          </div>
        </div>
      </div>

      {/* Auto-scheduling suggestions modal */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Schedule Suggestions
              </h3>
              <button
                onClick={() => setShowSuggestions(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-3">
              {suggestions.slice(0, 10).map((suggestion, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    // Handle suggestion selection
                    console.log('Selected suggestion:', suggestion);
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-medium text-gray-900">
                        {suggestion.instructor_name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {format(parseISO(suggestion.date), 'EEEE, MMM dd, yyyy')} • {suggestion.start_time} - {suggestion.end_time}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-blue-600">
                        Score: {suggestion.score}
                      </div>
                      <div className="flex items-center">
                        <ChartBarIcon className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500">Rank #{index + 1}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {suggestion.reasons.map((reason, reasonIndex) => (
                      <span
                        key={reasonIndex}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
                      >
                        {reason}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowSuggestions(false)}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle create booking with best suggestion
                  if (suggestions[0]) {
                    console.log('Creating booking with:', suggestions[0]);
                  }
                  setShowSuggestions(false);
                }}
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Book Best Suggestion
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
}