import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, hasPermission } from '@/lib/auth';
import { getSystemEvents } from '@/lib/audit';

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

    // Check permissions - only super admins can view system events
    if (!hasPermission(user.role, 'audit:read')) {
      return NextResponse.json(
        { error: 'Insufficient permissions. System events access requires super admin role.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    
    const params = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: Math.min(parseInt(searchParams.get('limit') || '50'), 100),
      eventType: searchParams.get('eventType') || undefined,
      severity: searchParams.get('severity') as any || undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined
    };

    const result = await getSystemEvents(params);

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('System events API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}