import { NextRequest, NextResponse } from 'next/server';
import { processScheduledReminders } from '@/lib/booking-notifications';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const expectedAuth = `Bearer ${process.env.CRON_SECRET || 'your-secret-key'}`;
    
    if (authHeader !== expectedAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await processScheduledReminders();

    return NextResponse.json({
      message: 'Reminders processed successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error processing reminders:', error);
    return NextResponse.json({ error: 'Failed to process reminders' }, { status: 500 });
  }
}