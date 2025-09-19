import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, hasPermission } from '@/lib/auth';
import { autoScheduleLesson, getSchedulingInsights, AutoScheduleRequest } from '@/lib/calendar';
import { z } from 'zod';

const autoScheduleSchema = z.object({
  course_id: z.number(),
  instructor_id: z.number().optional(),
  student_id: z.number(),
  preferred_dates: z.array(z.string()).optional(),
  preferred_times: z.array(z.string()).optional(),
  duration_minutes: z.number().positive(),
  earliest_date: z.string().optional(),
  latest_date: z.string().optional(),
  avoid_weekends: z.boolean().optional(),
});

// POST - Get auto-scheduling suggestions
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
    const validation = autoScheduleSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validation.error.errors 
        },
        { status: 400 }
      );
    }

    const requestData: AutoScheduleRequest = validation.data;

    // Check permissions - students can only schedule for themselves
    if (user.role === 'student' && user.id !== requestData.student_id) {
      return NextResponse.json(
        { error: 'Cannot schedule lessons for other students' },
        { status: 403 }
      );
    }

    if (!hasPermission(user.role, 'bookings:create')) {
      return NextResponse.json(
        { error: 'Insufficient permissions to create bookings' },
        { status: 403 }
      );
    }

    const suggestions = await autoScheduleLesson(requestData);

    return NextResponse.json({
      success: true,
      data: {
        suggestions,
        total_suggestions: suggestions.length,
        best_suggestion: suggestions[0] || null
      }
    });

  } catch (error) {
    console.error('Auto-schedule error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Get scheduling insights and analytics
export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check permissions - only admins and instructors can view insights
    if (!hasPermission(user.role, 'analytics:read') && user.role !== 'instructor') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const instructorId = user.role === 'instructor' 
      ? user.id 
      : (searchParams.get('instructor_id') ? parseInt(searchParams.get('instructor_id')!) : undefined);

    const insights = await getSchedulingInsights(instructorId);

    return NextResponse.json({
      success: true,
      data: insights
    });

  } catch (error) {
    console.error('Get insights error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}