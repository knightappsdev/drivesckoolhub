import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'driveschool-pro-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'driveschool-pro-refresh-secret';

export interface User {
  id: number;
  email: string;
  role: 'super_admin' | 'admin' | 'instructor' | 'student';
  first_name: string;
  last_name: string;
  phone?: string;
  avatar_url?: string;
  is_active: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Generate JWT tokens
export function generateTokens(user: User): AuthTokens {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });

  return {
    accessToken,
    refreshToken,
    user,
  };
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

// Verify refresh token
export function verifyRefreshToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

// Set authentication cookies
export async function setAuthCookies(tokens: AuthTokens): Promise<void> {
  const cookieStore = await cookies();
  
  cookieStore.set('access_token', tokens.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60, // 15 minutes
    path: '/',
  });

  cookieStore.set('refresh_token', tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });

  cookieStore.set('user_data', JSON.stringify(tokens.user), {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });
}

// Clear authentication cookies
export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();
  
  cookieStore.delete('access_token');
  cookieStore.delete('refresh_token');
  cookieStore.delete('user_data');
}

// Get user from cookies
export async function getUserFromCookies(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('user_data');
    
    if (!userCookie?.value) {
      return null;
    }

    return JSON.parse(userCookie.value) as User;
  } catch (error) {
    return null;
  }
}

// Get token from cookies
export async function getTokenFromCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get('access_token');
  return tokenCookie?.value || null;
}

// Role-based access control
export const ROLE_PERMISSIONS = {
  super_admin: [
    'users:read', 'users:create', 'users:update', 'users:delete',
    'instructors:read', 'instructors:create', 'instructors:update', 'instructors:delete',
    'students:read', 'students:create', 'students:update', 'students:delete',
    'bookings:read', 'bookings:create', 'bookings:update', 'bookings:delete',
    'payments:read', 'payments:create', 'payments:update', 'payments:delete',
    'courses:read', 'courses:create', 'courses:update', 'courses:delete',
    'messages:read', 'messages:create', 'messages:update', 'messages:delete',
    'assignments:read', 'assignments:create', 'assignments:update', 'assignments:delete',
    'analytics:read', 'system:configure', 'audit:read', 'layout:manage'
  ],
  admin: [
    'instructors:read', 'instructors:create', 'instructors:update',
    'students:read', 'students:create', 'students:update',
    'bookings:read', 'bookings:create', 'bookings:update', 'bookings:delete',
    'payments:read', 'payments:create', 'payments:update',
    'courses:read', 'courses:create', 'courses:update',
    'messages:read', 'messages:create',
    'assignments:read', 'assignments:create', 'assignments:update',
    'analytics:read'
  ],
  instructor: [
    'students:read',
    'bookings:read', 'bookings:update',
    'lessons:read', 'lessons:create', 'lessons:update',
    'messages:read', 'messages:create',
    'profile:update'
  ],
  student: [
    'bookings:read', 'bookings:create',
    'lessons:read',
    'payments:read',
    'messages:read', 'messages:create',
    'profile:update'
  ]
};

export function hasPermission(userRole: string, permission: string): boolean {
  const rolePermissions = ROLE_PERMISSIONS[userRole as keyof typeof ROLE_PERMISSIONS];
  return rolePermissions?.includes(permission) || false;
}

export function requirePermission(userRole: string, permission: string): void {
  if (!hasPermission(userRole, permission)) {
    throw new Error(`Insufficient permissions. Required: ${permission}`);
  }
}

// Authentication middleware
export async function authenticateRequest(): Promise<User | null> {
  try {
    const token = await getTokenFromCookies();
    
    if (!token) {
      return null;
    }

    const payload = verifyToken(token);
    
    if (!payload) {
      return null;
    }

    // Get user data from cookies
    return await getUserFromCookies();
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

// Role checking utilities
export function isAdmin(user: User): boolean {
  return ['super_admin', 'admin'].includes(user.role);
}

export function isSuperAdmin(user: User): boolean {
  return user.role === 'super_admin';
}

export function isInstructor(user: User): boolean {
  return user.role === 'instructor';
}

export function isStudent(user: User): boolean {
  return user.role === 'student';
}

export function canAccessAdminPanel(user: User): boolean {
  return ['super_admin', 'admin'].includes(user.role);
}

export function canManageUsers(user: User): boolean {
  return user.role === 'super_admin';
}

export function canAssignInstructors(user: User): boolean {
  return ['super_admin', 'admin'].includes(user.role);
}

export function canViewAnalytics(user: User): boolean {
  return ['super_admin', 'admin'].includes(user.role);
}