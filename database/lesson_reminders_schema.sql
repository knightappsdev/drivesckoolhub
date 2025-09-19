-- Lesson reminders table for scheduling automated notifications
CREATE TABLE IF NOT EXISTS lesson_reminders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  user_id INT NOT NULL,
  reminder_type ENUM('24h', '4h', '1h', '15m') NOT NULL,
  scheduled_at TIMESTAMP NOT NULL,
  template_data JSON NOT NULL, -- Template variables for the notification
  status ENUM('scheduled', 'sent', 'failed', 'cancelled') DEFAULT 'scheduled',
  sent_at TIMESTAMP NULL,
  error_message TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_scheduled_status (scheduled_at, status),
  INDEX idx_booking_id (booking_id),
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Add some sample data for testing
INSERT INTO lesson_reminders (booking_id, user_id, reminder_type, scheduled_at, template_data, status) VALUES
(1, 1, '24h', DATE_ADD(NOW(), INTERVAL 1 HOUR), '{"student_name": "John Doe", "instructor_name": "Jane Smith", "course_name": "Basic Driving", "lesson_date": "2024-01-15", "lesson_time": "10:00 AM", "duration": "2 hours", "reminder_time": "24 hours"}', 'scheduled'),
(1, 1, '1h', DATE_ADD(NOW(), INTERVAL 2 HOURS), '{"student_name": "John Doe", "instructor_name": "Jane Smith", "course_name": "Basic Driving", "lesson_date": "2024-01-15", "lesson_time": "10:00 AM", "duration": "2 hours", "reminder_time": "1 hour"}', 'scheduled');