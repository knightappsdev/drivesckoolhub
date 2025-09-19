import { query } from './db';
import { sendNotification } from './notifications';
import { addHours, subHours, subMinutes } from 'date-fns';

interface BookingData {
  id: number;
  student_id: number;
  instructor_id: number;
  course_id: number;
  lesson_date: string;
  lesson_time: string;
  duration_hours: number;
  total_cost: number;
  status: string;
}

interface CourseData {
  id: number;
  name: string;
}

interface UserData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
}

// Create lesson reminders when a booking is confirmed
export async function createLessonReminders(bookingId: number) {
  try {
    // Get booking details
    const [booking] = await query<BookingData>(`
      SELECT 
        id, student_id, instructor_id, course_id, 
        lesson_date, lesson_time, duration_hours, 
        total_cost, status
      FROM bookings 
      WHERE id = ?
    `, [bookingId]);

    if (!booking || booking.status !== 'confirmed') {
      return;
    }

    // Get course details
    const [course] = await query<CourseData>(`
      SELECT id, name FROM courses WHERE id = ?
    `, [booking.course_id]);

    // Get student details
    const [student] = await query<UserData>(`
      SELECT id, first_name, last_name, email, phone 
      FROM users WHERE id = ?
    `, [booking.student_id]);

    // Get instructor details
    const [instructor] = await query<UserData>(`
      SELECT id, first_name, last_name, email 
      FROM users WHERE id = ?
    `, [booking.instructor_id]);

    if (!course || !student || !instructor) {
      console.error('Missing required data for booking reminders');
      return;
    }

    // Create lesson datetime
    const lessonDateTime = new Date(`${booking.lesson_date} ${booking.lesson_time}`);

    // Get user notification settings
    const [settings] = await query(`
      SELECT reminder_24h, reminder_4h, reminder_1h, reminder_15m
      FROM notification_settings 
      WHERE user_id = ?
    `, [student.id]);

    const reminderSettings = settings || {
      reminder_24h: true,
      reminder_4h: false,
      reminder_1h: true,
      reminder_15m: false
    };

    const reminders = [];

    // Prepare template data
    const templateData = {
      student_name: `${student.first_name} ${student.last_name}`,
      instructor_name: `${instructor.first_name} ${instructor.last_name}`,
      course_name: course.name,
      lesson_date: lessonDateTime.toLocaleDateString(),
      lesson_time: lessonDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration: `${booking.duration_hours} hour${booking.duration_hours !== 1 ? 's' : ''}`,
      booking_id: booking.id.toString()
    };

    // Schedule reminders based on user preferences
    if (reminderSettings.reminder_24h) {
      const reminderTime = subHours(lessonDateTime, 24);
      if (reminderTime > new Date()) {
        reminders.push({
          booking_id: bookingId,
          user_id: student.id,
          reminder_type: '24h',
          scheduled_at: reminderTime,
          template_data: { ...templateData, reminder_time: '24 hours' }
        });
      }
    }

    if (reminderSettings.reminder_4h) {
      const reminderTime = subHours(lessonDateTime, 4);
      if (reminderTime > new Date()) {
        reminders.push({
          booking_id: bookingId,
          user_id: student.id,
          reminder_type: '4h',
          scheduled_at: reminderTime,
          template_data: { ...templateData, reminder_time: '4 hours' }
        });
      }
    }

    if (reminderSettings.reminder_1h) {
      const reminderTime = subHours(lessonDateTime, 1);
      if (reminderTime > new Date()) {
        reminders.push({
          booking_id: bookingId,
          user_id: student.id,
          reminder_type: '1h',
          scheduled_at: reminderTime,
          template_data: { ...templateData, reminder_time: '1 hour' }
        });
      }
    }

    if (reminderSettings.reminder_15m) {
      const reminderTime = subMinutes(lessonDateTime, 15);
      if (reminderTime > new Date()) {
        reminders.push({
          booking_id: bookingId,
          user_id: student.id,
          reminder_type: '15m',
          scheduled_at: reminderTime,
          template_data: { ...templateData, reminder_time: '15 minutes' }
        });
      }
    }

    // Insert reminder records
    for (const reminder of reminders) {
      await query(`
        INSERT INTO lesson_reminders 
        (booking_id, user_id, reminder_type, scheduled_at, template_data, status)
        VALUES (?, ?, ?, ?, ?, 'scheduled')
      `, [
        reminder.booking_id,
        reminder.user_id,
        reminder.reminder_type,
        reminder.scheduled_at,
        JSON.stringify(reminder.template_data)
      ]);
    }

    // Send immediate booking confirmation
    await sendBookingConfirmation(booking, course, student, instructor);

    // Notify instructor about new booking
    await sendInstructorNotification(booking, course, student, instructor);

    console.log(`Created ${reminders.length} reminders for booking ${bookingId}`);

  } catch (error) {
    console.error('Error creating lesson reminders:', error);
    throw error;
  }
}

