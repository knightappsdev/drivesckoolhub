import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticateRequest, requirePermission } from '@/lib/auth';
import { getAllInstructors, createInstructor } from '@/lib/database';

const createInstructorSchema = z.object({
  user_id: z.number().int().positive(),
  instructor_code: z.string().min(1, 'Instructor code is required'),
  license_number: z.string().min(1, 'License number is required'),
  certification_level: z.enum(['beginner', 'advanced', 'expert']),
  specialties: z.array(z.string()),
  hourly_rate: z.number().min(0),
  availability_schedule: z.record(z.array(z.string())),
  bio: z.string().optional(),
  years_experience: z.number().int().min(0),
});

export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest();
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    requirePermission(user.role, 'instructors:read');

    const instructors = await getAllInstructors();

    return NextResponse.json({
      success: true,
      data: instructors,
    });

  } catch (error) {
    console.error('Get instructors error:', error);
    
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

export async function POST(request: NextRequest) {
  try {
    const user = await authenticateRequest();
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    requirePermission(user.role, 'instructors:create');

    const body = await request.json();
    
    // Validate request data
    const validationResult = createInstructorSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    // Create instructor
    const instructorId = await createInstructor(validationResult.data);

    return NextResponse.json({
      success: true,
      message: 'Instructor created successfully',
      data: { id: instructorId },
    }, { status: 201 });

  } catch (error) {
    console.error('Create instructor error:', error);
    
    if (error instanceof Error && error.message.includes('Insufficient permissions')) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      );
    }

    if (error instanceof Error && error.message.includes('Duplicate entry')) {
      return NextResponse.json(
        { error: 'Instructor code already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}