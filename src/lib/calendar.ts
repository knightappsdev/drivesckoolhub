import { query } from './database';
import { User } from './auth';
import { addMinutes, format, parseISO, isWithinInterval, addDays, startOfDay, endOfDay } from 'date-fns';

export interface TimeSlot {
  id?: number;
  instructor_id: number;
  date: string; // YYYY-MM-DD format
  start_time: string; // HH:mm format
  end_time: string; // HH:mm format
  is_available: boolean;
  is_recurring: boolean;
  recurrence_pattern?: string; // 'daily', 'weekly', 'monthly'
  recurrence_end_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ScheduleConflict {
  type: 'booking' | 'unavailable' | 'overlapping';
  message: string;
  conflicting_id?: number;
  conflicting_time?: {
    start: string;
    end: string;
  };
}

export interface AutoScheduleRequest {
  course_id: number;
  instructor_id?: number;
  student_id: number;
  preferred_dates?: string[];
  preferred_times?: string[];
  duration_minutes: number;
  earliest_date?: string;
  latest_date?: string;
  avoid_weekends?: boolean;
}

export interface ScheduleSuggestion {
  instructor_id: number;
  instructor_name: string;
  date: string;
  start_time: string;
  end_time: string;
  score: number; // Higher score = better match
  reasons: string[];
}

// Create instructor availability time slots
export async function createTimeSlots(slots: TimeSlot[]): Promise<void> {
  try {
    const values = slots.map(slot => [
      slot.instructor_id,
      slot.date,
      slot.start_time,
      slot.end_time,
      slot.is_available,
      slot.is_recurring,
      slot.recurrence_pattern || null,
      slot.recurrence_end_date || null
    ]);

    await query(
      `INSERT INTO instructor_availability 
       (instructor_id, date, start_time, end_time, is_available, is_recurring, recurrence_pattern, recurrence_end_date)
       VALUES ${slots.map(() => '(?, ?, ?, ?, ?, ?, ?, ?)').join(', ')}`,
      values.flat()
    );

    // If recurring, generate future instances
    for (const slot of slots) {
      if (slot.is_recurring && slot.recurrence_pattern && slot.recurrence_end_date) {
        await generateRecurringSlots(slot);
      }
    }
  } catch (error) {
    console.error('Error creating time slots:', error);
    throw new Error('Failed to create time slots');
  }
}

// Generate recurring availability slots
async function generateRecurringSlots(baseSlot: TimeSlot): Promise<void> {
  if (!baseSlot.recurrence_pattern || !baseSlot.recurrence_end_date) return;

  const startDate = parseISO(baseSlot.date);
  const endDate = parseISO(baseSlot.recurrence_end_date);
  const slots: TimeSlot[] = [];

  let currentDate = startDate;

  while (currentDate <= endDate) {
    switch (baseSlot.recurrence_pattern) {
      case 'daily':
        currentDate = addDays(currentDate, 1);
        break;
      case 'weekly':
        currentDate = addDays(currentDate, 7);
        break;
      case 'monthly':
        currentDate = addDays(currentDate, 30); // Simplified monthly
        break;
      default:
        return;
    }

    if (currentDate <= endDate) {
      slots.push({
        ...baseSlot,
        date: format(currentDate, 'yyyy-MM-dd'),
        is_recurring: false // Individual instances are not recurring
      });
    }
  }

  if (slots.length > 0) {
    await createTimeSlots(slots);
  }
}

// Get instructor availability for a date range
export async function getInstructorAvailability(
  instructorId: number,
  startDate: string,
  endDate: string
): Promise<TimeSlot[]> {
  try {
    const availability = await query(
      `SELECT * FROM instructor_availability 
       WHERE instructor_id = ? 
       AND date BETWEEN ? AND ? 
       ORDER BY date, start_time`,
      [instructorId, startDate, endDate]
    );

    return availability;
  } catch (error) {
    console.error('Error getting instructor availability:', error);
    return [];
  }
}

// Check for schedule conflicts
export async function checkScheduleConflicts(
  instructorId: number,
  date: string,
  startTime: string,
  endTime: string,
  excludeBookingId?: number
): Promise<ScheduleConflict[]> {
  try {
    const conflicts: ScheduleConflict[] = [];

    // Check for existing bookings
    let bookingQuery = `
      SELECT b.*, c.name as course_name, c.duration_minutes
      FROM bookings b
      JOIN courses c ON b.course_id = c.id
      WHERE b.instructor_id = ? 
      AND b.lesson_date = ?
      AND b.status NOT IN ('cancelled', 'completed')
      AND (
        (b.lesson_time <= ? AND ADDTIME(b.lesson_time, SEC_TO_TIME(c.duration_minutes * 60)) > ?) OR
        (b.lesson_time < ? AND ADDTIME(b.lesson_time, SEC_TO_TIME(c.duration_minutes * 60)) >= ?)
      )
    `;
    
    const bookingParams = [instructorId, date, startTime, startTime, endTime, endTime];
    
    if (excludeBookingId) {
      bookingQuery += ' AND b.id != ?';
      bookingParams.push(excludeBookingId);
    }

    const conflictingBookings = await query(bookingQuery, bookingParams);

    for (const booking of conflictingBookings) {
      const bookingEndTime = addMinutes(
        parseISO(`${date}T${booking.lesson_time}`),
        booking.duration_minutes
      );

      conflicts.push({
        type: 'booking',
        message: `Conflicts with existing booking: ${booking.course_name}`,
        conflicting_id: booking.id,
        conflicting_time: {
          start: booking.lesson_time,
          end: format(bookingEndTime, 'HH:mm')
        }
      });
    }

    // Check instructor availability
    const availability = await query(
      `SELECT * FROM instructor_availability 
       WHERE instructor_id = ? 
       AND date = ? 
       AND is_available = false
       AND (
         (start_time <= ? AND end_time > ?) OR
         (start_time < ? AND end_time >= ?)
       )`,
      [instructorId, date, startTime, startTime, endTime, endTime]
    );

    for (const unavailable of availability) {
      conflicts.push({
        type: 'unavailable',
        message: 'Instructor is not available during this time',
        conflicting_time: {
          start: unavailable.start_time,
          end: unavailable.end_time
        }
      });
    }

    return conflicts;
  } catch (error) {
    console.error('Error checking schedule conflicts:', error);
    return [{
      type: 'overlapping',
      message: 'Error checking for conflicts'
    }];
  }
}

// Auto-schedule lesson with intelligent suggestions
export async function autoScheduleLesson(request: AutoScheduleRequest): Promise<ScheduleSuggestion[]> {
  try {
    const {
      course_id,
      instructor_id,
      student_id,
      preferred_dates = [],
      preferred_times = [],
      duration_minutes,
      earliest_date = format(new Date(), 'yyyy-MM-dd'),
      latest_date = format(addDays(new Date(), 30), 'yyyy-MM-dd'),
      avoid_weekends = false
    } = request;

    // Get course details
    const course = await query(
      'SELECT * FROM courses WHERE id = ?',
      [course_id]
    );

    if (!course.length) {
      throw new Error('Course not found');
    }

    const suggestions: ScheduleSuggestion[] = [];

    // Get available instructors (or specific instructor)
    const instructorQuery = instructor_id 
      ? 'SELECT * FROM users WHERE id = ? AND role = "instructor" AND is_active = 1'
      : 'SELECT * FROM users WHERE role = "instructor" AND is_active = 1';
    
    const instructorParams = instructor_id ? [instructor_id] : [];
    const instructors = await query(instructorQuery, instructorParams);

    for (const instructor of instructors) {
      // Get instructor availability
      const availability = await getInstructorAvailability(
        instructor.id,
        earliest_date,
        latest_date
      );

      // Get instructor's existing bookings for workload calculation
      const existingBookings = await query(
        `SELECT COUNT(*) as booking_count 
         FROM bookings 
         WHERE instructor_id = ? 
         AND lesson_date BETWEEN ? AND ?
         AND status NOT IN ('cancelled')`,
        [instructor.id, earliest_date, latest_date]
      );

      const workload = existingBookings[0]?.booking_count || 0;

      // Generate time slots for each available day
      for (const slot of availability) {
        if (!slot.is_available) continue;

        // Skip weekends if requested
        const slotDate = parseISO(slot.date);
        const dayOfWeek = slotDate.getDay();
        if (avoid_weekends && (dayOfWeek === 0 || dayOfWeek === 6)) continue;

        // Generate possible lesson times within the availability window
        const slotStart = parseISO(`${slot.date}T${slot.start_time}`);
        const slotEnd = parseISO(`${slot.date}T${slot.end_time}`);
        const lessonDuration = duration_minutes;

        let currentTime = slotStart;
        
        while (addMinutes(currentTime, lessonDuration) <= slotEnd) {
          const lessonStartTime = format(currentTime, 'HH:mm');
          const lessonEndTime = format(addMinutes(currentTime, lessonDuration), 'HH:mm');

          // Check for conflicts
          const conflicts = await checkScheduleConflicts(
            instructor.id,
            slot.date,
            lessonStartTime,
            lessonEndTime
          );

          if (conflicts.length === 0) {
            // Calculate suggestion score
            let score = 100;
            const reasons: string[] = ['Available time slot'];

            // Preference bonuses
            if (preferred_dates.includes(slot.date)) {
              score += 20;
              reasons.push('Matches preferred date');
            }

            if (preferred_times.some(time => time === lessonStartTime)) {
              score += 15;
              reasons.push('Matches preferred time');
            }

            // Time of day preferences (assume morning is better)
            const hour = currentTime.getHours();
            if (hour >= 9 && hour <= 12) {
              score += 10;
              reasons.push('Optimal morning time');
            } else if (hour >= 13 && hour <= 17) {
              score += 5;
              reasons.push('Good afternoon time');
            }

            // Lower score for high workload instructors
            if (workload > 10) {
              score -= 10;
              reasons.push('High instructor workload');
            } else if (workload < 5) {
              score += 5;
              reasons.push('Low instructor workload');
            }

            // Distance penalty (if we had location data)
            // This would require implementing location-based scoring

            suggestions.push({
              instructor_id: instructor.id,
              instructor_name: `${instructor.first_name} ${instructor.last_name}`,
              date: slot.date,
              start_time: lessonStartTime,
              end_time: lessonEndTime,
              score,
              reasons
            });
          }

          // Move to next 15-minute slot
          currentTime = addMinutes(currentTime, 15);
        }
      }
    }

    // Sort by score (highest first) and return top suggestions
    return suggestions
      .sort((a, b) => b.score - a.score)
      .slice(0, 20); // Return top 20 suggestions

  } catch (error) {
    console.error('Error auto-scheduling lesson:', error);
    throw new Error('Failed to generate schedule suggestions');
  }
}

// Get instructor schedule for a specific date range
export async function getInstructorSchedule(
  instructorId: number,
  startDate: string,
  endDate: string
) {
  try {
    // Get bookings
    const bookings = await query(
      `SELECT 
        b.*,
        c.name as course_name,
        c.duration_minutes,
        s.first_name as student_first_name,
        s.last_name as student_last_name,
        s.email as student_email
       FROM bookings b
       JOIN courses c ON b.course_id = c.id
       JOIN users s ON b.student_id = s.id
       WHERE b.instructor_id = ?
       AND b.lesson_date BETWEEN ? AND ?
       ORDER BY b.lesson_date, b.lesson_time`,
      [instructorId, startDate, endDate]
    );

    // Get availability slots
    const availability = await getInstructorAvailability(instructorId, startDate, endDate);

    return {
      bookings: bookings.map((booking: any) => ({
        ...booking,
        type: 'booking',
        title: `${booking.course_name} - ${booking.student_first_name} ${booking.student_last_name}`,
        start_time: booking.lesson_time,
        end_time: format(
          addMinutes(parseISO(`${booking.lesson_date}T${booking.lesson_time}`), booking.duration_minutes),
          'HH:mm'
        )
      })),
      availability: availability.map(slot => ({
        ...slot,
        type: 'availability',
        title: slot.is_available ? 'Available' : 'Unavailable'
      }))
    };
  } catch (error) {
    console.error('Error getting instructor schedule:', error);
    return { bookings: [], availability: [] };
  }
}

// Update instructor availability
export async function updateInstructorAvailability(
  instructorId: number,
  date: string,
  startTime: string,
  endTime: string,
  isAvailable: boolean
): Promise<void> {
  try {
    // Check if availability already exists
    const existing = await query(
      `SELECT id FROM instructor_availability 
       WHERE instructor_id = ? AND date = ? AND start_time = ? AND end_time = ?`,
      [instructorId, date, startTime, endTime]
    );

    if (existing.length > 0) {
      // Update existing
      await query(
        `UPDATE instructor_availability 
         SET is_available = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE id = ?`,
        [isAvailable, existing[0].id]
      );
    } else {
      // Create new
      await query(
        `INSERT INTO instructor_availability 
         (instructor_id, date, start_time, end_time, is_available, is_recurring) 
         VALUES (?, ?, ?, ?, ?, false)`,
        [instructorId, date, startTime, endTime, isAvailable]
      );
    }
  } catch (error) {
    console.error('Error updating instructor availability:', error);
    throw new Error('Failed to update instructor availability');
  }
}

// Get optimal lesson scheduling recommendations
export async function getSchedulingInsights(instructorId?: number) {
  try {
    const insights = {
      peak_hours: [] as Array<{ hour: number; booking_count: number }>,
      busy_days: [] as Array<{ day_of_week: number; booking_count: number }>,
      instructor_utilization: [] as Array<{
        instructor_id: number;
        instructor_name: string;
        total_hours: number;
        booked_hours: number;
        utilization_rate: number;
      }>,
      popular_courses: [] as Array<{
        course_id: number;
        course_name: string;
        booking_count: number;
        avg_rating: number;
      }>
    };

    // Peak hours analysis
    const peakHours = await query(
      `SELECT 
        HOUR(lesson_time) as hour,
        COUNT(*) as booking_count
       FROM bookings 
       WHERE lesson_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
       ${instructorId ? 'AND instructor_id = ?' : ''}
       GROUP BY HOUR(lesson_time)
       ORDER BY booking_count DESC`,
      instructorId ? [instructorId] : []
    );

    insights.peak_hours = peakHours;

    // Busy days analysis
    const busyDays = await query(
      `SELECT 
        DAYOFWEEK(lesson_date) as day_of_week,
        COUNT(*) as booking_count
       FROM bookings 
       WHERE lesson_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
       ${instructorId ? 'AND instructor_id = ?' : ''}
       GROUP BY DAYOFWEEK(lesson_date)
       ORDER BY booking_count DESC`,
      instructorId ? [instructorId] : []
    );

    insights.busy_days = busyDays;

    // Instructor utilization (only if not specific instructor)
    if (!instructorId) {
      const utilization = await query(
        `SELECT 
          u.id as instructor_id,
          CONCAT(u.first_name, ' ', u.last_name) as instructor_name,
          COALESCE(avail_hours.total_hours, 0) as total_hours,
          COALESCE(booked_hours.booked_hours, 0) as booked_hours,
          CASE 
            WHEN avail_hours.total_hours > 0 
            THEN ROUND((booked_hours.booked_hours / avail_hours.total_hours) * 100, 2)
            ELSE 0 
          END as utilization_rate
         FROM users u
         LEFT JOIN (
           SELECT 
             instructor_id,
             SUM(TIME_TO_SEC(TIMEDIFF(end_time, start_time)) / 3600) as total_hours
           FROM instructor_availability 
           WHERE is_available = true 
           AND date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
           GROUP BY instructor_id
         ) avail_hours ON u.id = avail_hours.instructor_id
         LEFT JOIN (
           SELECT 
             b.instructor_id,
             SUM(c.duration_minutes / 60) as booked_hours
           FROM bookings b
           JOIN courses c ON b.course_id = c.id
           WHERE b.lesson_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
           AND b.status NOT IN ('cancelled')
           GROUP BY b.instructor_id
         ) booked_hours ON u.id = booked_hours.instructor_id
         WHERE u.role = 'instructor' AND u.is_active = 1
         ORDER BY utilization_rate DESC`
      );

      insights.instructor_utilization = utilization;
    }

    // Popular courses
    const popularCourses = await query(
      `SELECT 
        c.id as course_id,
        c.name as course_name,
        COUNT(b.id) as booking_count,
        COALESCE(AVG(b.rating), 0) as avg_rating
       FROM courses c
       LEFT JOIN bookings b ON c.id = b.course_id 
         AND b.lesson_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
         ${instructorId ? 'AND b.instructor_id = ?' : ''}
       WHERE c.is_active = 1
       GROUP BY c.id, c.name
       ORDER BY booking_count DESC
       LIMIT 10`,
      instructorId ? [instructorId] : []
    );

    insights.popular_courses = popularCourses;

    return insights;
  } catch (error) {
    console.error('Error getting scheduling insights:', error);
    return {
      peak_hours: [],
      busy_days: [],
      instructor_utilization: [],
      popular_courses: []
    };
  }
}