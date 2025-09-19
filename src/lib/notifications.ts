import { query } from './database';
import { addMinutes, subMinutes, format } from 'date-fns';

export type NotificationType = 'email' | 'sms' | 'push' | 'in_app';
export type ReminderTime = '24h' | '4h' | '1h' | '15m';
export type NotificationStatus = 'pending' | 'sent' | 'failed';

export interface LessonReminder {
  id?: number;
  booking_id: number;
  reminder_type: NotificationType;
  reminder_time: ReminderTime;
  scheduled_at: Date;
  sent_at?: Date;
  status: NotificationStatus;
  error_message?: string;
}

export interface NotificationTemplate {
  id?: number;
  name: string;
  type: NotificationType;
  subject?: string;
  message_template: string;
  variables: string[];
  is_active: boolean;
}

export interface NotificationSettings {
  user_id: number;
  email_enabled: boolean;
  sms_enabled: boolean;
  push_enabled: boolean;
  reminder_24h: boolean;
  reminder_4h: boolean;
  reminder_1h: boolean;
  reminder_15m: boolean;
  custom_preferences: Record<string, any>;
}

// Create lesson reminders when a booking is made
export async function createLessonReminders(bookingId: number): Promise<void> {
  try {
    // Get booking details
    const booking = await query(
      `SELECT b.*, c.duration_minutes, 
              u.first_name, u.last_name, u.email, u.phone,
              i.first_name as instructor_first_name, i.last_name as instructor_last_name
       FROM bookings b
       JOIN courses c ON b.course_id = c.id
       JOIN users u ON b.student_id = u.id
       JOIN users i ON b.instructor_id = i.id
       WHERE b.id = ?`,
      [bookingId]
    );

    if (!booking.length) {
      throw new Error('Booking not found');
    }

    const bookingData = booking[0];
    const lessonDateTime = new Date(`${bookingData.lesson_date}T${bookingData.lesson_time}`);

    // Get user notification preferences
    const preferences = await getUserNotificationSettings(bookingData.student_id);

    const reminders: Omit<LessonReminder, 'id'>[] = [];

    // Create reminders based on user preferences and availability
    if (preferences.reminder_24h) {
      const reminderTime = subMinutes(lessonDateTime, 24 * 60);
      if (reminderTime > new Date()) {
        if (preferences.email_enabled && bookingData.email) {
          reminders.push({
            booking_id: bookingId,
            reminder_type: 'email',
            reminder_time: '24h',
            scheduled_at: reminderTime,
            status: 'pending'
          });
        }
        if (preferences.sms_enabled && bookingData.phone) {
          reminders.push({
            booking_id: bookingId,
            reminder_type: 'sms',
            reminder_time: '24h',
            scheduled_at: reminderTime,
            status: 'pending'
          });
        }
        reminders.push({
          booking_id: bookingId,
          reminder_type: 'in_app',
          reminder_time: '24h',
          scheduled_at: reminderTime,
          status: 'pending'
        });
      }
    }

    if (preferences.reminder_4h) {
      const reminderTime = subMinutes(lessonDateTime, 4 * 60);
      if (reminderTime > new Date()) {
        if (preferences.email_enabled && bookingData.email) {
          reminders.push({
            booking_id: bookingId,
            reminder_type: 'email',
            reminder_time: '4h',
            scheduled_at: reminderTime,
            status: 'pending'
          });
        }
        reminders.push({
          booking_id: bookingId,
          reminder_type: 'in_app',
          reminder_time: '4h',
          scheduled_at: reminderTime,
          status: 'pending'
        });
      }
    }

    if (preferences.reminder_1h) {
      const reminderTime = subMinutes(lessonDateTime, 60);
      if (reminderTime > new Date()) {
        if (preferences.sms_enabled && bookingData.phone) {
          reminders.push({
            booking_id: bookingId,
            reminder_type: 'sms',
            reminder_time: '1h',
            scheduled_at: reminderTime,
            status: 'pending'
          });
        }
        if (preferences.push_enabled) {
          reminders.push({
            booking_id: bookingId,
            reminder_type: 'push',
            reminder_time: '1h',
            scheduled_at: reminderTime,
            status: 'pending'
          });
        }
        reminders.push({
          booking_id: bookingId,
          reminder_type: 'in_app',
          reminder_time: '1h',
          scheduled_at: reminderTime,
          status: 'pending'
        });
      }
    }

    if (preferences.reminder_15m) {
      const reminderTime = subMinutes(lessonDateTime, 15);
      if (reminderTime > new Date()) {
        if (preferences.push_enabled) {
          reminders.push({
            booking_id: bookingId,
            reminder_type: 'push',
            reminder_time: '15m',
            scheduled_at: reminderTime,
            status: 'pending'
          });
        }
        reminders.push({
          booking_id: bookingId,
          reminder_type: 'in_app',
          reminder_time: '15m',
          scheduled_at: reminderTime,
          status: 'pending'
        });
      }
    }

    // Insert reminders into database
    if (reminders.length > 0) {
      const values = reminders.map(r => [
        r.booking_id,
        r.reminder_type,
        r.reminder_time,
        r.scheduled_at,
        r.status
      ]);

      await query(
        `INSERT INTO lesson_reminders 
         (booking_id, reminder_type, reminder_time, scheduled_at, status)
         VALUES ${reminders.map(() => '(?, ?, ?, ?, ?)').join(', ')}`,
        values.flat()
      );
    }

  } catch (error) {
    console.error('Error creating lesson reminders:', error);
    throw new Error('Failed to create lesson reminders');
  }
}

