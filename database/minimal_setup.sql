-- Minimal setup for UpdatedDSV functionality
USE driveschool_pro;

-- Create guest_reviews table
CREATE TABLE IF NOT EXISTS guest_reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    reviewer_name VARCHAR(200) NOT NULL,
    rating INT NOT NULL,
    comment TEXT NOT NULL,
    instructor_id INT NULL,
    course_id VARCHAR(50) NULL,
    reviewer_email VARCHAR(255) NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT TRUE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create updateddsv_courses table  
CREATE TABLE IF NOT EXISTS updateddsv_courses (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    level VARCHAR(50) NOT NULL,
    total_hours INT NOT NULL DEFAULT 0,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    features JSON,
    icon VARCHAR(100),
    color VARCHAR(50),
    recommended BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample course data
INSERT IGNORE INTO updateddsv_courses (id, title, description, level, total_hours, price, features, icon, color, recommended, display_order) VALUES
('absolute-beginner', 'Absolute Beginner', 'Perfect for those who have never been behind the wheel', 'absolute-beginner', 40, 1200.00, '["Complete introduction to vehicle controls", "Dual-control vehicle", "Patient instructors", "Theory test preparation"]', 'shield', 'green', FALSE, 1),
('beginner', 'Beginners', 'For those with some basic knowledge but limited practical experience', 'beginner', 30, 900.00, '["Build upon existing knowledge", "Practical driving skills", "Urban driving practice", "Mock test preparation"]', 'car', 'blue', TRUE, 2),
('intermediate', 'Intermediate', 'Advance your skills with more complex driving scenarios', 'intermediate', 20, 600.00, '["Advanced navigation", "Motorway preparation", "Complex maneuvers", "Night driving"]', 'road', 'orange', FALSE, 3),
('advanced', 'Advanced', 'Master advanced techniques and prepare for your test', 'advanced', 15, 450.00, '["Test-standard practice", "Advanced techniques", "Defensive driving", "Test preparation"]', 'trophy', 'red', FALSE, 4);

-- Insert sample review data
INSERT IGNORE INTO guest_reviews (reviewer_name, rating, comment, is_approved) VALUES
('Emma Thompson', 5, 'Absolutely fantastic driving school! Great experience overall.', TRUE),
('James Wilson', 5, 'Excellent instructors and great value for money. Highly recommended.', TRUE),
('Sophie Chen', 4, 'Very professional service. Passed my test after the course.', TRUE),
('Michael Brown', 5, 'Best driving school in the area! Great instructors.', TRUE);