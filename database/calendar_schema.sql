-- Enhanced Calendar System Tables
-- Add this to your existing database schema

-- Instructor availability table for scheduling
CREATE TABLE IF NOT EXISTS instructor_availability (
  id INT AUTO_INCREMENT PRIMARY KEY,
  instructor_id INT NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_pattern ENUM('daily', 'weekly', 'monthly') NULL,
  recurrence_end_date DATE NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_instructor_date (instructor_id, date),
  INDEX idx_date_range (date, start_time, end_time),
  INDEX idx_available (is_available),
  FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Schedule templates for recurring availability patterns
CREATE TABLE IF NOT EXISTS schedule_templates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  instructor_id INT NOT NULL,
  template_name VARCHAR(100) NOT NULL,
  day_of_week TINYINT NOT NULL, -- 0=Sunday, 1=Monday, etc.
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_instructor_template (instructor_id, template_name),
  INDEX idx_day_of_week (day_of_week),
  FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Time-off requests and blocked periods
CREATE TABLE IF NOT EXISTS time_off_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  instructor_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  start_time TIME NULL, -- NULL for full day
  end_time TIME NULL, -- NULL for full day
  reason VARCHAR(255),
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  approved_by INT NULL,
  approved_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_instructor_dates (instructor_id, start_date, end_date),
  INDEX idx_status (status),
  FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Automated scheduling preferences
CREATE TABLE IF NOT EXISTS scheduling_preferences (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  user_type ENUM('student', 'instructor') NOT NULL,
  preference_key VARCHAR(100) NOT NULL,
  preference_value JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_prefs (user_id, user_type),
  INDEX idx_preference_key (preference_key),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Lesson reminders and notifications
CREATE TABLE IF NOT EXISTS lesson_reminders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  reminder_type ENUM('email', 'sms', 'push', 'in_app') NOT NULL,
  reminder_time ENUM('24h', '4h', '1h', '15m') NOT NULL,
  scheduled_at TIMESTAMP NOT NULL,
  sent_at TIMESTAMP NULL,
  status ENUM('pending', 'sent', 'failed') DEFAULT 'pending',
  error_message TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_booking_reminder (booking_id, reminder_type, reminder_time),
  INDEX idx_scheduled (scheduled_at, status),
  INDEX idx_status (status),
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- Calendar integration settings
CREATE TABLE IF NOT EXISTS calendar_integrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  integration_type ENUM('google', 'outlook', 'apple', 'ical') NOT NULL,
  calendar_id VARCHAR(255) NOT NULL,
  access_token TEXT NULL,
  refresh_token TEXT NULL,
  expires_at TIMESTAMP NULL,
  sync_enabled BOOLEAN DEFAULT TRUE,
  last_sync_at TIMESTAMP NULL,
  sync_settings JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_integration (user_id, integration_type),
  INDEX idx_sync_enabled (sync_enabled),
  UNIQUE KEY unique_user_calendar (user_id, integration_type, calendar_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Scheduling analytics and insights
CREATE TABLE IF NOT EXISTS scheduling_analytics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  date DATE NOT NULL,
  instructor_id INT NULL, -- NULL for system-wide analytics
  metric_type ENUM('booking_rate', 'cancellation_rate', 'no_show_rate', 'utilization_rate') NOT NULL,
  metric_value DECIMAL(10, 4) NOT NULL,
  additional_data JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_date_instructor (date, instructor_id),
  INDEX idx_metric_type (metric_type),
  UNIQUE KEY unique_daily_metric (date, instructor_id, metric_type),
  FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Auto-scheduling rules and weights
CREATE TABLE IF NOT EXISTS auto_schedule_rules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rule_name VARCHAR(100) NOT NULL,
  rule_type ENUM('time_preference', 'instructor_preference', 'distance', 'workload', 'custom') NOT NULL,
  weight DECIMAL(5, 2) NOT NULL DEFAULT 1.0, -- Higher weight = more important
  conditions JSON NOT NULL, -- Rule conditions and parameters
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_rule_type (rule_type),
  INDEX idx_active (is_active)
);

-- Insert default auto-scheduling rules
INSERT INTO auto_schedule_rules (rule_name, rule_type, weight, conditions, is_active) VALUES
('Morning Time Preference', 'time_preference', 1.5, '{"preferred_hours": [9, 10, 11, 12], "bonus_score": 10}', true),
('Afternoon Time Preference', 'time_preference', 1.2, '{"preferred_hours": [13, 14, 15, 16, 17], "bonus_score": 5}', true),
('Low Workload Instructor', 'workload', 2.0, '{"max_daily_lessons": 8, "bonus_score": 15}', true),
('Preferred Date Match', 'time_preference', 2.5, '{"exact_date_match": true, "bonus_score": 25}', true),
('Avoid Weekend', 'time_preference', 1.0, '{"avoid_days": [0, 6], "penalty_score": 20}', true);

-- Sample data for instructor availability (optional)
INSERT INTO instructor_availability (instructor_id, date, start_time, end_time, is_available, is_recurring) VALUES
-- Instructor 1 (assuming exists) - Regular weekly schedule
(1, CURDATE(), '09:00:00', '17:00:00', true, false),
(1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '09:00:00', '17:00:00', true, false),
(1, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '09:00:00', '17:00:00', true, false),
(1, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '09:00:00', '17:00:00', true, false),
(1, DATE_ADD(CURDATE(), INTERVAL 4 DAY), '09:00:00', '15:00:00', true, false);

-- Sample scheduling preferences
INSERT INTO scheduling_preferences (user_id, user_type, preference_key, preference_value) VALUES
(1, 'instructor', 'work_hours', '{"start_time": "09:00", "end_time": "17:00", "lunch_break": {"start": "12:00", "end": "13:00"}}'),
(1, 'instructor', 'max_lessons_per_day', '{"value": 8, "break_between_lessons": 15}'),
(1, 'instructor', 'preferred_lesson_types', '{"automatic": ["basic_driving"], "manual": ["advanced_driving", "highway_driving"]}');

-- Sample auto-schedule rules for different scenarios
INSERT INTO auto_schedule_rules (rule_name, rule_type, weight, conditions, is_active) VALUES
('Student Retention Priority', 'custom', 3.0, '{"student_lesson_count": {"min": 5}, "bonus_score": 20, "description": "Priority for students with 5+ lessons"}', true),
('New Student Welcome', 'custom', 2.0, '{"student_lesson_count": {"max": 2}, "bonus_score": 15, "description": "Priority for new students"}', true),
('Instructor Specialization Match', 'instructor_preference', 2.5, '{"course_specialization_match": true, "bonus_score": 25}', true);