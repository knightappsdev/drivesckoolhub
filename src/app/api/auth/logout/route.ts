import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookies, authenticateRequest } from '@/lib/auth';
import { auditUserAction } from '@/lib/audit';

export async function POST(request: NextRequest) {
  try {
    // Get current user for audit logging
    const user = await authenticateRequest();
    
    // Clear authentication cookies
    await clearAuthCookies();

    // Audit logout action
    if (user) {
      await auditUserAction(
        user,
        'LOGOUT',
        'users',
        user.id,
        undefined,
        {
          email: user.email,
          role: user.role,
          logout_time: new Date().toISOString()
        },
        request
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Logout successful',
    });

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}