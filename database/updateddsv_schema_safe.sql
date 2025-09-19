-- UpdatedDSV Landing Page Database Extensions (Safe Version)
-- Additional tables and modifications needed for UpdatedDSV components

USE driveschool_pro;

-- Disable foreign key checks temporarily
SET foreign_key_checks = 0;

-- ================================================================
-- 1. BACKUP AND MODIFY EXISTING COURSES TABLE
-- ================================================================

-- First, let's add the new columns to the existing courses table instead of dropping it
ALTER TABLE courses 
MODIFY COLUMN id VARCHAR(50),
ADD COLUMN IF NOT EXISTS title VARCHAR(200),
ADD COLUMN IF NOT EXISTS level ENUM('absolute-beginner', 'beginner', 'intermediate', 'advanced'),
ADD COLUMN IF NOT EXISTS total_hours INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS features JSON,
ADD COLUMN IF NOT EXISTS icon VARCHAR(100),
ADD COLUMN IF NOT EXISTS color VARCHAR(50),
ADD COLUMN IF NOT EXISTS recommended BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0;

-- Update existing course data if any exists
-- (We'll populate with sample data later)

-- ================================================================
-- 2. ENHANCED INSTRUCTORS TABLE (for UpdatedDSV instructor structure)
-- ================================================================

-- Add new columns to existing instructors table for UpdatedDSV features
ALTER TABLE instructors 
ADD COLUMN IF NOT EXISTS name VARCHAR(200),
ADD COLUMN IF NOT EXISTS avatar VARCHAR(500),
ADD COLUMN IF NOT EXISTS location VARCHAR(200),
ADD COLUMN IF NOT EXISTS transmission_types JSON,
ADD COLUMN IF NOT EXISTS price_per_hour DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS availability VARCHAR(200),
ADD COLUMN IF NOT EXISTS languages JSON,
ADD COLUMN IF NOT EXISTS nationality VARCHAR(100),
ADD COLUMN IF NOT EXISTS religion VARCHAR(100),
ADD COLUMN IF NOT EXISTS ethnicity VARCHAR(100),
ADD COLUMN IF NOT EXISTS gender ENUM('Male', 'Female', 'Other') DEFAULT 'Other',
ADD COLUMN IF NOT EXISTS total_reviews INT DEFAULT 0;

-- ================================================================
-- 3. GUEST REVIEWS TABLE (for public landing page reviews)
-- ================================================================

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

-- ================================================================
-- 4. COURSE ENROLLMENTS TABLE (for tracking enrollments)
-- ================================================================

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

-- ================================================================
-- 5. INSTRUCTOR AVAILABILITY TABLE (for detailed availability)
-- ================================================================

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

-- ================================================================
-- 6. LEAD GENERATION TABLE (for WhatsApp and contact forms)
-- ================================================================

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

-- ================================================================
-- 7. COURSE STATISTICS TABLE (for analytics and performance)
-- ================================================================

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
-- 8. INSERT/UPDATE SAMPLE DATA FOR UPDATEDDSV COURSES
-- ================================================================

-- Clear existing courses and insert UpdatedDSV courses
DELETE FROM courses WHERE id IN ('absolute-beginner', 'beginner', 'intermediate', 'advanced');

INSERT INTO courses (id, name, title, description, level, duration_hours, total_hours, price, course_type, difficulty_level, features, icon, color, recommended, display_order, is_active) VALUES
(
    'absolute-beginner',
    'Absolute Beginner Course',
    'Absolute Beginner',
    'Perfect for those who have never been behind the wheel',
    'absolute-beginner',
    40.0,
    40,
    1200.00,
    'combo',
    'beginner',
    '["Complete introduction to vehicle controls and safety", "Dual-control vehicle for maximum safety", "Patient, experienced instructors specializing in new drivers", "Theory test preparation and mock tests included", "Basic road awareness and highway code training", "Parking and maneuvering fundamentals", "Confidence building exercises in quiet areas", "Progress tracking and personalized feedback", "Flexible scheduling to fit your lifestyle", "Certificate of completion"]',
    'shield',
    'green',
    FALSE,
    1,
    TRUE
),
(
    'beginner',
    'Beginner Course',
    'Beginners',
    'For those with some basic knowledge but limited practical experience',
    'beginner',
    30.0,
    30,
    900.00,
    'combo',
    'beginner',
    '["Build upon existing basic knowledge", "Focus on practical driving skills development", "Urban and suburban driving practice", "Traffic navigation and road positioning", "Roundabout and junction handling", "Parking skills improvement (parallel, bay, reverse)", "Theory test support and practice", "Mock driving test preparation", "Hazard perception training", "Independent driving preparation"]',
    'car',
    'blue',
    TRUE,
    2,
    TRUE
),
(
    'intermediate',
    'Intermediate Course',
    'Intermediate',
    'Advance your skills with more complex driving scenarios',
    'intermediate',
    20.0,
    20,
    600.00,
    'practical',
    'intermediate',
    '["Advanced junction and roundabout navigation", "Dual carriageway and motorway preparation", "Complex parking maneuvers mastery", "Night driving and adverse weather conditions", "Advanced hazard awareness and anticipation", "Independent driving route planning", "Mock test practice in test conditions", "Advanced vehicle control techniques", "Eco-driving techniques for fuel efficiency", "Final test preparation and polish"]',
    'road',
    'orange',
    FALSE,
    3,
    TRUE
),
(
    'advanced',
    'Advanced Course',
    'Advanced',
    'Master advanced techniques and prepare for your test',
    'advanced',
    15.0,
    15,
    450.00,
    'practical',
    'advanced',
    '["Test-standard driving practice", "Advanced maneuvering techniques", "Motorway driving instruction (Pass Plus preparation)", "Defensive driving strategies", "Advanced parking in challenging spaces", "Test route familiarization", "Last-minute test preparation", "Post-test advanced skills development", "Commercial vehicle preparation (optional)", "Instructor development pathway guidance"]',
    'trophy',
    'red',
    FALSE,
    4,
    TRUE
);

-- ================================================================
-- 9. INSERT SAMPLE GUEST REVIEWS
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
-- 10. CREATE INDEXES FOR PERFORMANCE
-- ================================================================

-- Additional indexes for the new tables
CREATE INDEX IF NOT EXISTS idx_guest_reviews_rating_approved ON guest_reviews(rating, is_approved);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_status_date ON course_enrollments(status, enrollment_date);
CREATE INDEX IF NOT EXISTS idx_leads_status_source ON leads(status, source);
CREATE INDEX IF NOT EXISTS idx_instructor_availability_day_time ON instructor_availability(day_of_week, start_time, end_time);

-- Add foreign key constraints after tables are created
ALTER TABLE guest_reviews ADD CONSTRAINT IF NOT EXISTS fk_guest_reviews_instructor FOREIGN KEY (instructor_id) REFERENCES instructors(id) ON DELETE SET NULL;
ALTER TABLE course_enrollments ADD CONSTRAINT IF NOT EXISTS fk_enrollments_instructor FOREIGN KEY (preferred_instructor_id) REFERENCES instructors(id) ON DELETE SET NULL;
ALTER TABLE instructor_availability ADD CONSTRAINT IF NOT EXISTS fk_availability_instructor FOREIGN KEY (instructor_id) REFERENCES instructors(id) ON DELETE CASCADE;
ALTER TABLE leads ADD CONSTRAINT IF NOT EXISTS fk_leads_assigned_user FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL;

-- Re-enable foreign key checks
SET foreign_key_checks = 1;

-- ================================================================
-- COMPLETED: UpdatedDSV Database Schema Extensions (Safe Version)
-- ================================================================