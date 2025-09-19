import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getUserByEmail } from '@/lib/database';
import { verifyPassword, generateTokens, setAuthCookies } from '@/lib/auth';
import { logLoginAttempt, auditUserAction } from '@/lib/audit';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request data
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const { email, password } = validationResult.data;

    // Extract IP and user agent for audit logging
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     request.ip || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || undefined;

    // Get user from database
    const user = await getUserByEmail(email);
    if (!user) {
      // Log failed login attempt
      await logLoginAttempt({
        email,
        ipAddress,
        userAgent,
        success: false,
        failureReason: 'User not found'
      });
      
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.is_active) {
      // Log failed login attempt
      await logLoginAttempt({
        email,
        ipAddress,
        userAgent,
        success: false,
        failureReason: 'Account deactivated'
      });
      
      return NextResponse.json(
        { error: 'Account is deactivated. Please contact support.' },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      // Log failed login attempt
      await logLoginAttempt({
        email,
        ipAddress,
        userAgent,
        success: false,
        failureReason: 'Invalid password'
      });
      
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate tokens
    const { password_hash, ...userWithoutPassword } = user;
    const tokens = generateTokens(userWithoutPassword);

    // Set cookies
    await setAuthCookies(tokens);

    // Log successful login attempt
    await logLoginAttempt({
      email,
      ipAddress,
      userAgent,
      success: true
    });

    // Audit successful login
    await auditUserAction(
      tokens.user,
      'LOGIN',
      'users',
      user.id,
      undefined,
      {
        email: user.email,
        role: user.role,
        login_time: new Date().toISOString()
      },
      request
    );

    // Update last login
    // await updateUserLastLogin(user.id);

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: tokens.user,
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}