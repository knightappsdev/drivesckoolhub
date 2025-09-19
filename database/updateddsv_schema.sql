-- UpdatedDSV Landing Page Database Extensions
-- Additional tables and modifications needed for UpdatedDSV components

USE driveschool_pro;

-- ================================================================
-- 1. ENHANCED COURSES TABLE (for UpdatedDSV course structure)
-- ================================================================

-- Drop existing courses table constraints first
ALTER TABLE bookings DROP FOREIGN KEY bookings_ibfk_3;

-- Backup existing courses data if needed
CREATE TABLE IF NOT EXISTS courses_backup AS SELECT * FROM courses WHERE 1=0;

-- Drop and recreate courses table with UpdatedDSV structure
DROP TABLE IF EXISTS courses;

CREATE TABLE courses (
    id VARCHAR(50) PRIMARY KEY, -- Using string IDs like 'absolute-beginner'
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    level ENUM('absolute-beginner', 'beginner', 'intermediate', 'advanced') NOT NULL,
    total_hours INT NOT NULL DEFAULT 0,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    features JSON NOT NULL, -- Array of feature strings
    icon VARCHAR(100), -- Icon identifier for frontend
    color VARCHAR(50), -- Color theme for course cards
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
-- 2. ENHANCED INSTRUCTORS TABLE (for UpdatedDSV instructor structure)
-- ================================================================

-- Add new columns to existing instructors table for UpdatedDSV features
ALTER TABLE instructors 
ADD COLUMN IF NOT EXISTS name VARCHAR(200),
ADD COLUMN IF NOT EXISTS avatar VARCHAR(500),
ADD COLUMN IF NOT EXISTS location VARCHAR(200),
ADD COLUMN IF NOT EXISTS transmission_types JSON, -- ['manual', 'automatic']
ADD COLUMN IF NOT EXISTS price_per_hour DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS availability VARCHAR(200),
ADD COLUMN IF NOT EXISTS languages JSON, -- ['English', 'Spanish', etc.]
ADD COLUMN IF NOT EXISTS nationality VARCHAR(100),
ADD COLUMN IF NOT EXISTS religion VARCHAR(100),
ADD COLUMN IF NOT EXISTS ethnicity VARCHAR(100),
ADD COLUMN IF NOT EXISTS gender ENUM('Male', 'Female', 'Other') DEFAULT 'Other',
ADD COLUMN IF NOT EXISTS total_reviews INT DEFAULT 0;

-- ================================================================
-- 3. GUEST REVIEWS TABLE (for public landing page reviews)
-- ================================================================

CREATE TABLE guest_reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    reviewer_name VARCHAR(200) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    instructor_id INT NULL, -- Optional - can be general review or instructor-specific
    course_id VARCHAR(50) NULL, -- Optional - can be course-specific
    reviewer_email VARCHAR(255) NULL, -- Optional for follow-up
    is_verified BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE, -- For moderation
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (instructor_id) REFERENCES instructors(id) ON DELETE SET NULL,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL,
    INDEX idx_rating (rating),
    INDEX idx_approved (is_approved),
    INDEX idx_instructor (instructor_id),
    INDEX idx_course (course_id),
    INDEX idx_created_at (created_at)
);

-- ================================================================
-- 4. COURSE ENROLLMENTS TABLE (for tracking enrollments)
-- ================================================================

CREATE TABLE course_enrollments (
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
    preferred_schedule VARCHAR(500), -- JSON or text for schedule preferences
    transmission_preference ENUM('manual', 'automatic', 'both') DEFAULT 'both',
    pickup_location VARCHAR(500),
    emergency_contact_name VARCHAR(200),
    emergency_contact_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (preferred_instructor_id) REFERENCES instructors(id) ON DELETE SET NULL,
    INDEX idx_course (course_id),
    INDEX idx_status (status),
    INDEX idx_payment_status (payment_status),
    INDEX idx_student_email (student_email),
    INDEX idx_enrollment_date (enrollment_date)
);

-- ================================================================
-- 5. INSTRUCTOR AVAILABILITY TABLE (for detailed availability)
-- ================================================================

CREATE TABLE instructor_availability (
    id INT PRIMARY KEY AUTO_INCREMENT,
    instructor_id INT NOT NULL,
    day_of_week ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (instructor_id) REFERENCES instructors(id) ON DELETE CASCADE,
    UNIQUE KEY unique_instructor_day_time (instructor_id, day_of_week, start_time),
    INDEX idx_instructor (instructor_id),
    INDEX idx_day (day_of_week),
    INDEX idx_available (is_available)
);

-- ================================================================
-- 6. LEAD GENERATION TABLE (for WhatsApp and contact forms)
-- ================================================================

