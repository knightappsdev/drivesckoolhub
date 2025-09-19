import { NextRequest, NextResponse } from 'next/server';
import { getUserFromCookies } from '@/lib/auth';
import { query } from '@/lib/db';
import { createLessonReminders, cancelBookingReminders, updateBookingReminders } from '@/lib/booking-notifications';

interface Params {
  id: string;
}

export async function GET(request: NextRequest, { params }: { params: Params }) {
  try {
    const user = await getUserFromCookies(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bookingId = params.id;
    
    const [booking] = await query(`
      SELECT 
        b.*,
        c.name as course_name,
        s.first_name as student_first_name,
        s.last_name as student_last_name,
        s.email as student_email,
        i.first_name as instructor_first_name,
        i.last_name as instructor_last_name
      FROM bookings b
      JOIN courses c ON b.course_id = c.id
      JOIN users s ON b.student_id = s.id
      JOIN users i ON b.instructor_id = i.id
      WHERE b.id = ? AND (
        b.student_id = ? OR 
        b.instructor_id = ? OR 
        ? IN ('admin', 'super_admin')
      )
    `, [bookingId, user.id, user.id, user.role]);

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ booking });

  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Params }) {
  try {
    const user = await getUserFromCookies(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bookingId = parseInt(params.id);
    const body = await request.json();
    const { status, lesson_date, lesson_time } = body;

    // Update booking
    await query(`
      UPDATE bookings 
      SET status = ?, lesson_date = ?, lesson_time = ?, updated_at = NOW()
      WHERE id = ?
    `, [status, lesson_date, lesson_time, bookingId]);

    // Handle notification logic based on status change
    if (status === 'confirmed') {
      await createLessonReminders(bookingId);
    } else if (status === 'cancelled') {
      await cancelBookingReminders(bookingId);
    } else if (lesson_date || lesson_time) {
      await updateBookingReminders(bookingId);
    }

    return NextResponse.json({ message: 'Booking updated successfully' });

  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}