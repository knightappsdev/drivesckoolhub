import { NextRequest, NextResponse } from 'next/server';
import { executeQuery as query } from '@/lib/database';

// GET /api/courses - Fetch all active courses
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level');
    const recommended = searchParams.get('recommended');

    let sql = `
      SELECT 
        id,
        title,
        description,
        level,
        total_hours,
        price,
        features,
        icon,
        color,
        recommended,
        display_order,
        created_at,
        updated_at
      FROM updateddsv_courses 
      WHERE is_active = TRUE
    `;
    
    const params: any[] = [];

    // Add filters
    if (level) {
      sql += ' AND level = ?';
      params.push(level);
    }

    if (recommended === 'true') {
      sql += ' AND recommended = TRUE';
    }

    sql += ' ORDER BY display_order ASC, created_at ASC';

    const courses = await query(sql, params);

    // Parse JSON fields for each course
    const processedCourses = courses.map((course: any) => ({
      ...course,
      features: typeof course.features === 'string' ? JSON.parse(course.features) : course.features,
      recommended: Boolean(course.recommended)
    }));

    return NextResponse.json({
      success: true,
      courses: processedCourses
    });

  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

// POST /api/courses - Create a new course (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      id,
      title, 
      description, 
      level, 
      totalHours, 
      price, 
      features,
      icon,
      color,
      recommended,
      displayOrder
    } = body;

    // Validation
    if (!id || !title || !description || !level || !totalHours || !price || !features) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!['absolute-beginner', 'beginner', 'intermediate', 'advanced'].includes(level)) {
      return NextResponse.json(
        { success: false, error: 'Invalid course level' },
        { status: 400 }
      );
    }

    if (price < 0 || totalHours < 0) {
      return NextResponse.json(
        { success: false, error: 'Price and hours must be positive numbers' },
        { status: 400 }
      );
    }

    // Insert the course
    const sql = `
      INSERT INTO updateddsv_courses (
        id, title, description, level, total_hours, price, 
        features, icon, color, recommended, display_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await query(sql, [
      id,
      title,
      description,
      level,
      totalHours,
      price,
      JSON.stringify(features),
      icon || null,
      color || 'blue',
      recommended || false,
      displayOrder || 0
    ]);

    return NextResponse.json({
      success: true,
      message: 'Course created successfully',
      courseId: id
    });

  } catch (error) {
    console.error('Error creating course:', error);
    
    // Handle duplicate key error
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { success: false, error: 'Course ID already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create course' },
      { status: 500 }
    );
  }
}