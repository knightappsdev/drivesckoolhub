import { NextRequest, NextResponse } from 'next/server';
import { getUserFromCookies } from '@/lib/auth';
import { query } from '@/lib/db';
import { sendNotification } from '@/lib/notifications';

// Get user notifications
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromCookies(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const unreadOnly = searchParams.get('unread_only') === 'true';
    const type = searchParams.get('type');
    
    const offset = (page - 1) * limit;
    
    let whereCondition = 'user_id = ?';
    let params: any[] = [user.id];
    
    if (unreadOnly) {
      whereCondition += ' AND is_read = FALSE';
    }
    
    if (type) {
      whereCondition += ' AND type = ?';
      params.push(type);
    }
    
    // Add expiration filter
    whereCondition += ' AND (expires_at IS NULL OR expires_at > NOW())';
    
    const notifications = await query(`
      SELECT 
        id,
        title,
        message,
        type,
        priority,
        related_type,
        related_id,
        action_url,
        is_read,
        read_at,
        expires_at,
        created_at
      FROM in_app_notifications 
      WHERE ${whereCondition}
      ORDER BY 
        CASE priority 
          WHEN 'urgent' THEN 1 
          WHEN 'high' THEN 2 
          WHEN 'medium' THEN 3 
          WHEN 'low' THEN 4 
        END,
        created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, limit, offset]);
    
    // Get total count
    const [{ total }] = await query(`
      SELECT COUNT(*) as total 
      FROM in_app_notifications 
      WHERE ${whereCondition}
    `, params);
    
    // Get unread count
    const [{ unread_count }] = await query(`
      SELECT COUNT(*) as unread_count 
      FROM in_app_notifications 
      WHERE user_id = ? AND is_read = FALSE 
        AND (expires_at IS NULL OR expires_at > NOW())
    `, [user.id]);

    return NextResponse.json({
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      unread_count
    });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' }, 
      { status: 500 }
    );
  }
}

// Create notification
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromCookies(request);
    if (!user || !['admin', 'super_admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      user_id,
      user_ids, // For bulk notifications
      title,
      message,
      type = 'info',
      priority = 'medium',
      related_type,
      related_id,
      action_url,
      expires_at,
      send_email = false,
      send_sms = false,
      send_push = false
    } = body;

    if (!title || !message) {
      return NextResponse.json(
        { error: 'Title and message are required' }, 
        { status: 400 }
      );
    }

    const targetUserIds = user_ids || [user_id];
    if (!targetUserIds || targetUserIds.length === 0) {
      return NextResponse.json(
        { error: 'At least one user ID is required' }, 
        { status: 400 }
      );
    }

    const notifications = [];
    
    for (const targetUserId of targetUserIds) {
      // Create in-app notification
      const [result] = await query(`
        INSERT INTO in_app_notifications 
        (user_id, title, message, type, priority, related_type, related_id, action_url, expires_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [targetUserId, title, message, type, priority, related_type, related_id, action_url, expires_at]);

      const notificationId = result.insertId;
      notifications.push({ id: notificationId, user_id: targetUserId });

      // Send additional notification channels if requested
      if (send_email || send_sms || send_push) {
        await sendNotification({
          userId: targetUserId,
          type: 'custom',
          data: {
            title,
            message,
            action_url
          },
          channels: {
            email: send_email,
            sms: send_sms,
            push: send_push,
            in_app: false // Already created above
          }
        });
      }
    }

    return NextResponse.json({
      message: 'Notifications created successfully',
      notifications
    });

  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'Failed to create notification' }, 
      { status: 500 }
    );
  }
}