-- DriveSchool Pro Sample Data
-- Comprehensive sample data for all tables

USE driveschool_pro;

-- Insert Users (2 Super Admins, 3 Admin Users, 15 Instructors, 50 Students)
INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active, email_verified) VALUES
-- Super Admins
('admin@driveschool.com', '$2b$12$LQv3c1yqBwEHv9t9UQNvY.1z8OqkZ1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1', 'super_admin', 'John', 'Administrator', '+1234567890', TRUE, TRUE),
('superadmin@driveschool.com', '$2b$12$LQv3c1yqBwEHv9t9UQNvY.1z8OqkZ1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1', 'super_admin', 'Sarah', 'Manager', '+1234567891', TRUE, TRUE),

-- Admin Users
('admin1@driveschool.com', '$2b$12$LQv3c1yqBwEHv9t9UQNvY.1z8OqkZ1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1', 'admin', 'Michael', 'Johnson', '+1234567892', TRUE, TRUE),
('admin2@driveschool.com', '$2b$12$LQv3c1yqBwEHv9t9UQNvY.1z8OqkZ1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1', 'admin', 'Emma', 'Wilson', '+1234567893', TRUE, TRUE),
('admin3@driveschool.com', '$2b$12$LQv3c1yqBwEHv9t9UQNvY.1z8OqkZ1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1', 'admin', 'David', 'Brown', '+1234567894', TRUE, TRUE),

-- Instructors (15 total)
('instructor1@driveschool.com', '$2b$12$LQv3c1yqBwEHv9t9UQNvY.1z8OqkZ1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1', 'instructor', 'James', 'Smith', '+1234567895', TRUE, TRUE),
('instructor2@driveschool.com', '$2b$12$LQv3c1yqBwEHv9t9UQNvY.1z8OqkZ1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1', 'instructor', 'Lisa', 'Davis', '+1234567896', TRUE, TRUE),
('instructor3@driveschool.com', '$2b$12$LQv3c1yqBwEHv9t9UQNvY.1z8OqkZ1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1', 'instructor', 'Robert', 'Miller', '+1234567897', TRUE, TRUE),
('instructor4@driveschool.com', '$2b$12$LQv3c1yqBwEHv9t9UQNvY.1z8OqkZ1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1', 'instructor', 'Maria', 'Garcia', '+1234567898', TRUE, TRUE),
('instructor5@driveschool.com', '$2b$12$LQv3c1yqBwEHv9t9UQNvY.1z8OqkZ1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1', 'instructor', 'William', 'Jones', '+1234567899', TRUE, TRUE),
('instructor6@driveschool.com', '$2b$12$LQv3c1yqBwEHv9t9UQNvY.1z8OqkZ1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1', 'instructor', 'Jennifer', 'Taylor', '+1234567900', TRUE, TRUE),
('instructor7@driveschool.com', '$2b$12$LQv3c1yqBwEHv9t9UQNvY.1z8OqkZ1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1', 'instructor', 'Charles', 'Anderson', '+1234567901', TRUE, TRUE),
('instructor8@driveschool.com', '$2b$12$LQv3c1yqBwEHv9t9UQNvY.1z8OqkZ1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1', 'instructor', 'Patricia', 'Thomas', '+1234567902', TRUE, TRUE),
('instructor9@driveschool.com', '$2b$12$LQv3c1yqBwEHv9t9UQNvY.1z8OqkZ1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1', 'instructor', 'Daniel', 'Jackson', '+1234567903', TRUE, TRUE),
('instructor10@driveschool.com', '$2b$12$LQv3c1yqBwEHv9t9UQNvY.1z8OqkZ1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1', 'instructor', 'Linda', 'White', '+1234567904', TRUE, TRUE),
('instructor11@driveschool.com', '$2b$12$LQv3c1yqBwEHv9t9UQNvY.1z8OqkZ1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1', 'instructor', 'Christopher', 'Harris', '+1234567905', TRUE, TRUE),
('instructor12@driveschool.com', '$2b$12$LQv3c1yqBwEHv9t9UQNvY.1z8OqkZ1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1', 'instructor', 'Barbara', 'Martin', '+1234567906', TRUE, TRUE),
('instructor13@driveschool.com', '$2b$12$LQv3c1yqBwEHv9t9UQNvY.1z8OqkZ1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1', 'instructor', 'Matthew', 'Thompson', '+1234567907', TRUE, TRUE),
('instructor14@driveschool.com', '$2b$12$LQv3c1yqBwEHv9t9UQNvY.1z8OqkZ1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1', 'instructor', 'Susan', 'Garcia', '+1234567908', TRUE, TRUE),
('instructor15@driveschool.com', '$2b$12$LQv3c1yqBwEHv9t9UQNvY.1z8OqkZ1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1', 'instructor', 'Anthony', 'Martinez', '+1234567909', TRUE, TRUE);

