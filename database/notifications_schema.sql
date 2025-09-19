-- Notification and Reminder System Tables
-- Add this to your existing database schema

-- User notification preferences
CREATE TABLE IF NOT EXISTS notification_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  email_enabled BOOLEAN DEFAULT TRUE,
  sms_enabled BOOLEAN DEFAULT FALSE,
  push_enabled BOOLEAN DEFAULT TRUE,
  reminder_24h BOOLEAN DEFAULT TRUE,
  reminder_4h BOOLEAN DEFAULT FALSE,
  reminder_1h BOOLEAN DEFAULT TRUE,
  reminder_15m BOOLEAN DEFAULT FALSE,
  quiet_hours_start TIME DEFAULT '22:00:00',
  quiet_hours_end TIME DEFAULT '08:00:00',
  timezone VARCHAR(50) DEFAULT 'UTC',
  custom_preferences JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_settings (user_id),
  INDEX idx_user_id (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Notification templates
CREATE TABLE IF NOT EXISTS notification_templates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type ENUM('email', 'sms', 'push', 'in_app') NOT NULL,
  category ENUM('reminder', 'confirmation', 'cancellation', 'update', 'marketing') DEFAULT 'reminder',
  subject VARCHAR(255) NULL, -- For email and push notifications
  message_template TEXT NOT NULL,
  variables JSON NOT NULL, -- Array of variable names used in template
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_type_name (type, name),
  INDEX idx_category (category),
  INDEX idx_active (is_active)
);

-- In-app notifications
CREATE TABLE IF NOT EXISTS in_app_notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info', -- info, success, warning, error, reminder
  priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  related_type VARCHAR(50) NULL, -- booking, payment, user, etc.
  related_id INT NULL,
  action_url VARCHAR(500) NULL,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP NULL,
  expires_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_read (user_id, is_read),
  INDEX idx_user_created (user_id, created_at),
  INDEX idx_type (type),
  INDEX idx_priority (priority),
  INDEX idx_expires (expires_at),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- SMS/Email delivery log
