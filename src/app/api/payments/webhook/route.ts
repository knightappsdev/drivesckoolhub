import { NextRequest, NextResponse } from 'next/server';
import { constructWebhookEvent, PAYMENT_STATUS } from '@/lib/stripe';
import { executeQuery } from '@/lib/database';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'No signature provided' }, { status: 400 });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    // Construct the event
    const event = constructWebhookEvent(body, signature, webhookSecret);

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      
      case 'payment_intent.canceled':
        await handlePaymentIntentCanceled(event.data.object as Stripe.PaymentIntent);
        break;
      
      case 'charge.dispute.created':
        await handleChargeDispute(event.data.object as Stripe.Dispute);
        break;
      
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ 
      error: 'Webhook handler failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 400 });
  }
}

// Handle successful payment
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Update payment status in database
    await executeQuery(
      `UPDATE payments 
       SET payment_status = ?, 
           payment_date = NOW(),
           stripe_charge_id = ?,
           updated_at = NOW()
       WHERE stripe_payment_intent_id = ?`,
      [PAYMENT_STATUS.COMPLETED, paymentIntent.latest_charge, paymentIntent.id]
    );

    // Get payment details
    const [payment] = await executeQuery(
      `SELECT * FROM payments WHERE stripe_payment_intent_id = ?`,
      [paymentIntent.id]
    );

    if (payment && payment.metadata) {
      const metadata = JSON.parse(payment.metadata);
      
      // Auto-create course booking if this was a course payment
      if (metadata.courseType) {
        await createCourseBooking(payment, metadata);
      }
      
      // Send confirmation email (you can implement this)
      // await sendPaymentConfirmationEmail(payment);
      
      // Log audit trail
      await executeQuery(
        `INSERT INTO audit_logs (user_id, action, table_name, record_id, new_values, created_at)
         VALUES (?, 'payment_completed', 'payments', ?, ?, NOW())`,
        [payment.user_id, payment.id, JSON.stringify({ paymentIntentId: paymentIntent.id })]
      );
    }

    console.log(`Payment succeeded: ${paymentIntent.id}`);
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

// Handle failed payment
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    await executeQuery(
      `UPDATE payments 
       SET payment_status = ?, 
           failure_reason = ?,
           updated_at = NOW()
       WHERE stripe_payment_intent_id = ?`,
      [PAYMENT_STATUS.FAILED, paymentIntent.last_payment_error?.message || 'Payment failed', paymentIntent.id]
    );

    console.log(`Payment failed: ${paymentIntent.id}`);
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

// Handle canceled payment
async function handlePaymentIntentCanceled(paymentIntent: Stripe.PaymentIntent) {
  try {
    await executeQuery(
      `UPDATE payments 
       SET payment_status = ?, 
           updated_at = NOW()
       WHERE stripe_payment_intent_id = ?`,
      [PAYMENT_STATUS.CANCELLED, paymentIntent.id]
    );

    console.log(`Payment canceled: ${paymentIntent.id}`);
  } catch (error) {
    console.error('Error handling payment cancellation:', error);
  }
}

// Handle charge disputes
async function handleChargeDispute(dispute: Stripe.Dispute) {
  try {
    // Find the payment by charge ID
    await executeQuery(
      `UPDATE payments 
       SET payment_status = ?, 
           failure_reason = ?,
           updated_at = NOW()
       WHERE stripe_charge_id = ?`,
      [PAYMENT_STATUS.FAILED, `Disputed: ${dispute.reason}`, dispute.charge]
    );

    console.log(`Charge disputed: ${dispute.id}`);
  } catch (error) {
    console.error('Error handling charge dispute:', error);
  }
}

// Handle successful invoice payment (for subscriptions)
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    console.log(`Invoice payment succeeded: ${invoice.id}`);
    // Handle subscription payments if needed
  } catch (error) {
    console.error('Error handling invoice payment success:', error);
  }
}

// Handle failed invoice payment
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  try {
    console.log(`Invoice payment failed: ${invoice.id}`);
    // Handle failed subscription payments if needed
  } catch (error) {
    console.error('Error handling invoice payment failure:', error);
  }
}

// Helper function to create course booking after successful payment
async function createCourseBooking(payment: any, metadata: any) {
  try {
    // Create a course entry if it doesn't exist
    let courseId = await findOrCreateCourse(metadata.courseType, metadata);
    
    // Create booking entry
    await executeQuery(
      `INSERT INTO bookings (
        student_id, instructor_id, course_id, 
        booking_date, start_time, end_time,
        status, payment_id, notes, created_at
      ) VALUES (?, ?, ?, CURDATE(), '09:00:00', '10:00:00', 'confirmed', ?, ?, NOW())`,
      [
        payment.user_id,
        payment.instructor_id,
        courseId,
        payment.id,
        `Auto-booked after payment for ${metadata.courseName}`,
      ]
    );

    console.log(`Course booking created for payment: ${payment.id}`);
  } catch (error) {
    console.error('Error creating course booking:', error);
  }
}

// Helper function to find or create course
async function findOrCreateCourse(courseType: string, metadata: any): Promise<number> {
  try {
    // Try to find existing course
    const [existingCourse] = await executeQuery(
      `SELECT id FROM courses WHERE name = ? AND course_type = ?`,
      [metadata.courseName, courseType]
    );

    if (existingCourse) {
      return existingCourse.id;
    }

    // Create new course
    const result = await executeQuery(
      `INSERT INTO courses (
        name, description, course_type, duration_hours,
        total_lessons, price, is_active, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, TRUE, NOW())`,
      [
        metadata.courseName,
        `${metadata.courseName} - ${metadata.hours} hours of professional driving instruction`,
        courseType,
        metadata.hours,
        metadata.lessons,
        metadata.price || 0,
      ]
    );

    return result.insertId;
  } catch (error) {
    console.error('Error finding/creating course:', error);
    return 1; // Fallback to course ID 1
  }
}