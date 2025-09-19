import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, requirePermission } from '@/lib/auth';
import { getDashboardStats, getUpcomingBookings } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest();
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    requirePermission(user.role, 'analytics:read');

    const [stats, upcomingBookings] = await Promise.all([
      getDashboardStats(),
      getUpcomingBookings(10)
    ]);

    return NextResponse.json({
      success: true,
      data: {
        stats,
        upcomingBookings,
      },
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    
    if (error instanceof Error && error.message.includes('Insufficient permissions')) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}