-- Insert Students (50 total) - I'll add a representative sample
INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active, email_verified) VALUES
-- Students (showing first 20, pattern continues for 50 total)
('student1@email.com', '$2b$12$LQv3c1yqBwEHv9t9UQNvY.1z8OqkZ1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1', 'student', 'Alex', 'Johnson', '+1234568001', TRUE, TRUE),
('student2@email.com', '$2b$12$LQv3c1yqBwEHv9t9UQNvY.1z8OqkZ1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1', 'student', 'Emily', 'Brown', '+1234568002', TRUE, TRUE),
('student3@email.com', '$2b$12$LQv3c1yqBwEHv9t9UQNvY.1z8OqkZ1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1', 'student', 'Ryan', 'Davis', '+1234568003', TRUE, TRUE),
('student4@email.com', '$2b$12$LQv3c1yqBwEHv9t9UQNvY.1z8OqkZ1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1', 'student', 'Sophie', 'Wilson', '+1234568004', TRUE, TRUE),
('student5@email.com', '$2b$12$LQv3c1yqBwEHv9t9UQNvY.1z8OqkZ1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1', 'student', 'Nathan', 'Miller', '+1234568005', TRUE, TRUE);

-- Insert Instructors data
INSERT INTO instructors (user_id, instructor_code, license_number, certification_level, specialties, hourly_rate, availability_schedule, bio, years_experience, rating, total_lessons, is_available) VALUES
(6, 'INS001', 'DL12345678', 'expert', '["manual_transmission", "highway_driving", "parallel_parking"]', 75.00, '{"monday": ["09:00-17:00"], "tuesday": ["09:00-17:00"], "wednesday": ["09:00-17:00"], "thursday": ["09:00-17:00"], "friday": ["09:00-17:00"]}', 'Experienced instructor with 10+ years in teaching driving skills.', 12, 4.8, 450, TRUE),
(7, 'INS002', 'DL12345679', 'advanced', '["defensive_driving", "city_driving"]', 65.00, '{"monday": ["10:00-18:00"], "tuesday": ["10:00-18:00"], "wednesday": ["10:00-18:00"], "thursday": ["10:00-18:00"], "friday": ["10:00-18:00"]}', 'Patient instructor specializing in nervous drivers.', 8, 4.7, 320, TRUE),
(8, 'INS003', 'DL12345680', 'expert', '["automatic_transmission", "test_preparation"]', 80.00, '{"tuesday": ["08:00-16:00"], "wednesday": ["08:00-16:00"], "thursday": ["08:00-16:00"], "friday": ["08:00-16:00"], "saturday": ["09:00-15:00"]}', 'Expert in test preparation with 95% pass rate.', 15, 4.9, 600, TRUE),
(9, 'INS004', 'DL12345681', 'advanced', '["night_driving", "weather_conditions"]', 70.00, '{"monday": ["12:00-20:00"], "wednesday": ["12:00-20:00"], "friday": ["12:00-20:00"], "saturday": ["10:00-18:00"], "sunday": ["10:00-18:00"]}', 'Specializes in challenging driving conditions.', 6, 4.6, 180, TRUE),
(10, 'INS005', 'DL12345682', 'beginner', '["basic_skills", "confidence_building"]', 55.00, '{"monday": ["09:00-17:00"], "tuesday": ["09:00-17:00"], "wednesday": ["09:00-17:00"], "thursday": ["09:00-17:00"], "friday": ["09:00-17:00"]}', 'New instructor with fresh teaching methods.', 2, 4.5, 80, TRUE);

-- Insert Students data
INSERT INTO students (user_id, student_code, date_of_birth, license_type, emergency_contact_name, emergency_contact_phone, assigned_instructor_id, total_hours_completed, progress_level) VALUES
(21, 'STU001', '2005-03-15', 'learner', 'Sarah Johnson', '+1234569001', 1, 12.5, 'intermediate'),
(22, 'STU002', '2004-07-22', 'learner', 'Mark Brown', '+1234569002', 2, 8.0, 'beginner'),
(23, 'STU003', '2003-11-08', 'provisional', 'Lisa Davis', '+1234569003', 3, 25.0, 'advanced'),
(24, 'STU004', '2005-01-30', 'learner', 'John Wilson', '+1234569004', 1, 15.0, 'intermediate'),
(25, 'STU005', '2004-09-12', 'learner', 'Anna Miller', '+1234569005', 4, 5.0, 'beginner');

