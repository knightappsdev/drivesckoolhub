import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

export async function GET() {
  try {
    // Simple query first
    const simpleResult = await executeQuery('SELECT COUNT(*) as total FROM guest_reviews');
    
    // Test with basic LIMIT
    const limitResult = await executeQuery('SELECT * FROM guest_reviews LIMIT 5');
    
    return NextResponse.json({
      success: true,
      totalReviews: simpleResult[0]?.total || 0,
      sampleReviews: limitResult.length,
      message: 'Database connection working'
    });

  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database test failed',
        details: error.message
      },
      { status: 500 }
    );
  }
}