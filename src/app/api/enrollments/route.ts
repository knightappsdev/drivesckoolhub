import { NextRequest, NextResponse } from 'next/server';
import { executeQuery as query } from '@/lib/database';

// GET /api/enrollments - Fetch course enrollments (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const courseId = searchParams.get('courseId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let sql = `
      SELECT 
        e.*,
        c.title as course_title,
        c.price as course_price,
        i.instructor_name as instructor_name
      FROM course_enrollments e
      LEFT JOIN updateddsv_courses c ON e.course_id = c.id
      LEFT JOIN instructors i ON e.preferred_instructor_id = i.id
      WHERE 1=1
    `;
    
    const params: any[] = [];

    // Add filters
    if (status) {
      sql += ' AND e.status = ?';
      params.push(status);
    }

    if (courseId) {
      sql += ' AND e.course_id = ?';
      params.push(courseId);
    }

    sql += ' ORDER BY e.enrollment_date DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const enrollments = await query(sql, params);

    // Get total count for pagination
    let countSql = 'SELECT COUNT(*) as total FROM course_enrollments WHERE 1=1';
    const countParams: any[] = [];

    if (status) {
      countSql += ' AND status = ?';
      countParams.push(status);
    }

    if (courseId) {
      countSql += ' AND course_id = ?';
      countParams.push(courseId);
    }

    const countResult = await query(countSql, countParams);
    const total = countResult[0]?.total || 0;

    return NextResponse.json({
      success: true,
      enrollments,
      total,
      pagination: {
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch enrollments' },
      { status: 500 }
    );
  }
}

// POST /api/enrollments - Submit a new course enrollment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      courseId,
      studentName, 
      studentEmail, 
      studentPhone,
      preferredInstructorId,
      totalAmount,
      notes,
      preferredSchedule,
      transmissionPreference,
      pickupLocation,
      emergencyContactName,
      emergencyContactPhone
    } = body;

    // Validation
    if (!courseId || !studentName || !studentEmail) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: courseId, studentName, studentEmail' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(studentEmail)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if course exists
    const courseCheck = await query('SELECT id, price FROM updateddsv_courses WHERE id = ? AND is_active = TRUE', [courseId]);
    if (courseCheck.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Course not found or inactive' },
        { status: 404 }
      );
    }

    const coursePrice = courseCheck[0].price;
    const enrollmentAmount = totalAmount || coursePrice;

    // Insert the enrollment
    const sql = `
      INSERT INTO course_enrollments (
        course_id,
        student_name,
        student_email,
        student_phone,
        preferred_instructor_id,
        total_amount,
        notes,
        preferred_schedule,
        transmission_preference,
        pickup_location,
        emergency_contact_name,
        emergency_contact_phone
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await query(sql, [
      courseId,
      studentName,
      studentEmail,
      studentPhone || null,
      preferredInstructorId || null,
      enrollmentAmount,
      notes || null,
      preferredSchedule || null,
      transmissionPreference || 'both',
      pickupLocation || null,
      emergencyContactName || null,
      emergencyContactPhone || null
    ]);

    // Also create a lead for follow-up using existing table structure
    const leadSql = `
      INSERT INTO leads (
        name,
        email,
        phone,
        course_interest,
        location,
        message,
        source,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await query(leadSql, [
      studentName,
      studentEmail,
      studentPhone || '',
      courseId,
      pickupLocation || null,
      `Course enrollment: ${courseId}. Notes: ${notes || 'None'}`,
      'landing_page',
      'new'
    ]);

    return NextResponse.json({
      success: true,
      message: 'Enrollment submitted successfully',
      enrollmentId: result.insertId,
      nextSteps: 'You will receive a confirmation email shortly with payment instructions and next steps.'
    });

  } catch (error) {
    console.error('Error submitting enrollment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit enrollment' },
      { status: 500 }
    );
  }
}

// PUT /api/enrollments - Update enrollment status (admin only)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { enrollmentId, status, paymentStatus, notes } = body;

    if (!enrollmentId) {
      return NextResponse.json(
        { success: false, error: 'Missing enrollment ID' },
        { status: 400 }
      );
    }

    const validStatuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];
    const validPaymentStatuses = ['pending', 'paid', 'partial', 'refunded'];

    let updateFields: string[] = [];
    let updateValues: any[] = [];

    if (status && validStatuses.includes(status)) {
      updateFields.push('status = ?');
      updateValues.push(status);
    }

    if (paymentStatus && validPaymentStatuses.includes(paymentStatus)) {
      updateFields.push('payment_status = ?');
      updateValues.push(paymentStatus);
    }

    if (notes !== undefined) {
      updateFields.push('notes = ?');
      updateValues.push(notes);
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateValues.push(enrollmentId);

    const sql = `UPDATE course_enrollments SET ${updateFields.join(', ')} WHERE id = ?`;

    const result = await query(sql, updateValues);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Enrollment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Enrollment updated successfully'
    });

  } catch (error) {
    console.error('Error updating enrollment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update enrollment' },
      { status: 500 }
    );
  }
}