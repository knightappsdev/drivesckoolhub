import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { 
  createPaymentIntent, 
  createOrRetrieveCustomer, 
  COURSE_PRICES, 
  CourseType,
  PAYMENT_STATUS 
} from '@/lib/stripe';
import { executeQuery } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'No authorization token' }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { courseType, instructorId, metadata = {} } = body;

    // Validate course type
    if (!courseType || !COURSE_PRICES[courseType as CourseType]) {
      return NextResponse.json({ error: 'Invalid course type' }, { status: 400 });
    }

    const course = COURSE_PRICES[courseType as CourseType];

    // Create or retrieve Stripe customer
    const customer = await createOrRetrieveCustomer(
      user.email,
      `${user.first_name} ${user.last_name}`,
      {
        userId: user.userId.toString(),
        role: user.role,
      }
    );

    // Create payment intent
    const paymentIntent = await createPaymentIntent(
      course.price,
      'gbp',
      {
        courseType,
        courseName: course.name,
        userId: user.userId.toString(),
        instructorId: instructorId?.toString() || '',
        hours: course.hours.toString(),
        lessons: course.lessons.toString(),
        ...metadata,
      }
    );

    // Save payment record to database
    await executeQuery(
      `INSERT INTO payments (
        user_id, course_id, instructor_id, amount, currency,
        payment_method, payment_status, stripe_payment_intent_id,
        metadata, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        user.userId,
        null, // We'll update this when course is booked
        instructorId || null,
        course.price,
        'GBP',
        'stripe',
        PAYMENT_STATUS.PENDING,
        paymentIntent.id,
        JSON.stringify({
          courseType,
          courseName: course.name,
          hours: course.hours,
          lessons: course.lessons,
        }),
      ]
    );

    return NextResponse.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: course.price,
        currency: 'gbp',
        course: {
          type: courseType,
          name: course.name,
          price: course.price,
          hours: course.hours,
          lessons: course.lessons,
        },
        customer: {
          id: customer.id,
          email: customer.email,
        },
      },
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    return NextResponse.json({ 
      error: 'Failed to create payment intent',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}