import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, hasPermission } from '@/lib/auth';
import { query } from '@/lib/database';
import { format, subDays, startOfDay, endOfDay, startOfMonth, endOfMonth, subMonths } from 'date-fns';

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
    const period = searchParams.get('period') || '12'; // months

    // Get monthly revenue for the past year
    const monthlyRevenue = [];
    for (let i = parseInt(period) - 1; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const startDate = startOfMonth(date);
      const endDate = endOfMonth(date);

      const result = await query(
        `SELECT 
          COALESCE(SUM(amount), 0) as revenue,
          COUNT(*) as transactions,
          AVG(amount) as avg_transaction
         FROM payments 
         WHERE status = 'completed' 
         AND created_at >= ? 
         AND created_at <= ?`,
        [startDate, endDate]
      );

      monthlyRevenue.push({
        month: format(date, 'MMM yyyy'),
        revenue: parseFloat(result[0]?.revenue || 0),
        transactions: result[0]?.transactions || 0,
        avgTransaction: parseFloat(result[0]?.avg_transaction || 0)
      });
    }

    // Get payment method distribution
    const paymentMethods = await query(
      `SELECT 
        payment_method,
        COUNT(*) as count,
        SUM(amount) as total_amount
       FROM payments 
       WHERE status = 'completed' 
       AND created_at >= ?
       GROUP BY payment_method
       ORDER BY total_amount DESC`,
      [subMonths(new Date(), parseInt(period))]
    );

    // Get course type revenue
    const courseRevenue = await query(
      `SELECT 
        c.type,
        c.name,
        COUNT(p.id) as bookings,
        SUM(p.amount) as revenue,
        AVG(p.amount) as avg_price
       FROM courses c
       LEFT JOIN bookings b ON c.id = b.course_id
       LEFT JOIN payments p ON b.payment_id = p.id AND p.status = 'completed'
       WHERE p.created_at >= ?
       GROUP BY c.type, c.name
       ORDER BY revenue DESC`,
      [subMonths(new Date(), parseInt(period))]
    );

    // Get refund and cancellation data
    const refundsData = await query(
      `SELECT 
        COUNT(CASE WHEN status = 'refunded' THEN 1 END) as refunds,
        SUM(CASE WHEN status = 'refunded' THEN amount ELSE 0 END) as refund_amount,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancellations,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed
       FROM payments 
       WHERE created_at >= ?`,
      [subMonths(new Date(), parseInt(period))]
    );

    // Get instructor earnings
    const instructorEarnings = await query(
      `SELECT 
        u.first_name,
        u.last_name,
        u.email,
        COUNT(p.id) as total_lessons,
        SUM(p.amount) as total_earned,
        AVG(p.amount) as avg_per_lesson
       FROM users u
       JOIN bookings b ON u.id = b.instructor_id
       JOIN payments p ON b.payment_id = p.id AND p.status = 'completed'
       WHERE u.role = 'instructor' 
       AND p.created_at >= ?
       GROUP BY u.id
       ORDER BY total_earned DESC
       LIMIT 10`,
      [subMonths(new Date(), parseInt(period))]
    );

    // Get outstanding payments
    const outstandingPayments = await query(
      `SELECT 
        COUNT(*) as pending_count,
        SUM(amount) as pending_amount
       FROM payments 
       WHERE status = 'pending'
       AND created_at >= ?`,
      [subMonths(new Date(), parseInt(period))]
    );

    // Calculate growth rates
    const currentMonthRevenue = monthlyRevenue[monthlyRevenue.length - 1]?.revenue || 0;
    const previousMonthRevenue = monthlyRevenue[monthlyRevenue.length - 2]?.revenue || 0;
    const revenueGrowth = previousMonthRevenue > 0 
      ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100 
      : 0;

    const financial = {
      summary: {
        totalRevenue: monthlyRevenue.reduce((sum, month) => sum + month.revenue, 0),
        monthlyGrowth: revenueGrowth,
        avgMonthlyRevenue: monthlyRevenue.reduce((sum, month) => sum + month.revenue, 0) / monthlyRevenue.length,
        totalTransactions: monthlyRevenue.reduce((sum, month) => sum + month.transactions, 0),
        avgTransactionValue: monthlyRevenue.reduce((sum, month) => sum + month.avgTransaction, 0) / monthlyRevenue.length,
        refunds: refundsData[0]?.refunds || 0,
        refundAmount: parseFloat(refundsData[0]?.refund_amount || 0),
        pendingPayments: outstandingPayments[0]?.pending_count || 0,
        pendingAmount: parseFloat(outstandingPayments[0]?.pending_amount || 0)
      },
      charts: {
        monthlyRevenue: monthlyRevenue,
        paymentMethods: paymentMethods.map((method: any) => ({
          method: method.payment_method || 'Unknown',
          count: method.count,
          amount: parseFloat(method.total_amount || 0),
          percentage: 0 // Will be calculated on frontend
        })),
        courseRevenue: courseRevenue.map((course: any) => ({
          type: course.type,
          name: course.name,
          bookings: course.bookings || 0,
          revenue: parseFloat(course.revenue || 0),
          avgPrice: parseFloat(course.avg_price || 0)
        })),
        instructorEarnings: instructorEarnings.map((instructor: any) => ({
          name: `${instructor.first_name} ${instructor.last_name}`,
          email: instructor.email,
          totalLessons: instructor.total_lessons,
          totalEarned: parseFloat(instructor.total_earned || 0),
          avgPerLesson: parseFloat(instructor.avg_per_lesson || 0)
        }))
      }
    };

    // Calculate payment method percentages
    const totalPaymentAmount = financial.charts.paymentMethods.reduce((sum, method) => sum + method.amount, 0);
    if (totalPaymentAmount > 0) {
      financial.charts.paymentMethods = financial.charts.paymentMethods.map(method => ({
        ...method,
        percentage: Math.round((method.amount / totalPaymentAmount) * 100)
      }));
    }

    return NextResponse.json({
      success: true,
      data: financial,
      period: parseInt(period)
    });

  } catch (error) {
    console.error('Financial analytics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}