CREATE TABLE IF NOT EXISTS notification_delivery_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  notification_type ENUM('email', 'sms', 'push') NOT NULL,
  recipient VARCHAR(255) NOT NULL, -- email address or phone number
  subject VARCHAR(255) NULL,
  message TEXT NOT NULL,
  status ENUM('pending', 'sent', 'failed', 'bounced') DEFAULT 'pending',
  external_id VARCHAR(255) NULL, -- ID from external service (SendGrid, Twilio, etc.)
  error_message TEXT NULL,
  sent_at TIMESTAMP NULL,
  delivered_at TIMESTAMP NULL,
  opened_at TIMESTAMP NULL, -- For email tracking
  clicked_at TIMESTAMP NULL, -- For link tracking
  cost DECIMAL(10, 4) NULL, -- Cost of sending (for SMS/premium services)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_type (user_id, notification_type),
  INDEX idx_status (status),
  INDEX idx_created (created_at),
  INDEX idx_external_id (external_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Push notification subscriptions
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  endpoint TEXT NOT NULL,
  p256dh_key TEXT NOT NULL,
  auth_key TEXT NOT NULL,
  user_agent TEXT NULL,
  platform ENUM('web', 'android', 'ios') DEFAULT 'web',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_active (user_id, is_active),
  INDEX idx_platform (platform),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Notification campaigns for bulk messaging
CREATE TABLE IF NOT EXISTS notification_campaigns (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NULL,
  type ENUM('email', 'sms', 'push', 'in_app') NOT NULL,
  template_id INT NULL,
  target_criteria JSON NOT NULL, -- Criteria for selecting recipients
  status ENUM('draft', 'scheduled', 'sending', 'sent', 'failed', 'cancelled') DEFAULT 'draft',
  scheduled_at TIMESTAMP NULL,
  sent_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  total_recipients INT DEFAULT 0,
  successful_sends INT DEFAULT 0,
  failed_sends INT DEFAULT 0,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_scheduled (scheduled_at),
  INDEX idx_created_by (created_by),
  FOREIGN KEY (template_id) REFERENCES notification_templates(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert default notification templates
INSERT INTO notification_templates (name, type, category, subject, message_template, variables) VALUES
-- Email templates
('lesson_reminder', 'email', 'reminder', 'Reminder: Your {{course_name}} lesson is {{reminder_time}} away', 
 'Hi {{student_name}},\n\nThis is a reminder that you have a {{course_name}} lesson scheduled with {{instructor_name}} on {{lesson_date}} at {{lesson_time}}.\n\nLesson Details:\n- Course: {{course_name}}\n- Date: {{lesson_date}}\n- Time: {{lesson_time}}\n- Duration: {{duration}}\n- Instructor: {{instructor_name}}\n\nPlease arrive 10 minutes early and bring your learner''s permit or license.\n\nIf you need to reschedule or cancel, please contact us as soon as possible.\n\nBest regards,\nDriveSchool Pro Team',
 '["student_name", "instructor_name", "course_name", "lesson_date", "lesson_time", "duration", "reminder_time"]'),

('booking_confirmation', 'email', 'confirmation', 'Lesson Booking Confirmed - {{course_name}}',
 'Hi {{student_name}},\n\nYour lesson booking has been confirmed!\n\nBooking Details:\n- Course: {{course_name}}\n- Date: {{lesson_date}}\n- Time: {{lesson_time}}\n- Duration: {{duration}}\n- Instructor: {{instructor_name}}\n- Total Cost: ${{total_cost}}\n\nPlease save this confirmation for your records. We look forward to seeing you!\n\nBest regards,\nDriveSchool Pro Team',
 '["student_name", "instructor_name", "course_name", "lesson_date", "lesson_time", "duration", "total_cost"]'),

-- SMS templates  
('lesson_reminder', 'sms', 'reminder', NULL,
 'Hi {{student_name}}! Reminder: {{course_name}} lesson with {{instructor_name}} on {{lesson_date}} at {{lesson_time}}. See you there!',
 '["student_name", "instructor_name", "course_name", "lesson_date", "lesson_time"]'),

('booking_confirmation', 'sms', 'confirmation', NULL,
 'Lesson confirmed! {{course_name}} on {{lesson_date}} at {{lesson_time}} with {{instructor_name}}. Confirmation #{{booking_id}}',
 '["course_name", "lesson_date", "lesson_time", "instructor_name", "booking_id"]'),

-- Push notification templates
('lesson_reminder', 'push', 'reminder', 'Lesson Reminder',
 'Your {{course_name}} lesson with {{instructor_name}} starts {{reminder_time}}!',
 '["course_name", "instructor_name", "reminder_time"]'),

-- In-app notification templates
('lesson_reminder', 'in_app', 'reminder', 'Upcoming Lesson',
 'You have a {{course_name}} lesson with {{instructor_name}} scheduled for {{lesson_date}} at {{lesson_time}}.',
 '["course_name", "instructor_name", "lesson_date", "lesson_time"]'),

('payment_received', 'in_app', 'confirmation', 'Payment Received',
 'Your payment of ${{amount}} for {{course_name}} has been successfully processed.',
 '["amount", "course_name"]'),

('instructor_assigned', 'in_app', 'update', 'Instructor Assigned',
 '{{instructor_name}} has been assigned as your instructor for {{course_name}}.',
 '["instructor_name", "course_name"]');

-- Insert default notification settings for existing users
INSERT IGNORE INTO notification_settings (user_id, email_enabled, sms_enabled, push_enabled, reminder_24h, reminder_1h)
SELECT id, TRUE, FALSE, TRUE, TRUE, TRUE FROM users;

-- Create indexes for better performance
CREATE INDEX idx_lesson_reminders_scheduled ON lesson_reminders(scheduled_at, status);
CREATE INDEX idx_lesson_reminders_booking ON lesson_reminders(booking_id);
CREATE INDEX idx_notifications_user_unread ON in_app_notifications(user_id, is_read, created_at);

-- Sample notification preferences for different user types
INSERT INTO notification_settings (user_id, email_enabled, sms_enabled, push_enabled, reminder_24h, reminder_4h, reminder_1h, reminder_15m, custom_preferences) VALUES
-- Student preferences (more reminders)
(1, TRUE, TRUE, TRUE, TRUE, FALSE, TRUE, TRUE, '{"marketing_emails": true, "lesson_tips": true}'),
-- Instructor preferences (fewer interruptions)  
(2, TRUE, FALSE, TRUE, TRUE, FALSE, FALSE, FALSE, '{"new_bookings": true, "cancellations": true}'),
-- Admin preferences (system notifications)
(3, TRUE, FALSE, TRUE, FALSE, FALSE, FALSE, FALSE, '{"system_alerts": true, "daily_summary": true}')
ON DUPLICATE KEY UPDATE
email_enabled = VALUES(email_enabled),
custom_preferences = VALUES(custom_preferences);