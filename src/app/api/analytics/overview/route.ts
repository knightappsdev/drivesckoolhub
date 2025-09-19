import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, hasPermission } from '@/lib/auth';
import { query } from '@/lib/database';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const user = await authenticateRequest();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check permissions
    if (!hasPermission(user.role, 'analytics:read')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // days
    const startDate = subDays(new Date(), parseInt(period));

    // Get total counts
    const totalUsers = await query(
      'SELECT COUNT(*) as count FROM users WHERE created_at >= ?',
      [startDate]
    );

    const totalBookings = await query(
      'SELECT COUNT(*) as count FROM bookings WHERE created_at >= ?',
      [startDate]
    );

    const totalRevenue = await query(
      `SELECT SUM(amount) as total FROM payments 
       WHERE status = 'completed' AND created_at >= ?`,
      [startDate]
    );

    const totalCourses = await query(
      'SELECT COUNT(*) as count FROM courses WHERE is_active = 1'
    );

    // Get active instructors
    const activeInstructors = await query(
      `SELECT COUNT(DISTINCT u.id) as count FROM users u
       JOIN bookings b ON u.id = b.instructor_id 
       WHERE u.role = 'instructor' AND b.created_at >= ?`,
      [startDate]
    );

    // Get booking status distribution
    const bookingStats = await query(
      `SELECT status, COUNT(*) as count FROM bookings 
       WHERE created_at >= ? GROUP BY status`,
      [startDate]
    );

    // Get daily revenue for the period
    const dailyRevenue = await query(
      `SELECT DATE(created_at) as date, SUM(amount) as revenue
       FROM payments 
       WHERE status = 'completed' AND created_at >= ?
       GROUP BY DATE(created_at)
       ORDER BY date ASC`,
      [startDate]
    );

    // Get new users per day
    const dailyUsers = await query(
      `SELECT DATE(created_at) as date, COUNT(*) as users
       FROM users 
       WHERE created_at >= ?
       GROUP BY DATE(created_at)
       ORDER BY date ASC`,
      [startDate]
    );

    // Get bookings by course type
    const courseBookings = await query(
      `SELECT c.name, c.type, COUNT(b.id) as bookings, SUM(p.amount) as revenue
       FROM courses c
       LEFT JOIN bookings b ON c.id = b.course_id AND b.created_at >= ?
       LEFT JOIN payments p ON b.payment_id = p.id AND p.status = 'completed'
       WHERE c.is_active = 1
       GROUP BY c.id, c.name, c.type
       ORDER BY bookings DESC`,
      [startDate]
    );

    // Get top performing instructors
    const topInstructors = await query(
      `SELECT u.first_name, u.last_name, u.email,
              COUNT(b.id) as total_bookings,
              SUM(CASE WHEN b.status = 'completed' THEN 1 ELSE 0 END) as completed_bookings,
              AVG(CASE WHEN b.status = 'completed' THEN 5 ELSE NULL END) as avg_rating
       FROM users u
       LEFT JOIN bookings b ON u.id = b.instructor_id AND b.created_at >= ?
       WHERE u.role = 'instructor' AND u.is_active = 1
       GROUP BY u.id
       HAVING total_bookings > 0
       ORDER BY completed_bookings DESC
       LIMIT 10`,
      [startDate]
    );

    const overview = {
      summary: {
        totalUsers: totalUsers[0]?.count || 0,
        totalBookings: totalBookings[0]?.count || 0,
        totalRevenue: totalRevenue[0]?.total || 0,
        totalCourses: totalCourses[0]?.count || 0,
        activeInstructors: activeInstructors[0]?.count || 0
      },
      charts: {
        bookingStats: bookingStats.map((stat: any) => ({
          status: stat.status,
          count: stat.count,
          percentage: 0 // Will be calculated on frontend
        })),
        dailyRevenue: dailyRevenue.map((day: any) => ({
          date: format(new Date(day.date), 'MMM dd'),
          revenue: parseFloat(day.revenue) || 0
        })),
        dailyUsers: dailyUsers.map((day: any) => ({
          date: format(new Date(day.date), 'MMM dd'),
          users: day.users
        })),
        coursePerformance: courseBookings.map((course: any) => ({
          name: course.name,
          type: course.type,
          bookings: course.bookings || 0,
          revenue: parseFloat(course.revenue) || 0
        })),
        topInstructors: topInstructors.map((instructor: any) => ({
          name: `${instructor.first_name} ${instructor.last_name}`,
          email: instructor.email,
          totalBookings: instructor.total_bookings,
          completedBookings: instructor.completed_bookings,
          completionRate: instructor.total_bookings > 0 
            ? Math.round((instructor.completed_bookings / instructor.total_bookings) * 100) 
            : 0,
          avgRating: parseFloat(instructor.avg_rating) || 0
        }))
      }
    };

    return NextResponse.json({
      success: true,
      data: overview,
      period: parseInt(period)
    });

  } catch (error) {
    console.error('Analytics overview error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}