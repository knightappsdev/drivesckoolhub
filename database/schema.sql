-- DriveSchool Pro Database Schema
-- Complete MySQL schema with 13 tables and relationships

-- Enable foreign key checks
SET foreign_key_checks = 1;

-- Create database
CREATE DATABASE IF NOT EXISTS driveschool_pro;
USE driveschool_pro;

-- 1. Users table (main user authentication)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('super_admin', 'admin', 'instructor', 'student') NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_active (is_active)
);

-- 2. Instructors table (detailed instructor information)
CREATE TABLE instructors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    instructor_code VARCHAR(20) UNIQUE NOT NULL,
    license_number VARCHAR(50) NOT NULL,
    certification_level ENUM('beginner', 'advanced', 'expert') DEFAULT 'beginner',
    specialties JSON,
    hourly_rate DECIMAL(10,2) DEFAULT 0.00,
    availability_schedule JSON,
    bio TEXT,
    years_experience INT DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_lessons INT DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_instructor_code (instructor_code),
    INDEX idx_availability (is_available)
);

-- 3. Students table (detailed student information)
CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    student_code VARCHAR(20) UNIQUE NOT NULL,
    date_of_birth DATE,
    license_type ENUM('learner', 'provisional', 'full') DEFAULT 'learner',
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    medical_conditions TEXT,
    assigned_instructor_id INT NULL,
    enrollment_date DATE DEFAULT (CURDATE()),
    total_hours_completed DECIMAL(5,2) DEFAULT 0.00,
    progress_level ENUM('beginner', 'intermediate', 'advanced', 'test_ready') DEFAULT 'beginner',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_instructor_id) REFERENCES instructors(id) ON DELETE SET NULL,
    INDEX idx_student_code (student_code),
    INDEX idx_assigned_instructor (assigned_instructor_id)
);

-- 4. Courses table (driving course packages)
CREATE TABLE courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    duration_hours DECIMAL(5,2) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    course_type ENUM('theory', 'practical', 'combo') NOT NULL,
    difficulty_level ENUM('beginner', 'intermediate', 'advanced') NOT NULL,
    requirements JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_course_type (course_type),
    INDEX idx_active (is_active)
);

-- 5. Bookings table (lesson bookings)
CREATE TABLE bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    instructor_id INT NOT NULL,
    course_id INT NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration DECIMAL(3,2) NOT NULL,
    status ENUM('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rescheduled') DEFAULT 'scheduled',
    booking_type ENUM('regular', 'makeup', 'assessment') DEFAULT 'regular',
    location VARCHAR(500),
    notes TEXT,
    cancellation_reason TEXT,
    rescheduled_from INT NULL,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (instructor_id) REFERENCES instructors(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (rescheduled_from) REFERENCES bookings(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_booking_date (booking_date),
    INDEX idx_status (status),
    INDEX idx_student_instructor (student_id, instructor_id)
);

-- 6. Lessons table (completed lesson records)
CREATE TABLE lessons (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    student_id INT NOT NULL,
    instructor_id INT NOT NULL,
    lesson_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration DECIMAL(3,2) NOT NULL,
    topics_covered JSON,
    student_performance JSON,
    instructor_notes TEXT,
    student_feedback TEXT,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    skills_practiced JSON,
    areas_for_improvement TEXT,
    next_lesson_recommendations TEXT,
    weather_conditions VARCHAR(100),
    route_taken TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (instructor_id) REFERENCES instructors(id) ON DELETE CASCADE,
    INDEX idx_lesson_date (lesson_date),
    INDEX idx_student (student_id),
    INDEX idx_instructor (instructor_id)
);

-- 7. Payments table (payment records)
CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    course_id INT NULL,
    booking_id INT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method ENUM('stripe', 'direct', 'bank_deposit') NOT NULL,
    payment_status ENUM('pending', 'processing', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    transaction_id VARCHAR(200),
    stripe_payment_intent_id VARCHAR(200),
    payment_date TIMESTAMP NULL,
    due_date DATE,
    description TEXT,
    receipt_url VARCHAR(500),
    refund_amount DECIMAL(10,2) DEFAULT 0.00,
    refund_reason TEXT,
    processed_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL,
    FOREIGN KEY (processed_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_payment_status (payment_status),
    INDEX idx_payment_method (payment_method),
    INDEX idx_student (student_id)
);

-- 8. Chat_rooms table (chat room management)
CREATE TABLE chat_rooms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    room_name VARCHAR(200) NOT NULL,
    room_type ENUM('direct', 'group', 'support') DEFAULT 'direct',
    participants JSON NOT NULL,
    created_by INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_message_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_room_type (room_type),
    INDEX idx_active (is_active)
);

-- 9. Messages table (chat messages)
CREATE TABLE messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    chat_room_id INT NOT NULL,
    sender_id INT NOT NULL,
    message_type ENUM('text', 'file', 'image', 'system') DEFAULT 'text',
    content TEXT,
    file_url VARCHAR(500),
    file_name VARCHAR(255),
    file_size BIGINT,
    is_edited BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMP NULL,
    reply_to_message_id INT NULL,
    read_by JSON,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (chat_room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reply_to_message_id) REFERENCES messages(id) ON DELETE SET NULL,
    INDEX idx_chat_room (chat_room_id),
    INDEX idx_sender (sender_id),
    INDEX idx_created_at (created_at)
);