// Get user notification settings
export async function getUserNotificationSettings(userId: number): Promise<NotificationSettings> {
  try {
    const settings = await query(
      `SELECT * FROM notification_settings WHERE user_id = ?`,
      [userId]
    );

    if (settings.length === 0) {
      // Return default settings if none exist
      return {
        user_id: userId,
        email_enabled: true,
        sms_enabled: true,
        push_enabled: true,
        reminder_24h: true,
        reminder_4h: true,
        reminder_1h: true,
        reminder_15m: true,
        custom_preferences: {}
      };
    }

    const userSettings = settings[0];
    return {
      user_id: userId,
      email_enabled: userSettings.email_enabled,
      sms_enabled: userSettings.sms_enabled,
      push_enabled: userSettings.push_enabled,
      reminder_24h: userSettings.reminder_24h,
      reminder_4h: userSettings.reminder_4h,
      reminder_1h: userSettings.reminder_1h,
      reminder_15m: userSettings.reminder_15m,
      custom_preferences: userSettings.custom_preferences ? JSON.parse(userSettings.custom_preferences) : {}
    };
  } catch (error) {
    console.error('Error getting notification settings:', error);
    // Return default settings on error
    return {
      user_id: userId,
      email_enabled: true,
      sms_enabled: false, // Conservative default
      push_enabled: true,
      reminder_24h: true,
      reminder_4h: false,
      reminder_1h: true,
      reminder_15m: false,
      custom_preferences: {}
    };
  }
}

