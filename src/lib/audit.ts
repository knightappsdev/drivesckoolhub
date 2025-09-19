import { executeQuery, executeQuerySingle } from './database';
import { User } from './auth';

// Audit action types
export type AuditAction = 
  | 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' 
  | 'PAYMENT_CREATED' | 'PAYMENT_COMPLETED' | 'PAYMENT_FAILED'
  | 'BOOKING_CREATED' | 'BOOKING_CANCELLED' | 'BOOKING_COMPLETED'
  | 'MESSAGE_SENT' | 'FILE_UPLOADED' | 'SETTINGS_CHANGED'
  | 'PASSWORD_CHANGED' | 'PROFILE_UPDATED' | 'ROLE_ASSIGNED';

export type SystemEventType = 
  | 'SERVER_START' | 'SERVER_ERROR' | 'DATABASE_ERROR' 
  | 'PAYMENT_WEBHOOK' | 'EMAIL_SENT' | 'EMAIL_FAILED'
  | 'BACKUP_CREATED' | 'SECURITY_ALERT';

export type EventSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface AuditLogData {
  userId?: number;
  action: AuditAction;
  tableName?: string;
  recordId?: number;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

export interface SystemEventData {
  eventType: SystemEventType;
  eventData?: Record<string, any>;
  severity?: EventSeverity;
  source?: string;
  metadata?: Record<string, any>;
}

export interface LoginAttemptData {
  email: string;
  ipAddress: string;
  userAgent?: string;
  success: boolean;
  failureReason?: string;
}

// Create audit log entry
export async function createAuditLog(data: AuditLogData): Promise<void> {
  try {
    await executeQuery(
      `INSERT INTO audit_logs 
       (user_id, action, table_name, record_id, old_values, new_values, ip_address, user_agent) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.userId || null,
        data.action,
        data.tableName || null,
        data.recordId || null,
        data.oldValues ? JSON.stringify(data.oldValues) : null,
        data.newValues ? JSON.stringify(data.newValues) : null,
        data.ipAddress || null,
        data.userAgent || null
      ]
    );
  } catch (error) {
    console.error('Failed to create audit log:', error);
    // Don't throw - audit logging should not break main functionality
  }
}

// Create system event log
export async function createSystemEvent(data: SystemEventData): Promise<void> {
  try {
    await executeQuery(
      `INSERT INTO system_events 
       (event_type, event_data, severity, source) 
       VALUES (?, ?, ?, ?)`,
      [
        data.eventType,
        data.eventData ? JSON.stringify(data.eventData) : null,
        data.severity || 'info',
        data.source || 'system'
      ]
    );
  } catch (error) {
    console.error('Failed to create system event:', error);
  }
}

// Log login attempt
export async function logLoginAttempt(data: LoginAttemptData): Promise<void> {
  try {
    await executeQuery(
      `INSERT INTO login_attempts 
       (email, ip_address, user_agent, success, failure_reason) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        data.email,
        data.ipAddress,
        data.userAgent || null,
        data.success,
        data.failureReason || null
      ]
    );

    // Update daily summary
    await updateActivitySummary(data.success);
  } catch (error) {
    console.error('Failed to log login attempt:', error);
  }
}

// Update activity summary for dashboard
async function updateActivitySummary(successfulLogin: boolean): Promise<void> {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    await executeQuery(
      `INSERT INTO activity_summaries (date, total_actions, successful_logins, failed_logins)
       VALUES (?, 1, ?, ?)
       ON DUPLICATE KEY UPDATE
       total_actions = total_actions + 1,
       successful_logins = successful_logins + ?,
       failed_logins = failed_logins + ?,
       updated_at = CURRENT_TIMESTAMP`,
      [
        today,
        successfulLogin ? 1 : 0,
        successfulLogin ? 0 : 1,
        successfulLogin ? 1 : 0,
        successfulLogin ? 0 : 1
      ]
    );
  } catch (error) {
    console.error('Failed to update activity summary:', error);
  }
}

