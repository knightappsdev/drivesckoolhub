-- UpdatedDSV Landing Page Database Extensions (Compatible Version)
-- Additional tables and modifications needed for UpdatedDSV components

USE driveschool_pro;

-- Disable foreign key checks temporarily
SET foreign_key_checks = 0;

-- ================================================================
-- 1. CREATE NEW TABLES FOR UPDATEDDSV
-- ================================================================

-- Guest Reviews Table
CREATE TABLE IF NOT EXISTS guest_reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    reviewer_name VARCHAR(200) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    instructor_id INT NULL,
    course_id VARCHAR(50) NULL,
    reviewer_email VARCHAR(255) NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_rating (rating),
    INDEX idx_approved (is_approved),
    INDEX idx_instructor (instructor_id),
    INDEX idx_course (course_id),
    INDEX idx_created_at (created_at)
);

-- Course Enrollments Table
CREATE TABLE IF NOT EXISTS course_enrollments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id VARCHAR(50) NOT NULL,
    student_name VARCHAR(200) NOT NULL,
    student_email VARCHAR(255) NOT NULL,
    student_phone VARCHAR(20),
    preferred_instructor_id INT NULL,
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    payment_status ENUM('pending', 'paid', 'partial', 'refunded') DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    notes TEXT,
    preferred_schedule VARCHAR(500),
    transmission_preference ENUM('manual', 'automatic', 'both') DEFAULT 'both',
    pickup_location VARCHAR(500),
    emergency_contact_name VARCHAR(200),
    emergency_contact_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_course (course_id),
    INDEX idx_status (status),
    INDEX idx_payment_status (payment_status),
    INDEX idx_student_email (student_email),
    INDEX idx_enrollment_date (enrollment_date)
);

-- Instructor Availability Table
CREATE TABLE IF NOT EXISTS instructor_availability (
    id INT PRIMARY KEY AUTO_INCREMENT,
    instructor_id INT NOT NULL,
    day_of_week ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_instructor (instructor_id),
    INDEX idx_day (day_of_week),
    INDEX idx_available (is_available)
);

-- Leads Table
CREATE TABLE IF NOT EXISTS leads (
    id INT PRIMARY KEY AUTO_INCREMENT,
    source VARCHAR(100) NOT NULL,
    lead_type VARCHAR(100) NOT NULL,
    contact_name VARCHAR(200),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    message TEXT,
    course_interest VARCHAR(50),
    instructor_preference VARCHAR(500),
    transmission_preference ENUM('manual', 'automatic', 'both'),
    preferred_location VARCHAR(200),
    urgency ENUM('low', 'medium', 'high') DEFAULT 'medium',
    status ENUM('new', 'contacted', 'qualified', 'converted', 'lost') DEFAULT 'new',
    assigned_to INT NULL,
    notes TEXT,
    follow_up_date TIMESTAMP NULL,
    conversion_date TIMESTAMP NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    referrer VARCHAR(500),
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_source (source),
    INDEX idx_status (status),
    INDEX idx_urgency (urgency),
    INDEX idx_assigned_to (assigned_to),
    INDEX idx_created_at (created_at),
    INDEX idx_follow_up (follow_up_date)
);

-- Course Statistics Table
CREATE TABLE IF NOT EXISTS course_statistics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id VARCHAR(50) NOT NULL,
    views_count INT DEFAULT 0,
    enrollments_count INT DEFAULT 0,
    completions_count INT DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    last_enrollment TIMESTAMP NULL,
    stat_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_course (course_id),
    INDEX idx_stat_date (stat_date)
);

-- ================================================================
-- 2. CREATE UPDATEDDSV COURSES TABLE
-- ================================================================

CREATE TABLE IF NOT EXISTS updateddsv_courses (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    level ENUM('absolute-beginner', 'beginner', 'intermediate', 'advanced') NOT NULL,
    total_hours INT NOT NULL DEFAULT 0,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    features JSON NOT NULL,
    icon VARCHAR(100),
    color VARCHAR(50),
    recommended BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_level (level),
    INDEX idx_active (is_active),
    INDEX idx_recommended (recommended),
    INDEX idx_display_order (display_order)
);

-- ================================================================
-- 3. ADD COLUMNS TO EXISTING INSTRUCTORS TABLE
-- ================================================================

-- Add columns one by one to avoid syntax errors
ALTER TABLE instructors ADD COLUMN instructor_name VARCHAR(200) DEFAULT NULL;
ALTER TABLE instructors ADD COLUMN avatar VARCHAR(500) DEFAULT NULL;
ALTER TABLE instructors ADD COLUMN location VARCHAR(200) DEFAULT NULL;
ALTER TABLE instructors ADD COLUMN transmission_types JSON DEFAULT NULL;
ALTER TABLE instructors ADD COLUMN price_per_hour DECIMAL(10,2) DEFAULT 0.00;
ALTER TABLE instructors ADD COLUMN availability_text VARCHAR(200) DEFAULT NULL;
ALTER TABLE instructors ADD COLUMN languages JSON DEFAULT NULL;
ALTER TABLE instructors ADD COLUMN nationality VARCHAR(100) DEFAULT NULL;
ALTER TABLE instructors ADD COLUMN religion VARCHAR(100) DEFAULT NULL;
ALTER TABLE instructors ADD COLUMN ethnicity VARCHAR(100) DEFAULT NULL;
ALTER TABLE instructors ADD COLUMN gender ENUM('Male', 'Female', 'Other') DEFAULT 'Other';
ALTER TABLE instructors ADD COLUMN total_reviews INT DEFAULT 0;

-- ================================================================
-- 4. INSERT SAMPLE DATA FOR UPDATEDDSV COURSES
-- ================================================================

