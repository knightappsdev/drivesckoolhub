import mysql from 'mysql2/promise';
import { User } from '@/lib/auth';

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'driveschool_pro',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Database connection utility
export async function getConnection() {
  try {
    return await pool.getConnection();
  } catch (error) {
    console.error('Database connection error:', error);
    throw new Error('Failed to connect to database');
  }
}

// Execute query utility
export async function executeQuery<T = any>(
  query: string, 
  params: any[] = []
): Promise<T[]> {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute(query, params);
    return rows as T[];
  } catch (error) {
    console.error('Query execution error:', error);
    throw error;
  } finally {
    connection.release();
  }
}

// Execute single query utility
export async function executeQuerySingle<T = any>(
  query: string, 
  params: any[] = []
): Promise<T | null> {
  const results = await executeQuery<T>(query, params);
  return results.length > 0 ? results[0] : null;
}

// Alias for compatibility with existing imports
export const query = executeQuery;

// User-related database functions
export async function getUserByEmail(email: string): Promise<User & { password_hash: string } | null> {
  const query = `
    SELECT id, email, password_hash, role, first_name, last_name, 
           phone, avatar_url, is_active, email_verified, last_login,
           created_at, updated_at
    FROM users 
    WHERE email = ? AND is_active = TRUE
  `;
  
  return executeQuerySingle<User & { password_hash: string }>(query, [email]);
}

export async function getUserById(id: number): Promise<User & { password_hash: string } | null> {
  const query = `
    SELECT id, email, password_hash, role, first_name, last_name, 
           phone, avatar_url, is_active, email_verified, last_login,
           created_at, updated_at
    FROM users 
    WHERE id = ? AND is_active = TRUE
  `;
  
  return executeQuerySingle<User & { password_hash: string }>(query, [id]);
}