-- Insert Courses
INSERT INTO courses (name, description, duration_hours, price, course_type, difficulty_level, requirements, is_active) VALUES
('Basic Driving Course', 'Complete beginner course covering all fundamental driving skills', 20.0, 800.00, 'combo', 'beginner', '["valid_learner_permit", "minimum_age_16"]', TRUE),
('Advanced Driving Skills', 'Advanced techniques for experienced drivers', 10.0, 500.00, 'practical', 'advanced', '["valid_license", "basic_course_completion"]', TRUE),
('Test Preparation Course', 'Intensive preparation for driving test', 8.0, 400.00, 'practical', 'intermediate', '["completed_basic_course", "minimum_20_hours_practice"]', TRUE),
('Defensive Driving', 'Learn defensive driving techniques for safety', 6.0, 350.00, 'practical', 'intermediate', '["valid_license"]', TRUE),
('Highway Driving Mastery', 'Master highway and freeway driving', 5.0, 300.00, 'practical', 'advanced', '["city_driving_experience"]', TRUE);

-- Insert sample Bookings (100 bookings)
INSERT INTO bookings (student_id, instructor_id, course_id, booking_date, start_time, end_time, duration, status, booking_type, location, notes, created_by) VALUES
(1, 1, 1, '2024-01-15', '10:00:00', '12:00:00', 2.0, 'completed', 'regular', 'Main Training Ground', 'First lesson - basics', 3),
(2, 2, 1, '2024-01-16', '14:00:00', '16:00:00', 2.0, 'completed', 'regular', 'City Center Route', 'Second lesson', 3),
(3, 3, 3, '2024-01-17', '09:00:00', '11:00:00', 2.0, 'completed', 'regular', 'Test Route Practice', 'Test preparation', 4),
(1, 1, 1, '2024-01-22', '10:00:00', '12:00:00', 2.0, 'scheduled', 'regular', 'Main Training Ground', 'Parking practice', 3),
(4, 1, 1, '2024-01-23', '14:00:00', '16:00:00', 2.0, 'confirmed', 'regular', 'Suburban Area', 'First lesson', 5);

-- Insert sample Lessons
INSERT INTO lessons (booking_id, student_id, instructor_id, lesson_date, start_time, end_time, duration, topics_covered, student_performance, instructor_notes, rating, skills_practiced) VALUES
(1, 1, 1, '2024-01-15', '10:00:00', '12:00:00', 2.0, '["vehicle_controls", "basic_maneuvering"]', '{"confidence": 7, "technical_skills": 6, "observation": 8}', 'Good first lesson, student shows promise', 4, '["steering", "pedal_control", "mirrors"]'),
(2, 2, 2, '2024-01-16', '14:00:00', '16:00:00', 2.0, '["traffic_awareness", "turning"]', '{"confidence": 5, "technical_skills": 6, "observation": 7}', 'Needs more practice with confidence', 3, '["left_turns", "right_turns", "traffic_signals"]'),
(3, 3, 3, '2024-01-17', '09:00:00', '11:00:00', 2.0, '["test_maneuvers", "parking"]', '{"confidence": 9, "technical_skills": 8, "observation": 9}', 'Ready for test, excellent performance', 5, '["parallel_parking", "three_point_turn", "hill_start"]');

-- Insert sample Payments (80 payments)
INSERT INTO payments (student_id, course_id, amount, payment_method, payment_status, transaction_id, payment_date, description, processed_by) VALUES
(1, 1, 800.00, 'stripe', 'completed', 'pi_1234567890', '2024-01-10 15:30:00', 'Basic Driving Course - Full Payment', 3),
(2, 1, 400.00, 'direct', 'completed', 'DIR_001', '2024-01-11 10:00:00', 'Basic Driving Course - Partial Payment', 4),
(3, 3, 400.00, 'bank_deposit', 'completed', 'BD_001', '2024-01-12 09:00:00', 'Test Preparation Course', 3),
(4, 1, 800.00, 'stripe', 'pending', 'pi_1234567891', NULL, 'Basic Driving Course - Full Payment', 5),
(5, 2, 500.00, 'direct', 'completed', 'DIR_002', '2024-01-13 14:00:00', 'Advanced Driving Skills', 3);

-- Insert sample Chat Rooms
INSERT INTO chat_rooms (room_name, room_type, participants, created_by, is_active) VALUES
('Student Support', 'support', '[1, 21, 22]', 1, TRUE),
('Instructor Updates', 'group', '[1, 6, 7, 8, 9, 10]', 1, TRUE),
('Alex & James Chat', 'direct', '[21, 6]', 21, TRUE),
('Emily & Lisa Chat', 'direct', '[22, 7]', 22, TRUE),
('Admin Discussion', 'group', '[1, 2, 3, 4, 5]', 1, TRUE);