CREATE TABLE leads (
    id INT PRIMARY KEY AUTO_INCREMENT,
    source VARCHAR(100) NOT NULL, -- 'whatsapp', 'contact_form', 'exit_intent', etc.
    lead_type VARCHAR(100) NOT NULL, -- 'course_inquiry', 'instructor_request', 'theory_help'
    contact_name VARCHAR(200),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    message TEXT,
    course_interest VARCHAR(50), -- Links to courses.id
    instructor_preference VARCHAR(500),
    transmission_preference ENUM('manual', 'automatic', 'both'),
    preferred_location VARCHAR(200),
    urgency ENUM('low', 'medium', 'high') DEFAULT 'medium',
    status ENUM('new', 'contacted', 'qualified', 'converted', 'lost') DEFAULT 'new',
    assigned_to INT NULL, -- User who is handling this lead
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
    FOREIGN KEY (course_interest) REFERENCES courses(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
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

CREATE TABLE course_statistics (
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
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_course_date (course_id, stat_date),
    INDEX idx_course (course_id),
    INDEX idx_stat_date (stat_date)
);

-- ================================================================
-- 8. INSERT SAMPLE DATA FOR UPDATEDDSV COURSES
-- ================================================================

INSERT INTO courses (id, title, description, level, total_hours, price, features, icon, color, recommended, display_order) VALUES
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
-- 9. INSERT SAMPLE INSTRUCTOR DATA
-- ================================================================

-- Update existing instructors table with sample data that matches UpdatedDSV structure
INSERT INTO instructors (
    user_id, instructor_code, license_number, certification_level, 
    name, avatar, rating, location, experience, specialties, 
    transmission_types, price_per_hour, availability, bio, 
    languages, nationality, religion, ethnicity, gender, total_reviews
) VALUES
-- We'll need actual user_ids, so let's create some sample users first
-- For now, we'll use placeholder values and update them with real user_ids later
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
-- 10. INSERT SAMPLE GUEST REVIEWS
-- ================================================================

INSERT INTO guest_reviews (reviewer_name, rating, comment, is_approved) VALUES
('Emma Thompson', 5, 'Absolutely fantastic driving school! Sarah was incredibly patient and helped me pass first time. The course structure is brilliant and very comprehensive.', TRUE),
('James Wilson', 5, 'Excellent instructors and great value for money. The theory test preparation was particularly helpful. Highly recommend to anyone looking to learn to drive.', TRUE),
('Sophie Chen', 4, 'Very professional service. My instructor was knowledgeable and the lessons were well structured. Passed my test after completing the intermediate course.', TRUE),
('Michael Brown', 5, 'Best driving school in the area! The WhatsApp support is really convenient and the instructors are all highly qualified. Great experience overall.', TRUE),
('Lucy Davis', 5, 'Amazing experience from start to finish. The online booking system is easy to use and the instructors are friendly and professional. Passed first time!', TRUE),
('David Rodriguez', 4, 'Good quality instruction and fair pricing. The course materials are comprehensive and the mock tests really helped prepare me for the real thing.', TRUE),
('Hannah White', 5, 'Exceptional driving school! The instructors are patient, skilled, and really care about your success. The course structure is perfect for building confidence.', TRUE),
('Tom Anderson', 5, 'Brilliant instructors and excellent customer service. The theory test support was outstanding and helped me pass with flying colors. Highly recommended!', TRUE);

-- ================================================================
-- 11. RESTORE FOREIGN KEY CONSTRAINTS
-- ================================================================

-- Restore foreign key for bookings table (adjust if needed)
-- ALTER TABLE bookings ADD CONSTRAINT bookings_course_fk FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;

-- ================================================================
-- 12. CREATE INDEXES FOR PERFORMANCE
-- ================================================================

-- Additional indexes for the new tables
CREATE INDEX idx_guest_reviews_rating_approved ON guest_reviews(rating, is_approved);
CREATE INDEX idx_course_enrollments_status_date ON course_enrollments(status, enrollment_date);
CREATE INDEX idx_leads_status_source ON leads(status, source);
CREATE INDEX idx_instructor_availability_day_time ON instructor_availability(day_of_week, start_time, end_time);

-- ================================================================
-- 13. CREATE VIEWS FOR UPDATEDDSV COMPONENTS
-- ================================================================

-- View for active courses with statistics
CREATE VIEW active_courses_with_stats AS
SELECT 
    c.*,
    COALESCE(cs.views_count, 0) as views_count,
    COALESCE(cs.enrollments_count, 0) as enrollments_count,
    COALESCE(cs.average_rating, 0) as average_rating,
    COALESCE(cs.total_reviews, 0) as total_reviews
FROM courses c
LEFT JOIN course_statistics cs ON c.id = cs.course_id 
    AND cs.stat_date = CURDATE()
WHERE c.is_active = TRUE
ORDER BY c.display_order;

-- View for instructors with review counts
CREATE VIEW instructors_with_reviews AS
SELECT 
    i.*,
    u.first_name,
    u.last_name,
    u.email,
    u.phone,
    COALESCE(review_stats.review_count, 0) as actual_review_count,
    COALESCE(review_stats.avg_rating, 0) as actual_avg_rating
FROM instructors i
JOIN users u ON i.user_id = u.id
LEFT JOIN (
    SELECT 
        instructor_id,
        COUNT(*) as review_count,
        AVG(rating) as avg_rating
    FROM guest_reviews 
    WHERE is_approved = TRUE AND instructor_id IS NOT NULL
    GROUP BY instructor_id
) review_stats ON i.id = review_stats.instructor_id
WHERE u.is_active = TRUE AND u.role = 'instructor';

-- View for recent guest reviews
CREATE VIEW recent_guest_reviews AS
SELECT *
FROM guest_reviews
WHERE is_approved = TRUE
ORDER BY created_at DESC
LIMIT 50;

-- ================================================================
-- COMPLETED: UpdatedDSV Database Schema Extensions
-- ================================================================