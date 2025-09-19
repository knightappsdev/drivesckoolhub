import { NextRequest, NextResponse } from 'next/server';
import { getUserFromCookies } from '@/lib/auth';
import { query } from '@/lib/db';

// Get user notification settings
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromCookies(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [settings] = await query(`
      SELECT 
        email_enabled,
        sms_enabled,
        push_enabled,
        reminder_24h,
        reminder_4h,
        reminder_1h,
        reminder_15m,
        quiet_hours_start,
        quiet_hours_end,
        timezone,
        custom_preferences
      FROM notification_settings 
      WHERE user_id = ?
    `, [user.id]);

    if (!settings) {
      // Create default settings if they don't exist
      await query(`
        INSERT INTO notification_settings (user_id, email_enabled, push_enabled, reminder_24h, reminder_1h)
        VALUES (?, TRUE, TRUE, TRUE, TRUE)
      `, [user.id]);

      return NextResponse.json({
        email_enabled: true,
        sms_enabled: false,
        push_enabled: true,
        reminder_24h: true,
        reminder_4h: false,
        reminder_1h: true,
        reminder_15m: false,
        quiet_hours_start: '22:00:00',
        quiet_hours_end: '08:00:00',
        timezone: 'UTC',
        custom_preferences: {}
      });
    }

    return NextResponse.json({
      ...settings,
      custom_preferences: settings.custom_preferences ? JSON.parse(settings.custom_preferences) : {}
    });

  } catch (error) {
    console.error('Error fetching notification settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notification settings' }, 
      { status: 500 }
    );
  }
}

// Update user notification settings
export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromCookies(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      email_enabled,
      sms_enabled,
      push_enabled,
      reminder_24h,
      reminder_4h,
      reminder_1h,
      reminder_15m,
      quiet_hours_start,
      quiet_hours_end,
      timezone,
      custom_preferences
    } = body;

    // Update settings
    await query(`
      INSERT INTO notification_settings 
      (user_id, email_enabled, sms_enabled, push_enabled, reminder_24h, reminder_4h, 
       reminder_1h, reminder_15m, quiet_hours_start, quiet_hours_end, timezone, custom_preferences)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        email_enabled = VALUES(email_enabled),
        sms_enabled = VALUES(sms_enabled),
        push_enabled = VALUES(push_enabled),
        reminder_24h = VALUES(reminder_24h),
        reminder_4h = VALUES(reminder_4h),
        reminder_1h = VALUES(reminder_1h),
        reminder_15m = VALUES(reminder_15m),
        quiet_hours_start = VALUES(quiet_hours_start),
        quiet_hours_end = VALUES(quiet_hours_end),
        timezone = VALUES(timezone),
        custom_preferences = VALUES(custom_preferences),
        updated_at = NOW()
    `, [
      user.id,
      email_enabled,
      sms_enabled,
      push_enabled,
      reminder_24h,
      reminder_4h,
      reminder_1h,
      reminder_15m,
      quiet_hours_start,
      quiet_hours_end,
      timezone,
      custom_preferences ? JSON.stringify(custom_preferences) : null
    ]);

    return NextResponse.json({
      message: 'Notification settings updated successfully'
    });

  } catch (error) {
    console.error('Error updating notification settings:', error);
    return NextResponse.json(
      { error: 'Failed to update notification settings' }, 
      { status: 500 }
    );
  }
}