import { NextRequest, NextResponse } from 'next/server';
import { getUserFromCookies } from '@/lib/auth';
import { query } from '@/lib/db';

interface Params {
  id: string;
}

// Mark notification as read
export async function PATCH(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const user = await getUserFromCookies(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const notificationId = params.id;
    const body = await request.json();
    const { is_read } = body;

    // Update notification
    const result = await query(`
      UPDATE in_app_notifications 
      SET is_read = ?, read_at = CASE WHEN ? = 1 THEN NOW() ELSE NULL END
      WHERE id = ? AND user_id = ?
    `, [is_read, is_read, notificationId, user.id]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Notification not found' }, 
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Notification updated successfully'
    });

  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json(
      { error: 'Failed to update notification' }, 
      { status: 500 }
    );
  }
}

// Delete notification
export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const user = await getUserFromCookies(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const notificationId = params.id;

    // Delete notification (only user's own notifications)
    const result = await query(`
      DELETE FROM in_app_notifications 
      WHERE id = ? AND user_id = ?
    `, [notificationId, user.id]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Notification not found' }, 
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Notification deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json(
      { error: 'Failed to delete notification' }, 
      { status: 500 }
    );
  }
}