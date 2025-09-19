import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, hasPermission } from '@/lib/auth';
import { getInstructorSchedule, checkScheduleConflicts } from '@/lib/calendar';

// GET - Retrieve instructor schedule
export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const instructorId = parseInt(searchParams.get('instructor_id') || '0');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    if (!instructorId || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'instructor_id, start_date, and end_date are required' },
        { status: 400 }
      );
    }

    // Check permissions
    if (user.role === 'instructor' && user.id !== instructorId) {
      return NextResponse.json(
        { error: 'Cannot view other instructor schedules' },
        { status: 403 }
      );
    }

    if (user.role === 'student') {
      return NextResponse.json(
        { error: 'Students cannot view full instructor schedules' },
        { status: 403 }
      );
    }

    const schedule = await getInstructorSchedule(instructorId, startDate, endDate);

    return NextResponse.json({
      success: true,
      data: schedule
    });

  } catch (error) {
    console.error('Get schedule error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Check for schedule conflicts
export async function POST(request: NextRequest) {
  try {
    const user = await authenticateRequest();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { instructor_id, date, start_time, end_time, exclude_booking_id } = body;

    if (!instructor_id || !date || !start_time || !end_time) {
      return NextResponse.json(
        { error: 'instructor_id, date, start_time, and end_time are required' },
        { status: 400 }
      );
    }

    // Check permissions
    if (!hasPermission(user.role, 'bookings:read')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const conflicts = await checkScheduleConflicts(
      instructor_id,
      date,
      start_time,
      end_time,
      exclude_booking_id
    );

    return NextResponse.json({
      success: true,
      data: {
        has_conflicts: conflicts.length > 0,
        conflicts
      }
    });

  } catch (error) {
    console.error('Check conflicts error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}