-- 10. Assignments table (instructor-student assignments)
CREATE TABLE assignments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    instructor_id INT NOT NULL,
    assigned_by INT NOT NULL,
    assignment_date DATE DEFAULT (CURDATE()),
    start_date DATE NOT NULL,
    end_date DATE,
    status ENUM('active', 'completed', 'terminated') DEFAULT 'active',
    reason TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (instructor_id) REFERENCES instructors(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_student (student_id),
    INDEX idx_instructor (instructor_id),
    INDEX idx_status (status)
);

-- 11. Notifications table (system notifications)
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('info', 'success', 'warning', 'error', 'booking', 'payment', 'system') DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    action_url VARCHAR(500),
    metadata JSON,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_read (is_read),
    INDEX idx_type (type)
);

-- 12. Layout_settings table (customizable frontend layout)
CREATE TABLE layout_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_name VARCHAR(100) NOT NULL,
    setting_type ENUM('theme', 'section', 'component', 'color') NOT NULL,
    setting_value JSON NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    applies_to ENUM('all', 'admin', 'instructor', 'student') DEFAULT 'all',
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_setting_type (setting_type),
    INDEX idx_active (is_active)
);

-- 13. Audit_logs table (system audit trail)
CREATE TABLE audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_action (action),
    INDEX idx_table (table_name),
    INDEX idx_created_at (created_at)
);

-- Create additional indexes for performance
CREATE INDEX idx_users_role_active ON users(role, is_active);
CREATE INDEX idx_bookings_date_status ON bookings(booking_date, status);
CREATE INDEX idx_payments_status_date ON payments(payment_status, payment_date);
CREATE INDEX idx_messages_room_created ON messages(chat_room_id, created_at);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);

-- Create views for common queries
CREATE VIEW active_instructors AS
SELECT u.id, u.email, u.first_name, u.last_name, u.phone,
       i.instructor_code, i.certification_level, i.hourly_rate,
       i.rating, i.total_lessons, i.is_available
FROM users u
JOIN instructors i ON u.id = i.user_id
WHERE u.is_active = TRUE AND u.role = 'instructor';

CREATE VIEW active_students AS
SELECT u.id, u.email, u.first_name, u.last_name, u.phone,
       s.student_code, s.license_type, s.assigned_instructor_id,
       s.total_hours_completed, s.progress_level
FROM users u
JOIN students s ON u.id = s.user_id
WHERE u.is_active = TRUE AND u.role = 'student';

CREATE VIEW upcoming_bookings AS
SELECT b.id, b.booking_date, b.start_time, b.end_time,
       su.first_name as student_name, su.last_name as student_lastname,
       iu.first_name as instructor_name, iu.last_name as instructor_lastname,
       c.name as course_name, b.status
FROM bookings b
JOIN students s ON b.student_id = s.id
JOIN users su ON s.user_id = su.id
JOIN instructors i ON b.instructor_id = i.id
JOIN users iu ON i.user_id = iu.id
JOIN courses c ON b.course_id = c.id
WHERE b.booking_date >= CURDATE() AND b.status IN ('scheduled', 'confirmed');

-- Chat room participants table
CREATE TABLE chat_room_participants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_id INT NOT NULL,
  user_id INT NOT NULL,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_room_user (room_id, user_id),
  FOREIGN KEY (room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_room_user (room_id, user_id)
);

-- Message read receipts table
CREATE TABLE message_reads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  message_id INT NOT NULL,
  user_id INT NOT NULL,
  read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_message_user (message_id, user_id),
  FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_message_user (message_id, user_id)
);