INSERT IGNORE INTO updateddsv_courses (id, title, description, level, total_hours, price, features, icon, color, recommended, display_order) VALUES
(
    'absolute-beginner',
    'Absolute Beginner',
    'Perfect for those who have never been behind the wheel',
    'absolute-beginner',
    40,
    1200.00,
    '["Complete introduction to vehicle controls and safety", "Dual-control vehicle for maximum safety", "Patient, experienced instructors specializing in new drivers", "Theory test preparation and mock tests included", "Basic road awareness and highway code training", "Parking and maneuvering fundamentals", "Confidence building exercises in quiet areas", "Progress tracking and personalized feedback", "Flexible scheduling to fit your lifestyle", "Certificate of completion"]',
    'shield',
    'green',
    FALSE,
    1
),
(
    'beginner',
    'Beginners',
    'For those with some basic knowledge but limited practical experience',
    'beginner',
    30,
    900.00,
    '["Build upon existing basic knowledge", "Focus on practical driving skills development", "Urban and suburban driving practice", "Traffic navigation and road positioning", "Roundabout and junction handling", "Parking skills improvement (parallel, bay, reverse)", "Theory test support and practice", "Mock driving test preparation", "Hazard perception training", "Independent driving preparation"]',
    'car',
    'blue',
    TRUE,
    2
),
(
    'intermediate',
    'Intermediate',
    'Advance your skills with more complex driving scenarios',
    'intermediate',
    20,
    600.00,
    '["Advanced junction and roundabout navigation", "Dual carriageway and motorway preparation", "Complex parking maneuvers mastery", "Night driving and adverse weather conditions", "Advanced hazard awareness and anticipation", "Independent driving route planning", "Mock test practice in test conditions", "Advanced vehicle control techniques", "Eco-driving techniques for fuel efficiency", "Final test preparation and polish"]',
    'road',
    'orange',
    FALSE,
    3
),
(
    'advanced',
    'Advanced',
    'Master advanced techniques and prepare for your test',
    'advanced',
    15,
    450.00,
    '["Test-standard driving practice", "Advanced maneuvering techniques", "Motorway driving instruction (Pass Plus preparation)", "Defensive driving strategies", "Advanced parking in challenging spaces", "Test route familiarization", "Last-minute test preparation", "Post-test advanced skills development", "Commercial vehicle preparation (optional)", "Instructor development pathway guidance"]',
    'trophy',
    'red',
    FALSE,
    4
);

-- ================================================================
-- 5. INSERT SAMPLE GUEST REVIEWS
-- ================================================================

INSERT IGNORE INTO guest_reviews (reviewer_name, rating, comment, is_approved) VALUES
('Emma Thompson', 5, 'Absolutely fantastic driving school! Sarah was incredibly patient and helped me pass first time. The course structure is brilliant and very comprehensive.', TRUE),
('James Wilson', 5, 'Excellent instructors and great value for money. The theory test preparation was particularly helpful. Highly recommend to anyone looking to learn to drive.', TRUE),
('Sophie Chen', 4, 'Very professional service. My instructor was knowledgeable and the lessons were well structured. Passed my test after completing the intermediate course.', TRUE),
('Michael Brown', 5, 'Best driving school in the area! The WhatsApp support is really convenient and the instructors are all highly qualified. Great experience overall.', TRUE),
('Lucy Davis', 5, 'Amazing experience from start to finish. The online booking system is easy to use and the instructors are friendly and professional. Passed first time!', TRUE),
('David Rodriguez', 4, 'Good quality instruction and fair pricing. The course materials are comprehensive and the mock tests really helped prepare me for the real thing.', TRUE),
('Hannah White', 5, 'Exceptional driving school! The instructors are patient, skilled, and really care about your success. The course structure is perfect for building confidence.', TRUE),
('Tom Anderson', 5, 'Brilliant instructors and excellent customer service. The theory test support was outstanding and helped me pass with flying colors. Highly recommended!', TRUE);

-- ================================================================
-- 6. CREATE SAMPLE INSTRUCTOR DATA
-- ================================================================

-- Insert a sample instructor if users table has data
INSERT IGNORE INTO instructors (
    user_id, instructor_code, license_number, certification_level, 
    instructor_name, avatar, rating, location, years_experience, specialties, 
    transmission_types, price_per_hour, availability_text, bio, 
    languages, nationality, religion, ethnicity, gender, total_reviews
) VALUES
(1, 'INS001', 'LIC001', 'advanced', 'Sarah Jones', 
 'https://placehold.co/100x100/E5E7EB/374151?text=SJ', 
 4.9, 'City Centre', 8, 
 '["Nervous Drivers", "Intensive Courses", "Test Preparation"]',
 '["manual", "automatic"]', 
 35.00, 'Available this week',
 'Patient and understanding instructor with 8 years of experience. Specializes in helping nervous drivers build confidence. High first-time pass rate.',
 '["English", "Spanish"]', 'British', 'Christian', 'White British', 'Female', 127
);

-- ================================================================
-- 7. CREATE INDEXES FOR PERFORMANCE
-- ================================================================

-- Create indexes (ignore errors if they already exist)
CREATE INDEX idx_guest_reviews_rating_approved ON guest_reviews(rating, is_approved);
CREATE INDEX idx_course_enrollments_status_date ON course_enrollments(status, enrollment_date);
CREATE INDEX idx_leads_status_source ON leads(status, source);

-- Re-enable foreign key checks
SET foreign_key_checks = 1;

-- ================================================================
-- COMPLETED: UpdatedDSV Database Schema Extensions (Compatible Version)
-- ================================================================