// Send booking confirmation notification
export async function sendBookingConfirmation(
  booking: BookingData,
  course: CourseData,
  student: UserData,
  instructor: UserData
) {
  try {
    const lessonDateTime = new Date(`${booking.lesson_date} ${booking.lesson_time}`);
    
    await sendNotification({
      userId: student.id,
      type: 'booking_confirmation',
      data: {
        student_name: `${student.first_name} ${student.last_name}`,
        instructor_name: `${instructor.first_name} ${instructor.last_name}`,
        course_name: course.name,
        lesson_date: lessonDateTime.toLocaleDateString(),
        lesson_time: lessonDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        duration: `${booking.duration_hours} hour${booking.duration_hours !== 1 ? 's' : ''}`,
        total_cost: booking.total_cost.toString(),
        booking_id: booking.id.toString()
      }
    });

    // Create in-app notification
    await query(`
      INSERT INTO in_app_notifications 
      (user_id, title, message, type, priority, related_type, related_id, action_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      student.id,
      'Booking Confirmed',
      `Your ${course.name} lesson with ${instructor.first_name} ${instructor.last_name} has been confirmed for ${lessonDateTime.toLocaleDateString()} at ${lessonDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
      'success',
      'medium',
      'booking',
      booking.id,
      `/dashboard/bookings/${booking.id}`
    ]);

  } catch (error) {
    console.error('Error sending booking confirmation:', error);
  }
}

// Send instructor notification about new booking
export async function sendInstructorNotification(
  booking: BookingData,
  course: CourseData,
  student: UserData,
  instructor: UserData
) {
  try {
    const lessonDateTime = new Date(`${booking.lesson_date} ${booking.lesson_time}`);
    
    // Create in-app notification for instructor
    await query(`
      INSERT INTO in_app_notifications 
      (user_id, title, message, type, priority, related_type, related_id, action_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      instructor.id,
      'New Booking Assigned',
      `You have a new ${course.name} lesson with ${student.first_name} ${student.last_name} scheduled for ${lessonDateTime.toLocaleDateString()} at ${lessonDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
      'info',
      'medium',
      'booking',
      booking.id,
      `/dashboard/bookings/${booking.id}`
    ]);

    // Send email notification if instructor has email notifications enabled
    const [instructorSettings] = await query(`
      SELECT email_enabled FROM notification_settings WHERE user_id = ?
    `, [instructor.id]);

    if (instructorSettings?.email_enabled) {
      await sendNotification({
        userId: instructor.id,
        type: 'instructor_booking',
        data: {
          instructor_name: `${instructor.first_name} ${instructor.last_name}`,
          student_name: `${student.first_name} ${student.last_name}`,
          course_name: course.name,
          lesson_date: lessonDateTime.toLocaleDateString(),
          lesson_time: lessonDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          duration: `${booking.duration_hours} hour${booking.duration_hours !== 1 ? 's' : ''}`,
          booking_id: booking.id.toString()
        },
        channels: { email: true, sms: false, push: false, in_app: false }
      });
    }

  } catch (error) {
    console.error('Error sending instructor notification:', error);
  }
}

// Process scheduled reminders (should be called by a cron job)
export async function processScheduledReminders() {
  try {
    // Get due reminders
    const reminders = await query(`
      SELECT 
        lr.id, lr.booking_id, lr.user_id, lr.reminder_type, 
        lr.template_data, b.status as booking_status
      FROM lesson_reminders lr
      JOIN bookings b ON lr.booking_id = b.id
      WHERE lr.scheduled_at <= NOW() 
        AND lr.status = 'scheduled'
        AND b.status = 'confirmed'
      ORDER BY lr.scheduled_at
      LIMIT 100
    `);

    for (const reminder of reminders) {
      try {
        const templateData = JSON.parse(reminder.template_data);
        
        // Send reminder notification
        await sendNotification({
          userId: reminder.user_id,
          type: 'lesson_reminder',
          data: templateData
        });

        // Create in-app notification
        await query(`
          INSERT INTO in_app_notifications 
          (user_id, title, message, type, priority, related_type, related_id, action_url)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          reminder.user_id,
          'Lesson Reminder',
          `Your ${templateData.course_name} lesson with ${templateData.instructor_name} starts ${templateData.reminder_time}!`,
          'reminder',
          'high',
          'booking',
          reminder.booking_id,
          `/dashboard/bookings/${reminder.booking_id}`
        ]);

        // Mark reminder as sent
        await query(`
          UPDATE lesson_reminders 
          SET status = 'sent', sent_at = NOW() 
          WHERE id = ?
        `, [reminder.id]);

        console.log(`Sent ${reminder.reminder_type} reminder for booking ${reminder.booking_id}`);

      } catch (error) {
        console.error(`Error processing reminder ${reminder.id}:`, error);
        
        // Mark as failed
        await query(`
          UPDATE lesson_reminders 
          SET status = 'failed', error_message = ? 
          WHERE id = ?
        `, [error.message, reminder.id]);
      }
    }

    console.log(`Processed ${reminders.length} scheduled reminders`);

  } catch (error) {
    console.error('Error processing scheduled reminders:', error);
    throw error;
  }
}

// Cancel reminders when booking is cancelled
export async function cancelBookingReminders(bookingId: number) {
  try {
    await query(`
      UPDATE lesson_reminders 
      SET status = 'cancelled', updated_at = NOW()
      WHERE booking_id = ? AND status = 'scheduled'
    `, [bookingId]);

    console.log(`Cancelled reminders for booking ${bookingId}`);

  } catch (error) {
    console.error('Error cancelling booking reminders:', error);
    throw error;
  }
}

// Update reminders when booking is rescheduled
export async function updateBookingReminders(bookingId: number) {
  try {
    // Cancel existing reminders
    await cancelBookingReminders(bookingId);
    
    // Create new reminders
    await createLessonReminders(bookingId);

    console.log(`Updated reminders for rescheduled booking ${bookingId}`);

  } catch (error) {
    console.error('Error updating booking reminders:', error);
    throw error;
  }
}