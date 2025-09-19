import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticateRequest, requirePermission } from '@/lib/auth';
import { executeQuery } from '@/lib/database';

const leadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(1, 'Phone is required'),
  driving_level: z.enum(['absolute_beginner', 'beginner', 'intermediate', 'advanced']),
  course_interest: z.string().optional(),
  preferred_instructor: z.string().optional(),
  location: z.string().optional(),
  message: z.string().optional(),
  source: z.enum(['landing_page', 'exit_intent', 'whatsapp', 'referral']).default('landing_page'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = leadSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json({
        error: 'Validation failed',
        details: validationResult.error.errors
      }, { status: 400 });
    }

    const data = validationResult.data;
    
    // Create lead in database
    const query = `
      INSERT INTO leads (
        name, email, phone, driving_level, course_interest,
        preferred_instructor, location, message, source, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')
    `;

    const params = [
      data.name,
      data.email,
      data.phone,
      data.driving_level,
      data.course_interest || null,
      data.preferred_instructor || null,
      data.location || null,
      data.message || null,
      data.source,
    ];

    await executeQuery(query, params);

    // Simulate WhatsApp notification (in real implementation, integrate with WhatsApp Business API)
    const whatsappMessage = `🚗 New Lead Alert!\n\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nLevel: ${data.driving_level}\nSource: ${data.source}\n\nPlease follow up within 15 minutes!`;
    
    console.log('WhatsApp Alert:', whatsappMessage);

    // Simulate email notification
    const emailContent = {
      to: data.email,
      subject: 'Welcome to DriveSchool Pro!',
      message: `Hi ${data.name},\n\nThank you for your interest in our driving courses. We'll contact you within 15 minutes to discuss your learning journey.\n\nBest regards,\nDriveSchool Pro Team`
    };

    console.log('Email Alert:', emailContent);

    return NextResponse.json({
      success: true,
      message: 'Lead submitted successfully',
      data: { whatsapp_sent: true, email_sent: true }
    }, { status: 201 });

  } catch (error) {
    console.error('Create lead error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    requirePermission(user.role, 'analytics:read');

    const leads = await executeQuery(`
      SELECT * FROM leads 
      ORDER BY created_at DESC 
      LIMIT 100
    `);

    return NextResponse.json({
      success: true,
      data: leads,
    });

  } catch (error) {
    console.error('Get leads error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}