export async function createUser(userData: {
  email: string;
  password_hash: string;
  role: string;
  first_name: string;
  last_name: string;
  phone?: string;
}): Promise<number> {
  const query = `
    INSERT INTO users (email, password_hash, role, first_name, last_name, phone)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  const params = [
    userData.email,
    userData.password_hash,
    userData.role,
    userData.first_name,
    userData.last_name,
    userData.phone || null,
  ];
  
  const connection = await getConnection();
  try {
    const [result] = await connection.execute(query, params);
    return (result as any).insertId;
  } finally {
    connection.release();
  }
}

export async function updateUser(id: number, userData: Partial<User>): Promise<boolean> {
  const fields = [];
  const values = [];
  
  for (const [key, value] of Object.entries(userData)) {
    if (value !== undefined && key !== 'id') {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  }
  
  if (fields.length === 0) return false;
  
  values.push(id);
  const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
  
  const connection = await getConnection();
  try {
    const [result] = await connection.execute(query, values);
    return (result as any).affectedRows > 0;
  } finally {
    connection.release();
  }
}

export async function updateUserLastLogin(id: number): Promise<void> {
  const query = `UPDATE users SET last_login = NOW() WHERE id = ?`;
  await executeQuery(query, [id]);
}

export async function getAllUsers(limit = 50, offset = 0): Promise<User[]> {
  const query = `
    SELECT id, email, role, first_name, last_name, phone, avatar_url, 
           is_active, email_verified, last_login, created_at, updated_at
    FROM users 
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `;
  
  return executeQuery<User>(query, [limit, offset]);
}

// Instructor-related database functions
export interface Instructor {
  id: number;
  user_id: number;
  instructor_code: string;
  license_number: string;
  certification_level: 'beginner' | 'advanced' | 'expert';
  specialties: string[];
  hourly_rate: number;
  availability_schedule: Record<string, string[]>;
  bio?: string;
  years_experience: number;
  rating: number;
  total_lessons: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  // User information
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

export async function getAllInstructors(): Promise<Instructor[]> {
  const query = `
    SELECT i.*, u.email, u.first_name, u.last_name, u.phone
    FROM instructors i
    JOIN users u ON i.user_id = u.id
    WHERE u.is_active = TRUE
    ORDER BY u.first_name, u.last_name
  `;
  
  const results = await executeQuery(query);
  return results.map(row => ({
    ...row,
    specialties: JSON.parse(row.specialties || '[]'),
    availability_schedule: JSON.parse(row.availability_schedule || '{}'),
  }));
}

export async function getInstructorById(id: number): Promise<Instructor | null> {
  const query = `
    SELECT i.*, u.email, u.first_name, u.last_name, u.phone
    FROM instructors i
    JOIN users u ON i.user_id = u.id
    WHERE i.id = ? AND u.is_active = TRUE
  `;
  
  const result = await executeQuerySingle(query, [id]);
  if (!result) return null;
  
  return {
    ...result,
    specialties: JSON.parse(result.specialties || '[]'),
    availability_schedule: JSON.parse(result.availability_schedule || '{}'),
  };
}

export async function createInstructor(instructorData: {
  user_id: number;
  instructor_code: string;
  license_number: string;
  certification_level: string;
  specialties: string[];
  hourly_rate: number;
  availability_schedule: Record<string, string[]>;
  bio?: string;
  years_experience: number;
}): Promise<number> {
  const query = `
    INSERT INTO instructors (
      user_id, instructor_code, license_number, certification_level,
      specialties, hourly_rate, availability_schedule, bio, years_experience
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const params = [
    instructorData.user_id,
    instructorData.instructor_code,
    instructorData.license_number,
    instructorData.certification_level,
    JSON.stringify(instructorData.specialties),
    instructorData.hourly_rate,
    JSON.stringify(instructorData.availability_schedule),
    instructorData.bio || null,
    instructorData.years_experience,
  ];
  
  const connection = await getConnection();
  try {
    const [result] = await connection.execute(query, params);
    return (result as any).insertId;
  } finally {
    connection.release();
  }
}

// Student-related database functions
export interface Student {
  id: number;
  user_id: number;
  student_code: string;
  date_of_birth?: string;
  license_type: 'learner' | 'provisional' | 'full';
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  medical_conditions?: string;
  assigned_instructor_id?: number;
  enrollment_date: string;
  total_hours_completed: number;
  progress_level: 'beginner' | 'intermediate' | 'advanced' | 'test_ready';
  created_at: string;
  updated_at: string;
  // User information
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  // Instructor information
  instructor_name?: string;
}

export async function getAllStudents(): Promise<Student[]> {
  const query = `
    SELECT s.*, u.email, u.first_name, u.last_name, u.phone,
           CONCAT(iu.first_name, ' ', iu.last_name) as instructor_name
    FROM students s
    JOIN users u ON s.user_id = u.id
    LEFT JOIN instructors i ON s.assigned_instructor_id = i.id
    LEFT JOIN users iu ON i.user_id = iu.id
    WHERE u.is_active = TRUE
    ORDER BY u.first_name, u.last_name
  `;
  
  return executeQuery<Student>(query);
}

export async function getStudentById(id: number): Promise<Student | null> {
  const query = `
    SELECT s.*, u.email, u.first_name, u.last_name, u.phone,
           CONCAT(iu.first_name, ' ', iu.last_name) as instructor_name
    FROM students s
    JOIN users u ON s.user_id = u.id
    LEFT JOIN instructors i ON s.assigned_instructor_id = i.id
    LEFT JOIN users iu ON i.user_id = iu.id
    WHERE s.id = ? AND u.is_active = TRUE
  `;
  
  return executeQuerySingle<Student>(query, [id]);
}

export async function assignInstructorToStudent(
  studentId: number, 
  instructorId: number, 
  assignedBy: number
): Promise<boolean> {
  const connection = await getConnection();
  try {
    await connection.beginTransaction();
    
    // Update student assignment
    await connection.execute(
      'UPDATE students SET assigned_instructor_id = ? WHERE id = ?',
      [instructorId, studentId]
    );
    
    // Create assignment record
    await connection.execute(
      `INSERT INTO assignments (student_id, instructor_id, assigned_by, start_date, status)
       VALUES (?, ?, ?, CURDATE(), 'active')`,
      [studentId, instructorId, assignedBy]
    );
    
    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Booking-related database functions
export interface Booking {
  id: number;
  student_id: number;
  instructor_id: number;
  course_id: number;
  booking_date: string;
  start_time: string;
  end_time: string;
  duration: number;
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'rescheduled';
  booking_type: 'regular' | 'makeup' | 'assessment';
  location?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Related information
  student_name: string;
  instructor_name: string;
  course_name: string;
}

export async function getUpcomingBookings(limit = 20): Promise<Booking[]> {
  const query = `
    SELECT b.*, 
           CONCAT(su.first_name, ' ', su.last_name) as student_name,
           CONCAT(iu.first_name, ' ', iu.last_name) as instructor_name,
           c.name as course_name
    FROM bookings b
    JOIN students s ON b.student_id = s.id
    JOIN users su ON s.user_id = su.id
    JOIN instructors i ON b.instructor_id = i.id
    JOIN users iu ON i.user_id = iu.id
    JOIN courses c ON b.course_id = c.id
    WHERE b.booking_date >= CURDATE() 
      AND b.status IN ('scheduled', 'confirmed')
    ORDER BY b.booking_date, b.start_time
    LIMIT ?
  `;
  
  return executeQuery<Booking>(query, [limit]);
}

// Course-related database functions
export interface Course {
  id: number;
  name: string;
  description: string;
  duration_hours: number;
  price: number;
  course_type: 'theory' | 'practical' | 'combo';
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  requirements: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export async function getAllCourses(): Promise<Course[]> {
  const query = `
    SELECT * FROM courses 
    WHERE is_active = TRUE 
    ORDER BY course_type, difficulty_level, name
  `;
  
  const results = await executeQuery(query);
  return results.map(row => ({
    ...row,
    requirements: JSON.parse(row.requirements || '[]'),
  }));
}

// Analytics and reporting functions
export async function getDashboardStats() {
  const queries = {
    totalUsers: 'SELECT COUNT(*) as count FROM users WHERE is_active = TRUE',
    totalInstructors: 'SELECT COUNT(*) as count FROM instructors i JOIN users u ON i.user_id = u.id WHERE u.is_active = TRUE',
    totalStudents: 'SELECT COUNT(*) as count FROM students s JOIN users u ON s.user_id = u.id WHERE u.is_active = TRUE',
    upcomingBookings: 'SELECT COUNT(*) as count FROM bookings WHERE booking_date >= CURDATE() AND status IN ("scheduled", "confirmed")',
    completedLessons: 'SELECT COUNT(*) as count FROM lessons WHERE lesson_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)',
    totalRevenue: 'SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE payment_status = "completed" AND payment_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)',
  };

  const results = await Promise.all([
    executeQuerySingle(queries.totalUsers),
    executeQuerySingle(queries.totalInstructors),
    executeQuerySingle(queries.totalStudents),
    executeQuerySingle(queries.upcomingBookings),
    executeQuerySingle(queries.completedLessons),
    executeQuerySingle(queries.totalRevenue),
  ]);

  return {
    totalUsers: results[0]?.count || 0,
    totalInstructors: results[1]?.count || 0,
    totalStudents: results[2]?.count || 0,
    upcomingBookings: results[3]?.count || 0,
    completedLessons: results[4]?.count || 0,
    totalRevenue: results[5]?.total || 0,
  };
}

// Health check function
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await executeQuery('SELECT 1');
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}