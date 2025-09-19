import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, hasPermission } from '@/lib/auth';
import { 
  createTimeSlots, 
  getInstructorAvailability, 
  updateInstructorAvailability,
  TimeSlot 
} from '@/lib/calendar';
import { z } from 'zod';

const createAvailabilitySchema = z.object({
  instructor_id: z.number(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  start_time: z.string().regex(/^\d{2}:\d{2}$/),
  end_time: z.string().regex(/^\d{2}:\d{2}$/),
  is_available: z.boolean(),
  is_recurring: z.boolean().optional(),
  recurrence_pattern: z.enum(['daily', 'weekly', 'monthly']).optional(),
  recurrence_end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

const updateAvailabilitySchema = z.object({
  instructor_id: z.number(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  start_time: z.string().regex(/^\d{2}:\d{2}$/),
  end_time: z.string().regex(/^\d{2}:\d{2}$/),
  is_available: z.boolean(),
});

// GET - Retrieve instructor availability
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

    // Check permissions - users can view their own availability, admins can view all
    if (user.role === 'instructor' && user.id !== instructorId) {
      return NextResponse.json(
        { error: 'Cannot view other instructor availability' },
        { status: 403 }
      );
    }

    if (user.role === 'student') {
      return NextResponse.json(
        { error: 'Students cannot view instructor availability directly' },
        { status: 403 }
      );
    }

    const availability = await getInstructorAvailability(instructorId, startDate, endDate);

    return NextResponse.json({
      success: true,
      data: availability
    });

  } catch (error) {
    console.error('Get availability error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new availability slots
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
    
    // Validate if it's an array of slots or single slot
    const isArray = Array.isArray(body);
    const slotsData = isArray ? body : [body];

    // Validate each slot
    const validatedSlots: TimeSlot[] = [];
    for (const slotData of slotsData) {
      const validation = createAvailabilitySchema.safeParse(slotData);
      if (!validation.success) {
        return NextResponse.json(
          { 
            error: 'Validation failed', 
            details: validation.error.errors 
          },
          { status: 400 }
        );
      }

      // Check permissions - instructors can only create their own availability
      if (user.role === 'instructor' && user.id !== validation.data.instructor_id) {
        return NextResponse.json(
          { error: 'Cannot create availability for other instructors' },
          { status: 403 }
        );
      }

      if (!hasPermission(user.role, 'bookings:create') && user.role !== 'instructor') {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        );
      }

      validatedSlots.push(validation.data);
    }

    await createTimeSlots(validatedSlots);

    return NextResponse.json({
      success: true,
      message: `Successfully created ${validatedSlots.length} availability slot(s)`
    });

  } catch (error) {
    console.error('Create availability error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update availability slot
export async function PUT(request: NextRequest) {
  try {
    const user = await authenticateRequest();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = updateAvailabilitySchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validation.error.errors 
        },
        { status: 400 }
      );
    }

    const { instructor_id, date, start_time, end_time, is_available } = validation.data;

    // Check permissions
    if (user.role === 'instructor' && user.id !== instructor_id) {
      return NextResponse.json(
        { error: 'Cannot update other instructor availability' },
        { status: 403 }
      );
    }

    if (!hasPermission(user.role, 'bookings:update') && user.role !== 'instructor') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    await updateInstructorAvailability(instructor_id, date, start_time, end_time, is_available);

    return NextResponse.json({
      success: true,
      message: 'Availability updated successfully'
    });

  } catch (error) {
    console.error('Update availability error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}