import { NextRequest, NextResponse } from 'next/server';
import { executeQuery as query } from '@/lib/database';

// GET /api/leads - Fetch leads (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source');
    const status = searchParams.get('status');
    const urgency = searchParams.get('urgency');
    const assignedTo = searchParams.get('assignedTo');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let sql = `
      SELECT 
        l.*,
        c.title as course_title,
        u.first_name as assigned_first_name,
        u.last_name as assigned_last_name
      FROM leads l
      LEFT JOIN updateddsv_courses c ON l.course_interest = c.id
      LEFT JOIN users u ON l.assigned_to = u.id
      WHERE 1=1
    `;
    
    const params: any[] = [];

    // Add filters
    if (source) {
      sql += ' AND l.source = ?';
      params.push(source);
    }

    if (status) {
      sql += ' AND l.status = ?';
      params.push(status);
    }

    if (urgency) {
      sql += ' AND l.urgency = ?';
      params.push(urgency);
    }

    if (assignedTo) {
      sql += ' AND l.assigned_to = ?';
      params.push(parseInt(assignedTo));
    }

    sql += ' ORDER BY l.urgency DESC, l.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const leads = await query(sql, params);

    // Get total count for pagination
    let countSql = 'SELECT COUNT(*) as total FROM leads WHERE 1=1';
    const countParams: any[] = [];

    if (source) {
      countSql += ' AND source = ?';
      countParams.push(source);
    }

    if (status) {
      countSql += ' AND status = ?';
      countParams.push(status);
    }

    if (urgency) {
      countSql += ' AND urgency = ?';
      countParams.push(urgency);
    }

    if (assignedTo) {
      countSql += ' AND assigned_to = ?';
      countParams.push(parseInt(assignedTo));
    }

    const countResult = await query(countSql, countParams);
    const total = countResult[0]?.total || 0;

    return NextResponse.json({
      success: true,
      leads,
      total,
      pagination: {
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

// POST /api/leads - Submit a new lead
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      source,
      leadType,
      contactName, 
      contactEmail, 
      contactPhone,
      message,
      courseInterest,
      instructorPreference,
      transmissionPreference,
      preferredLocation,
      urgency
    } = body;

    // Validation
    if (!source || !leadType) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: source, leadType' },
        { status: 400 }
      );
    }

    // Get client information for tracking
    const clientIP = request.ip || 
                    request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const referrer = request.headers.get('referer') || null;
    
    // Extract UTM parameters from referrer if available
    let utmSource = null, utmMedium = null, utmCampaign = null;
    if (referrer) {
      try {
        const url = new URL(referrer);
        utmSource = url.searchParams.get('utm_source');
        utmMedium = url.searchParams.get('utm_medium');
        utmCampaign = url.searchParams.get('utm_campaign');
      } catch (e) {
        // Ignore URL parsing errors
      }
    }

    // Insert the lead
    const sql = `
      INSERT INTO leads (
        source,
        lead_type,
        contact_name,
        contact_email,
        contact_phone,
        message,
        course_interest,
        instructor_preference,
        transmission_preference,
        preferred_location,
        urgency,
        ip_address,
        user_agent,
        referrer,
        utm_source,
        utm_medium,
        utm_campaign
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await query(sql, [
      source,
      leadType,
      contactName || null,
      contactEmail || null,
      contactPhone || null,
      message || null,
      courseInterest || null,
      instructorPreference || null,
      transmissionPreference || 'both',
      preferredLocation || null,
      urgency || 'medium',
      clientIP,
      userAgent,
      referrer,
      utmSource,
      utmMedium,
      utmCampaign
    ]);

    return NextResponse.json({
      success: true,
      message: 'Lead submitted successfully',
      leadId: result.insertId
    });

  } catch (error) {
    console.error('Error submitting lead:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit lead' },
      { status: 500 }
    );
  }
}

// PUT /api/leads - Update lead status and assignment
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      leadId, 
      status, 
      assignedTo, 
      notes, 
      followUpDate,
      urgency 
    } = body;

    if (!leadId) {
      return NextResponse.json(
        { success: false, error: 'Missing lead ID' },
        { status: 400 }
      );
    }

    const validStatuses = ['new', 'contacted', 'qualified', 'converted', 'lost'];
    const validUrgencies = ['low', 'medium', 'high'];

    let updateFields: string[] = [];
    let updateValues: any[] = [];

    if (status && validStatuses.includes(status)) {
      updateFields.push('status = ?');
      updateValues.push(status);
      
      // Set conversion date if status is converted
      if (status === 'converted') {
        updateFields.push('conversion_date = CURRENT_TIMESTAMP');
      }
    }

    if (assignedTo !== undefined) {
      updateFields.push('assigned_to = ?');
      updateValues.push(assignedTo);
    }

    if (notes !== undefined) {
      updateFields.push('notes = ?');
      updateValues.push(notes);
    }

    if (followUpDate !== undefined) {
      updateFields.push('follow_up_date = ?');
      updateValues.push(followUpDate);
    }

    if (urgency && validUrgencies.includes(urgency)) {
      updateFields.push('urgency = ?');
      updateValues.push(urgency);
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateValues.push(leadId);

    const sql = `UPDATE leads SET ${updateFields.join(', ')} WHERE id = ?`;
    const result = await query(sql, updateValues);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Lead updated successfully'
    });

  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update lead' },
      { status: 500 }
    );
  }
}