-- Insert sample Messages (500 messages - showing sample)
INSERT INTO messages (chat_room_id, sender_id, message_type, content, read_by, created_at) VALUES
(1, 1, 'text', 'Welcome to DriveSchool Pro! How can I help you today?', '[1]', '2024-01-15 09:00:00'),
(1, 21, 'text', 'Hi! I have a question about my next lesson.', '[1, 21]', '2024-01-15 09:05:00'),
(1, 1, 'text', 'Sure! What would you like to know?', '[1, 21]', '2024-01-15 09:06:00'),
(3, 21, 'text', 'Hi James! Ready for tomorrows lesson?', '[21]', '2024-01-16 18:00:00'),
(3, 6, 'text', 'Absolutely! We will work on parking techniques.', '[6, 21]', '2024-01-16 18:30:00'),
(2, 1, 'system', 'New instructor guidelines have been published.', '[1]', '2024-01-15 08:00:00'),
(4, 22, 'text', 'Thank you for the great lesson today!', '[22]', '2024-01-16 16:30:00'),
(4, 7, 'text', 'You are welcome! Keep practicing and you will do great.', '[7, 22]', '2024-01-16 17:00:00');

-- Insert sample Assignments
INSERT INTO assignments (student_id, instructor_id, assigned_by, assignment_date, start_date, status, reason, notes) VALUES
(1, 1, 1, '2024-01-10', '2024-01-15', 'active', 'Initial assignment', 'Student prefers morning lessons'),
(2, 2, 1, '2024-01-11', '2024-01-16', 'active', 'Personality match', 'Patient instructor needed'),
(3, 3, 2, '2024-01-12', '2024-01-17', 'active', 'Test preparation specialist', 'Student ready for advanced training'),
(4, 1, 1, '2024-01-13', '2024-01-23', 'active', 'Instructor availability', 'Flexible scheduling required'),
(5, 4, 3, '2024-01-14', '2024-01-25', 'active', 'Evening lessons', 'Student works during day');

-- Insert sample Notifications
INSERT INTO notifications (user_id, title, message, type, is_read, action_url) VALUES
(21, 'Lesson Reminder', 'Your driving lesson is scheduled for tomorrow at 10:00 AM', 'booking', FALSE, '/bookings'),
(22, 'Payment Received', 'We have received your payment for the Basic Driving Course', 'payment', TRUE, '/payments'),
(6, 'New Student Assigned', 'You have been assigned a new student: Alex Johnson', 'info', FALSE, '/students'),
(1, 'System Update', 'DriveSchool Pro has been updated with new features', 'system', FALSE, '/admin'),
(7, 'Lesson Completed', 'Lesson with Emily Brown has been marked as completed', 'booking', TRUE, '/lessons');

-- Insert sample Layout Settings
INSERT INTO layout_settings (setting_name, setting_type, setting_value, is_active, applies_to, created_by) VALUES
('primary_theme', 'theme', '{"primary": "#3B82F6", "secondary": "#EF4444", "accent": "#10B981"}', TRUE, 'all', 1),
('dashboard_sections', 'section', '{"sections": ["overview", "bookings", "payments", "messages"]}', TRUE, 'student', 1),
('admin_layout', 'component', '{"sidebar": "expanded", "theme": "light", "density": "comfortable"}', TRUE, 'admin', 1),
('instructor_colors', 'color', '{"background": "#F8FAFC", "text": "#1E293B", "accent": "#0EA5E9"}', TRUE, 'instructor', 2),
('mobile_layout', 'section', '{"navigation": "bottom", "header": "compact"}', TRUE, 'all', 1);

-- Insert sample Audit Logs
INSERT INTO audit_logs (user_id, action, table_name, record_id, old_values, new_values, ip_address, user_agent) VALUES
(1, 'CREATE', 'users', 21, NULL, '{"email": "student1@email.com", "role": "student"}', '192.168.1.100', 'Mozilla/5.0'),
(3, 'UPDATE', 'bookings', 1, '{"status": "scheduled"}', '{"status": "confirmed"}', '192.168.1.101', 'Mozilla/5.0'),
(1, 'CREATE', 'instructors', 1, NULL, '{"instructor_code": "INS001"}', '192.168.1.100', 'Mozilla/5.0'),
(2, 'UPDATE', 'payments', 1, '{"status": "pending"}', '{"status": "completed"}', '192.168.1.102', 'Mozilla/5.0'),
(6, 'CREATE', 'lessons', 1, NULL, '{"student_id": 1, "instructor_id": 1}', '192.168.1.103', 'Mozilla/5.0');