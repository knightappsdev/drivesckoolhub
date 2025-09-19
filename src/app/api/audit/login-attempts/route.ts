import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, hasPermission } from '@/lib/auth';
import { getLoginAttempts } from '@/lib/audit';

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const user = await authenticateRequest();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check permissions - only super admins can view login attempts
    if (!hasPermission(user.role, 'audit:read')) {
      return NextResponse.json(
        { error: 'Insufficient permissions. Login attempts access requires super admin role.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    
    const params = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: Math.min(parseInt(searchParams.get('limit') || '50'), 100),
      email: searchParams.get('email') || undefined,
      success: searchParams.get('success') ? searchParams.get('success') === 'true' : undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined
    };

    const result = await getLoginAttempts(params);

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Login attempts API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}