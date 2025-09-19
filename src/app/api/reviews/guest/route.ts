import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

// GET /api/reviews/guest - Fetch guest reviews
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const instructorId = searchParams.get('instructorId');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const rating = searchParams.get('rating');

    let sql = `
      SELECT 
        id,
        reviewer_name,
        rating,
        comment,
        instructor_id,
        course_id,
        created_at
      FROM guest_reviews 
      WHERE is_approved = TRUE
    `;
    
    const params: any[] = [];

    // Add filters
    if (instructorId) {
      sql += ' AND instructor_id = ?';
      params.push(parseInt(instructorId));
    }

    if (rating) {
      sql += ' AND rating = ?';
      params.push(parseInt(rating));
    }

    // Use string concatenation for LIMIT/OFFSET to avoid MySQL parameter issues
    sql += ` ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;

    const reviews = await executeQuery(sql, params);

    // Get total count for pagination
    let countSql = 'SELECT COUNT(*) as total FROM guest_reviews WHERE is_approved = TRUE';
    const countParams: any[] = [];

    if (instructorId) {
      countSql += ' AND instructor_id = ?';
      countParams.push(parseInt(instructorId));
    }

    if (rating) {
      countSql += ' AND rating = ?';
      countParams.push(parseInt(rating));
    }

    const countResult = await executeQuery(countSql, countParams);
    const total = countResult[0]?.total || 0;

    // Calculate average rating
    let avgSql = 'SELECT AVG(rating) as average FROM guest_reviews WHERE is_approved = TRUE';
    const avgParams: any[] = [];

    if (instructorId) {
      avgSql += ' AND instructor_id = ?';
      avgParams.push(parseInt(instructorId));
    }

    const avgResult = await executeQuery(avgSql, avgParams);
    const averageRating = parseFloat(avgResult[0]?.average || '0');

    return NextResponse.json({
      success: true,
      reviews,
      total,
      averageRating,
      pagination: {
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error('Error fetching guest reviews:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST /api/reviews/guest - Submit a new guest review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      reviewerName, 
      rating, 
      comment, 
      instructorId, 
      courseId, 
      reviewerEmail 
    } = body;

    // Validation
    if (!reviewerName || !rating || !comment) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    if (comment.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Comment must be at least 10 characters long' },
        { status: 400 }
      );
    }

    // Get client IP and user agent for spam prevention
    const clientIP = request.ip || 
                    request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Insert the review (auto-approved for now, could add moderation later)
    const sql = `
      INSERT INTO guest_reviews (
        reviewer_name, 
        rating, 
        comment, 
        instructor_id, 
        course_id, 
        reviewer_email,
        is_approved,
        ip_address,
        user_agent
      ) VALUES (?, ?, ?, ?, ?, ?, TRUE, ?, ?)
    `;

    const result = await executeQuery(sql, [
      reviewerName,
      rating,
      comment,
      instructorId || null,
      courseId || null,
      reviewerEmail || null,
      clientIP,
      userAgent
    ]);

    return NextResponse.json({
      success: true,
      message: 'Review submitted successfully',
      reviewId: (result as any).insertId
    });

  } catch (error) {
    console.error('Error submitting guest review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit review' },
      { status: 500 }
    );
  }
}