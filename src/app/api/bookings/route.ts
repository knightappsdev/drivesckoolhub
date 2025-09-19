import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticateRequest, requirePermission } from '@/lib/auth';
import { executeQuery, executeQuerySingle } from '@/lib/database';

const createBookingSchema = z.object({
  student_id: z.number().int().positive(),
  instructor_id: z.number().int().positive(),
  course_id: z.number().int().positive(),
  booking_date: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  duration: z.number().positive(),
  location: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    requirePermission(user.role, 'bookings:read');

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = `
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
    `;

    // Filter by user role
    if (user.role === 'student') {
      query += ` WHERE s.user_id = ${user.id}`;
    } else if (user.role === 'instructor') {
      query += ` WHERE i.user_id = ${user.id}`;
    }

    query += ` ORDER BY b.booking_date DESC, b.start_time DESC LIMIT ${limit} OFFSET ${offset}`;

    const bookings = await executeQuery(query);

    return NextResponse.json({
      success: true,
      data: bookings,
    });

  } catch (error) {
    console.error('Get bookings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await authenticateRequest();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    requirePermission(user.role, 'bookings:create');

    const body = await request.json();
    const validationResult = createBookingSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json({
        error: 'Validation failed',
        details: validationResult.error.errors
      }, { status: 400 });
    }

    const data = validationResult.data;
    
    const query = `
      INSERT INTO bookings (
        student_id, instructor_id, course_id, booking_date,
        start_time, end_time, duration, location, notes, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      data.student_id,
      data.instructor_id,
      data.course_id,
      data.booking_date,
      data.start_time,
      data.end_time,
      data.duration,
      data.location || null,
      data.notes || null,
      user.id,
    ];

    const result = await executeQuerySingle(`${query.replace('INSERT', 'INSERT')} RETURNING LAST_INSERT_ID() as id`);
    
    return NextResponse.json({
      success: true,
      message: 'Booking created successfully',
      data: { id: result?.id }
    }, { status: 201 });

  } catch (error) {
    console.error('Create booking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}