// Get audit logs with pagination and filtering
export async function getAuditLogs(params: {
  page?: number;
  limit?: number;
  userId?: number;
  action?: string;
  startDate?: string;
  endDate?: string;
  tableName?: string;
}) {
  try {
    const {
      page = 1,
      limit = 50,
      userId,
      action,
      startDate,
      endDate,
      tableName
    } = params;

    const offset = (page - 1) * limit;
    const conditions: string[] = [];
    const values: any[] = [];

    if (userId) {
      conditions.push('al.user_id = ?');
      values.push(userId);
    }

    if (action) {
      conditions.push('al.action = ?');
      values.push(action);
    }

    if (tableName) {
      conditions.push('al.table_name = ?');
      values.push(tableName);
    }

    if (startDate) {
      conditions.push('al.created_at >= ?');
      values.push(startDate);
    }

    if (endDate) {
      conditions.push('al.created_at <= ?');
      values.push(endDate);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const logs = await executeQuery(
      `SELECT 
        al.*,
        u.first_name,
        u.last_name,
        u.email,
        u.role
       FROM audit_logs al
       LEFT JOIN users u ON al.user_id = u.id
       ${whereClause}
       ORDER BY al.created_at DESC
       LIMIT ? OFFSET ?`,
      [...values, limit, offset]
    );

    const totalResult = await executeQuery(
      `SELECT COUNT(*) as total FROM audit_logs al ${whereClause}`,
      values
    );

    return {
      logs: logs.map((log: any) => ({
        ...log,
        old_values: log.old_values ? JSON.parse(log.old_values) : null,
        new_values: log.new_values ? JSON.parse(log.new_values) : null,
        user: log.user_id ? {
          id: log.user_id,
          firstName: log.first_name,
          lastName: log.last_name,
          email: log.email,
          role: log.role
        } : null
      })),
      total: totalResult[0]?.total || 0,
      page,
      limit,
      totalPages: Math.ceil((totalResult[0]?.total || 0) / limit)
    };
  } catch (error) {
    console.error('Failed to get audit logs:', error);
    return { logs: [], total: 0, page: 1, limit: 50, totalPages: 0 };
  }
}

// Get system events
export async function getSystemEvents(params: {
  page?: number;
  limit?: number;
  eventType?: string;
  severity?: EventSeverity;
  startDate?: string;
  endDate?: string;
}) {
  try {
    const {
      page = 1,
      limit = 50,
      eventType,
      severity,
      startDate,
      endDate
    } = params;

    const offset = (page - 1) * limit;
    const conditions: string[] = [];
    const values: any[] = [];

    if (eventType) {
      conditions.push('event_type = ?');
      values.push(eventType);
    }

    if (severity) {
      conditions.push('severity = ?');
      values.push(severity);
    }

    if (startDate) {
      conditions.push('created_at >= ?');
      values.push(startDate);
    }

    if (endDate) {
      conditions.push('created_at <= ?');
      values.push(endDate);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const events = await executeQuery(
      `SELECT * FROM system_events 
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [...values, limit, offset]
    );

    const totalResult = await executeQuery(
      `SELECT COUNT(*) as total FROM system_events ${whereClause}`,
      values
    );

    return {
      events: events.map((event: any) => ({
        ...event,
        event_data: event.event_data ? JSON.parse(event.event_data) : null
      })),
      total: totalResult[0]?.total || 0,
      page,
      limit,
      totalPages: Math.ceil((totalResult[0]?.total || 0) / limit)
    };
  } catch (error) {
    console.error('Failed to get system events:', error);
    return { events: [], total: 0, page: 1, limit: 50, totalPages: 0 };
  }
}

// Get login attempts
export async function getLoginAttempts(params: {
  page?: number;
  limit?: number;
  email?: string;
  success?: boolean;
  startDate?: string;
  endDate?: string;
}) {
  try {
    const {
      page = 1,
      limit = 50,
      email,
      success,
      startDate,
      endDate
    } = params;

    const offset = (page - 1) * limit;
    const conditions: string[] = [];
    const values: any[] = [];

    if (email) {
      conditions.push('email LIKE ?');
      values.push(`%${email}%`);
    }

    if (success !== undefined) {
      conditions.push('success = ?');
      values.push(success);
    }

    if (startDate) {
      conditions.push('created_at >= ?');
      values.push(startDate);
    }

    if (endDate) {
      conditions.push('created_at <= ?');
      values.push(endDate);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const attempts = await executeQuery(
      `SELECT * FROM login_attempts 
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [...values, limit, offset]
    );

    const totalResult = await executeQuery(
      `SELECT COUNT(*) as total FROM login_attempts ${whereClause}`,
      values
    );

    return {
      attempts,
      total: totalResult[0]?.total || 0,
      page,
      limit,
      totalPages: Math.ceil((totalResult[0]?.total || 0) / limit)
    };
  } catch (error) {
    console.error('Failed to get login attempts:', error);
    return { attempts: [], total: 0, page: 1, limit: 50, totalPages: 0 };
  }
}

// Utility functions for common audit operations

export async function auditUserAction(
  user: User | null,
  action: AuditAction,
  tableName?: string,
  recordId?: number,
  oldValues?: Record<string, any>,
  newValues?: Record<string, any>,
  request?: Request
) {
  const ipAddress = request?.headers.get('x-forwarded-for') || 
                    request?.headers.get('x-real-ip') || 
                    'unknown';
  const userAgent = request?.headers.get('user-agent') || undefined;

  await createAuditLog({
    userId: user?.id,
    action,
    tableName,
    recordId,
    oldValues,
    newValues,
    ipAddress,
    userAgent
  });
}

export async function auditPaymentAction(
  user: User | null,
  action: AuditAction,
  paymentId: number,
  paymentData: Record<string, any>,
  request?: Request
) {
  await auditUserAction(
    user,
    action,
    'payments',
    paymentId,
    undefined,
    paymentData,
    request
  );
}

export async function auditBookingAction(
  user: User | null,
  action: AuditAction,
  bookingId: number,
  oldData?: Record<string, any>,
  newData?: Record<string, any>,
  request?: Request
) {
  await auditUserAction(
    user,
    action,
    'bookings',
    bookingId,
    oldData,
    newData,
    request
  );
}