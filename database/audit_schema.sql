-- Audit Trail System Tables
-- Add this to your existing database schema

-- Audit logs table to track all user activities
CREATE TABLE IF NOT EXISTS audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  action VARCHAR(100) NOT NULL,
  table_name VARCHAR(100),
  record_id INT,
  old_values JSON,
  new_values JSON,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_action (action),
  INDEX idx_table_name (table_name),
  INDEX idx_created_at (created_at),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- System events table for non-user actions
CREATE TABLE IF NOT EXISTS system_events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL,
  event_data JSON,
  severity ENUM('info', 'warning', 'error', 'critical') DEFAULT 'info',
  source VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_event_type (event_type),
  INDEX idx_severity (severity),
  INDEX idx_created_at (created_at)
);

-- Login attempts table for security monitoring
CREATE TABLE IF NOT EXISTS login_attempts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  ip_address VARCHAR(45) NOT NULL,
  user_agent TEXT,
  success BOOLEAN DEFAULT FALSE,
  failure_reason VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_ip_address (ip_address),
  INDEX idx_success (success),
  INDEX idx_created_at (created_at)
);

-- Activity summaries for dashboard performance
CREATE TABLE IF NOT EXISTS activity_summaries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  date DATE NOT NULL,
  total_actions INT DEFAULT 0,
  failed_logins INT DEFAULT 0,
  successful_logins INT DEFAULT 0,
  high_risk_activities INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_date (date),
  INDEX idx_date (date)
);