import { NextRequest, NextResponse } from 'next/server';
import { getUserFromCookies } from '@/lib/auth';
import { query } from '@/lib/db';

// Mark all notifications as read
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromCookies(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Mark all unread notifications as read
    const result = await query(`
      UPDATE in_app_notifications 
      SET is_read = TRUE, read_at = NOW()
      WHERE user_id = ? AND is_read = FALSE
    `, [user.id]);

    return NextResponse.json({
      message: 'All notifications marked as read',
      updated_count: result.affectedRows
    });

  } catch (error) {
    console.error('Error marking notifications as read:', error);
    return NextResponse.json(
      { error: 'Failed to mark notifications as read' }, 
      { status: 500 }
    );
  }
}