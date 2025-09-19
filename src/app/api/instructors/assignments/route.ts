import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticateRequest, requirePermission } from '@/lib/auth';
import { assignInstructorToStudent } from '@/lib/database';

const assignmentSchema = z.object({
  student_id: z.number().int().positive(),
  instructor_id: z.number().int().positive(),
  reason: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await authenticateRequest();
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    requirePermission(user.role, 'assignments:create');

    const body = await request.json();
    
    // Validate request data
    const validationResult = assignmentSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const { student_id, instructor_id } = validationResult.data;

    // Assign instructor to student
    const success = await assignInstructorToStudent(
      student_id, 
      instructor_id, 
      user.id
    );

    if (!success) {
      return NextResponse.json(
        { error: 'Assignment failed' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Instructor assigned successfully',
    }, { status: 201 });

  } catch (error) {
    console.error('Assign instructor error:', error);
    
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