// Update user notification settings
export async function updateNotificationSettings(
  userId: number,
  settings: Partial<Omit<NotificationSettings, 'user_id'>>
): Promise<void> {
  try {
    const existing = await query(
      `SELECT id FROM notification_settings WHERE user_id = ?`,
      [userId]
    );

    const settingsData = {
      email_enabled: settings.email_enabled ?? true,
      sms_enabled: settings.sms_enabled ?? false,
      push_enabled: settings.push_enabled ?? true,
      reminder_24h: settings.reminder_24h ?? true,
      reminder_4h: settings.reminder_4h ?? false,
      reminder_1h: settings.reminder_1h ?? true,
      reminder_15m: settings.reminder_15m ?? false,
      custom_preferences: JSON.stringify(settings.custom_preferences ?? {})
    };

    if (existing.length > 0) {
      // Update existing settings
      await query(
        `UPDATE notification_settings 
         SET email_enabled = ?, sms_enabled = ?, push_enabled = ?,
             reminder_24h = ?, reminder_4h = ?, reminder_1h = ?, reminder_15m = ?,
             custom_preferences = ?, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ?`,
        [
          settingsData.email_enabled,
          settingsData.sms_enabled,
          settingsData.push_enabled,
          settingsData.reminder_24h,
          settingsData.reminder_4h,
          settingsData.reminder_1h,
          settingsData.reminder_15m,
          settingsData.custom_preferences,
          userId
        ]
      );
    } else {
      // Create new settings
      await query(
        `INSERT INTO notification_settings 
         (user_id, email_enabled, sms_enabled, push_enabled,
          reminder_24h, reminder_4h, reminder_1h, reminder_15m, custom_preferences)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          settingsData.email_enabled,
          settingsData.sms_enabled,
          settingsData.push_enabled,
          settingsData.reminder_24h,
          settingsData.reminder_4h,
          settingsData.reminder_1h,
          settingsData.reminder_15m,
          settingsData.custom_preferences
        ]
      );
    }
  } catch (error) {
    console.error('Error updating notification settings:', error);
    throw new Error('Failed to update notification settings');
  }
}

// Get pending reminders that need to be sent
export async function getPendingReminders(): Promise<LessonReminder[]> {
  try {
    const reminders = await query(
      `SELECT lr.*, 
              b.lesson_date, b.lesson_time,
              c.name as course_name, c.duration_minutes,
              s.first_name as student_first_name, s.last_name as student_last_name,
              s.email as student_email, s.phone as student_phone,
              i.first_name as instructor_first_name, i.last_name as instructor_last_name
       FROM lesson_reminders lr
       JOIN bookings b ON lr.booking_id = b.id
       JOIN courses c ON b.course_id = c.id
       JOIN users s ON b.student_id = s.id
       JOIN users i ON b.instructor_id = i.id
       WHERE lr.status = 'pending' 
       AND lr.scheduled_at <= NOW()
       AND b.status IN ('confirmed', 'pending')
       ORDER BY lr.scheduled_at ASC`,
      []
    );

    return reminders.map((reminder: any) => ({
      id: reminder.id,
      booking_id: reminder.booking_id,
      reminder_type: reminder.reminder_type,
      reminder_time: reminder.reminder_time,
      scheduled_at: new Date(reminder.scheduled_at),
      status: reminder.status,
      // Additional booking data for processing
      lesson_date: reminder.lesson_date,
      lesson_time: reminder.lesson_time,
      course_name: reminder.course_name,
      duration_minutes: reminder.duration_minutes,
      student_name: `${reminder.student_first_name} ${reminder.student_last_name}`,
      student_email: reminder.student_email,
      student_phone: reminder.student_phone,
      instructor_name: `${reminder.instructor_first_name} ${reminder.instructor_last_name}`
    } as any));
  } catch (error) {
    console.error('Error getting pending reminders:', error);
    return [];
  }
}

// Mark reminder as sent
export async function markReminderSent(reminderId: number): Promise<void> {
  try {
    await query(
      `UPDATE lesson_reminders 
       SET status = 'sent', sent_at = NOW() 
       WHERE id = ?`,
      [reminderId]
    );
  } catch (error) {
    console.error('Error marking reminder as sent:', error);
  }
}

// Mark reminder as failed
export async function markReminderFailed(reminderId: number, errorMessage: string): Promise<void> {
  try {
    await query(
      `UPDATE lesson_reminders 
       SET status = 'failed', error_message = ? 
       WHERE id = ?`,
      [errorMessage, reminderId]
    );
  } catch (error) {
    console.error('Error marking reminder as failed:', error);
  }
}

// Get notification templates
export async function getNotificationTemplate(
  type: NotificationType,
  templateName: string
): Promise<NotificationTemplate | null> {
  try {
    const templates = await query(
      `SELECT * FROM notification_templates 
       WHERE type = ? AND name = ? AND is_active = true`,
      [type, templateName]
    );

    if (templates.length === 0) {
      return null;
    }

    const template = templates[0];
    return {
      id: template.id,
      name: template.name,
      type: template.type,
      subject: template.subject,
      message_template: template.message_template,
      variables: JSON.parse(template.variables || '[]'),
      is_active: template.is_active
    };
  } catch (error) {
    console.error('Error getting notification template:', error);
    return null;
  }
}

// Process notification template with variables
export function processTemplate(
  template: string,
  variables: Record<string, any>
): string {
  let processed = template;
  
  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    processed = processed.replace(new RegExp(placeholder, 'g'), String(value));
  });

  return processed;
}

// Send email notification (mock implementation)
export async function sendEmailNotification(
  to: string,
  subject: string,
  message: string
): Promise<boolean> {
  try {
    // This would integrate with your email service (SendGrid, AWS SES, etc.)
    console.log('Sending email notification:', {
      to,
      subject,
      message: message.substring(0, 100) + '...'
    });

    // Mock success - replace with actual email service
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

// Send SMS notification (mock implementation)
export async function sendSMSNotification(
  to: string,
  message: string
): Promise<boolean> {
  try {
    // This would integrate with SMS service (Twilio, AWS SNS, etc.)
    console.log('Sending SMS notification:', {
      to,
      message: message.substring(0, 100) + '...'
    });

    // Mock success - replace with actual SMS service
    return true;
  } catch (error) {
    console.error('Error sending SMS:', error);
    return false;
  }
}

// Send push notification (mock implementation)
export async function sendPushNotification(
  userId: number,
  title: string,
  message: string
): Promise<boolean> {
  try {
    // This would integrate with push notification service (FCM, APNS, etc.)
    console.log('Sending push notification:', {
      userId,
      title,
      message: message.substring(0, 100) + '...'
    });

    // Mock success - replace with actual push service
    return true;
  } catch (error) {
    console.error('Error sending push notification:', error);
    return false;
  }
}

// Create in-app notification
export async function createInAppNotification(
  userId: number,
  title: string,
  message: string,
  type: string = 'reminder',
  relatedId?: number
): Promise<void> {
  try {
    await query(
      `INSERT INTO in_app_notifications 
       (user_id, title, message, type, related_id, is_read)
       VALUES (?, ?, ?, ?, ?, false)`,
      [userId, title, message, type, relatedId]
    );
  } catch (error) {
    console.error('Error creating in-app notification:', error);
  }
}

// Generic notification sender
export async function sendNotification(
  type: NotificationType,
  recipient: string | number,
  title: string,
  message: string
): Promise<boolean> {
  try {
    switch (type) {
      case 'email':
        return await sendEmailNotification(recipient as string, title, message);
      case 'sms':
        return await sendSMSNotification(recipient as string, message);
      case 'push':
        return await sendPushNotification(recipient as number, title, message);
      case 'in_app':
        await createInAppNotification(recipient as number, title, message);
        return true;
      default:
        throw new Error(`Unsupported notification type: ${type}`);
    }
  } catch (error) {
    console.error(`Error sending ${type} notification:`, error);
    return false;
  }
}

// Main reminder processing function
export async function processReminders(): Promise<void> {
  try {
    const pendingReminders = await getPendingReminders();
    
    for (const reminder of pendingReminders) {
      try {
        let success = false;
        const lessonDateTime = new Date(`${(reminder as any).lesson_date}T${(reminder as any).lesson_time}`);
        
        const templateVariables = {
          student_name: (reminder as any).student_name,
          instructor_name: (reminder as any).instructor_name,
          course_name: (reminder as any).course_name,
          lesson_date: format(new Date((reminder as any).lesson_date), 'EEEE, MMMM dd, yyyy'),
          lesson_time: (reminder as any).lesson_time,
          duration: `${(reminder as any).duration_minutes} minutes`,
          reminder_time: reminder.reminder_time
        };

        switch (reminder.reminder_type) {
          case 'email':
            const emailTemplate = await getNotificationTemplate('email', 'lesson_reminder');
            if (emailTemplate && (reminder as any).student_email) {
              const subject = processTemplate(emailTemplate.subject || 'Lesson Reminder', templateVariables);
              const message = processTemplate(emailTemplate.message_template, templateVariables);
              success = await sendEmailNotification((reminder as any).student_email, subject, message);
            }
            break;

          case 'sms':
            const smsTemplate = await getNotificationTemplate('sms', 'lesson_reminder');
            if (smsTemplate && (reminder as any).student_phone) {
              const message = processTemplate(smsTemplate.message_template, templateVariables);
              success = await sendSMSNotification((reminder as any).student_phone, message);
            }
            break;

          case 'push':
            const pushTemplate = await getNotificationTemplate('push', 'lesson_reminder');
            if (pushTemplate) {
              const title = processTemplate(pushTemplate.subject || 'Lesson Reminder', templateVariables);
              const message = processTemplate(pushTemplate.message_template, templateVariables);
              // Would need to get user ID from booking
              success = await sendPushNotification(1, title, message); // Placeholder user ID
            }
            break;

          case 'in_app':
            const inAppTemplate = await getNotificationTemplate('in_app', 'lesson_reminder');
            if (inAppTemplate) {
              const title = processTemplate(inAppTemplate.subject || 'Lesson Reminder', templateVariables);
              const message = processTemplate(inAppTemplate.message_template, templateVariables);
              // Would need to get user ID from booking
              await createInAppNotification(1, title, message, 'lesson_reminder', reminder.booking_id); // Placeholder user ID
              success = true;
            }
            break;
        }

        if (success) {
          await markReminderSent(reminder.id!);
        } else {
          await markReminderFailed(reminder.id!, `Failed to send ${reminder.reminder_type} notification`);
        }

      } catch (error) {
        console.error(`Error processing reminder ${reminder.id}:`, error);
        await markReminderFailed(reminder.id!, error instanceof Error ? error.message : 'Unknown error');
      }
    }

  } catch (error) {
    console.error('Error processing reminders:', error);
  }
}

// Get user's in-app notifications
export async function getUserNotifications(
  userId: number,
  page: number = 1,
  limit: number = 20
): Promise<{
  notifications: any[];
  total: number;
  unread_count: number;
}> {
  try {
    const offset = (page - 1) * limit;

    const notifications = await query(
      `SELECT * FROM in_app_notifications 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );

    const totalResult = await query(
      `SELECT COUNT(*) as total FROM in_app_notifications WHERE user_id = ?`,
      [userId]
    );

    const unreadResult = await query(
      `SELECT COUNT(*) as unread_count FROM in_app_notifications 
       WHERE user_id = ? AND is_read = false`,
      [userId]
    );

    return {
      notifications,
      total: totalResult[0]?.total || 0,
      unread_count: unreadResult[0]?.unread_count || 0
    };
  } catch (error) {
    console.error('Error getting user notifications:', error);
    return {
      notifications: [],
      total: 0,
      unread_count: 0
    };
  }
}

// Mark notification as read
export async function markNotificationRead(notificationId: number): Promise<void> {
  try {
    await query(
      `UPDATE in_app_notifications 
       SET is_read = true, read_at = NOW() 
       WHERE id = ?`,
      [notificationId]
    );
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
}