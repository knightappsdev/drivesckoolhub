import { NextRequest, NextResponse } from 'next/server';
import { executeQuery as query } from '@/lib/database';

// GET /api/instructors/enhanced - Fetch instructors with UpdatedDSV format
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const transmission = searchParams.get('transmission');
    const specialty = searchParams.get('specialty');
    const minRating = searchParams.get('minRating');
    const maxPrice = searchParams.get('maxPrice');
    const language = searchParams.get('language');
    const gender = searchParams.get('gender');
    const nationality = searchParams.get('nationality');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    let sql = `
      SELECT 
        i.id,
        i.instructor_name as name,
        i.avatar,
        i.rating,
        i.location,
        i.experience as years_experience,
        i.specialties,
        i.transmission_types,
        i.price_per_hour,
        i.availability_text as availability,
        i.bio,
        i.languages,
        i.nationality,
        i.religion,
        i.ethnicity,
        i.gender,
        i.total_reviews,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        (
          SELECT COUNT(*) 
          FROM guest_reviews gr 
          WHERE gr.instructor_id = i.id AND gr.is_approved = TRUE
        ) as actual_review_count,
        (
          SELECT AVG(rating) 
          FROM guest_reviews gr 
          WHERE gr.instructor_id = i.id AND gr.is_approved = TRUE
        ) as actual_rating
      FROM instructors i
      JOIN users u ON i.user_id = u.id
      WHERE u.is_active = TRUE AND u.role = 'instructor' AND i.is_available = TRUE
    `;
    
    const params: any[] = [];

    // Add filters
    if (location) {
      sql += ' AND i.location LIKE ?';
      params.push(`%${location}%`);
    }

    if (transmission) {
      sql += ' AND JSON_CONTAINS(i.transmission_types, ?)';
      params.push(JSON.stringify(transmission));
    }

    if (specialty) {
      sql += ' AND JSON_CONTAINS(i.specialties, ?)';
      params.push(JSON.stringify(specialty));
    }

    if (minRating) {
      sql += ' AND i.rating >= ?';
      params.push(parseFloat(minRating));
    }

    if (maxPrice) {
      sql += ' AND i.price_per_hour <= ?';
      params.push(parseFloat(maxPrice));
    }

    if (language) {
      sql += ' AND JSON_CONTAINS(i.languages, ?)';
      params.push(JSON.stringify(language));
    }

    if (gender) {
      sql += ' AND i.gender = ?';
      params.push(gender);
    }

    if (nationality) {
      sql += ' AND i.nationality = ?';
      params.push(nationality);
    }

    sql += ' ORDER BY i.rating DESC, i.total_reviews DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const instructors = await query(sql, params);

    // Process the results to match UpdatedDSV format
    const processedInstructors = instructors.map((instructor: any) => ({
      id: instructor.id.toString(),
      name: instructor.name || `${instructor.first_name} ${instructor.last_name}`,
      avatar: instructor.avatar || `https://placehold.co/100x100/E5E7EB/374151?text=${instructor.first_name?.[0]}${instructor.last_name?.[0]}`,
      rating: instructor.actual_rating || instructor.rating || 0,
      reviews: instructor.actual_review_count || instructor.total_reviews || 0,
      location: instructor.location || 'Not specified',
      experience: instructor.years_experience || 0,
      specialties: typeof instructor.specialties === 'string' ? JSON.parse(instructor.specialties) : instructor.specialties || [],
      transmissionTypes: typeof instructor.transmission_types === 'string' ? JSON.parse(instructor.transmission_types) : instructor.transmission_types || ['manual'],
      pricePerHour: instructor.price_per_hour || 0,
      availability: instructor.availability || 'Contact for availability',
      bio: instructor.bio || 'Experienced driving instructor',
      languages: typeof instructor.languages === 'string' ? JSON.parse(instructor.languages) : instructor.languages || ['English'],
      nationality: instructor.nationality || 'British',
      religion: instructor.religion || 'Not specified',
      ethnicity: instructor.ethnicity || 'Not specified',
      gender: instructor.gender || 'Not specified',
      email: instructor.email,
      phone: instructor.phone
    }));

    // Get total count for pagination
    let countSql = `
      SELECT COUNT(*) as total 
      FROM instructors i
      JOIN users u ON i.user_id = u.id
      WHERE u.is_active = TRUE AND u.role = 'instructor' AND i.is_available = TRUE
    `;
    
    const countParams: any[] = [];
    let paramIndex = 0;

    // Apply same filters for count
    if (location) {
      countSql += ' AND i.location LIKE ?';
      countParams.push(`%${location}%`);
    }

    if (transmission) {
      countSql += ' AND JSON_CONTAINS(i.transmission_types, ?)';
      countParams.push(JSON.stringify(transmission));
    }

    if (specialty) {
      countSql += ' AND JSON_CONTAINS(i.specialties, ?)';
      countParams.push(JSON.stringify(specialty));
    }

    if (minRating) {
      countSql += ' AND i.rating >= ?';
      countParams.push(parseFloat(minRating));
    }

    if (maxPrice) {
      countSql += ' AND i.price_per_hour <= ?';
      countParams.push(parseFloat(maxPrice));
    }

    if (language) {
      countSql += ' AND JSON_CONTAINS(i.languages, ?)';
      countParams.push(JSON.stringify(language));
    }

    if (gender) {
      countSql += ' AND i.gender = ?';
      countParams.push(gender);
    }

    if (nationality) {
      countSql += ' AND i.nationality = ?';
      countParams.push(nationality);
    }

    const countResult = await query(countSql, countParams);
    const total = countResult[0]?.total || 0;

    // Get filter options for the frontend
    const filterOptionsQueries = await Promise.all([
      query('SELECT DISTINCT location FROM instructors WHERE location IS NOT NULL AND location != "" ORDER BY location'),
      query('SELECT DISTINCT JSON_UNQUOTE(JSON_EXTRACT(specialties, "$[*]")) as specialty FROM instructors WHERE specialties IS NOT NULL'),
      query('SELECT DISTINCT JSON_UNQUOTE(JSON_EXTRACT(languages, "$[*]")) as language FROM instructors WHERE languages IS NOT NULL'),
      query('SELECT DISTINCT gender FROM instructors WHERE gender IS NOT NULL ORDER BY gender'),
      query('SELECT DISTINCT nationality FROM instructors WHERE nationality IS NOT NULL ORDER BY nationality'),
      query('SELECT MIN(price_per_hour) as min_price, MAX(price_per_hour) as max_price FROM instructors WHERE price_per_hour > 0')
    ]);

    const filterOptions = {
      locations: filterOptionsQueries[0].map((row: any) => row.location),
      specialties: [...new Set(filterOptionsQueries[1].map((row: any) => row.specialty).filter(Boolean))],
      languages: [...new Set(filterOptionsQueries[2].map((row: any) => row.language).filter(Boolean))],
      genders: filterOptionsQueries[3].map((row: any) => row.gender),
      nationalities: filterOptionsQueries[4].map((row: any) => row.nationality),
      priceRange: {
        min: filterOptionsQueries[5][0]?.min_price || 0,
        max: filterOptionsQueries[5][0]?.max_price || 100
      }
    };

    return NextResponse.json({
      success: true,
      instructors: processedInstructors,
      total,
      filterOptions,
      pagination: {
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error('Error fetching enhanced instructors:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch instructors' },
      { status: 500 }
    );
  }
}

// POST /api/instructors/enhanced - Update instructor with UpdatedDSV fields
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      instructorId,
      name,
      avatar,
      location,
      specialties,
      transmissionTypes,
      pricePerHour,
      availability,
      bio,
      languages,
      nationality,
      religion,
      ethnicity,
      gender
    } = body;

    if (!instructorId) {
      return NextResponse.json(
        { success: false, error: 'Missing instructor ID' },
        { status: 400 }
      );
    }

    // Check if instructor exists
    const instructorCheck = await query('SELECT id FROM instructors WHERE id = ?', [instructorId]);
    if (instructorCheck.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Instructor not found' },
        { status: 404 }
      );
    }

    // Build update query
    let updateFields: string[] = [];
    let updateValues: any[] = [];

    if (name) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }

    if (avatar) {
      updateFields.push('avatar = ?');
      updateValues.push(avatar);
    }

    if (location) {
      updateFields.push('location = ?');
      updateValues.push(location);
    }

    if (specialties) {
      updateFields.push('specialties = ?');
      updateValues.push(JSON.stringify(specialties));
    }

    if (transmissionTypes) {
      updateFields.push('transmission_types = ?');
      updateValues.push(JSON.stringify(transmissionTypes));
    }

    if (pricePerHour !== undefined) {
      updateFields.push('price_per_hour = ?');
      updateValues.push(pricePerHour);
    }

    if (availability) {
      updateFields.push('availability = ?');
      updateValues.push(availability);
    }

    if (bio) {
      updateFields.push('bio = ?');
      updateValues.push(bio);
    }

    if (languages) {
      updateFields.push('languages = ?');
      updateValues.push(JSON.stringify(languages));
    }

    if (nationality) {
      updateFields.push('nationality = ?');
      updateValues.push(nationality);
    }

    if (religion) {
      updateFields.push('religion = ?');
      updateValues.push(religion);
    }

    if (ethnicity) {
      updateFields.push('ethnicity = ?');
      updateValues.push(ethnicity);
    }

    if (gender) {
      updateFields.push('gender = ?');
      updateValues.push(gender);
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No fields to update' },
        { status: 400 }
      );
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateValues.push(instructorId);

    const sql = `UPDATE instructors SET ${updateFields.join(', ')} WHERE id = ?`;
    await query(sql, updateValues);

    return NextResponse.json({
      success: true,
      message: 'Instructor updated successfully'
    });

  } catch (error) {
    console.error('Error updating instructor:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update instructor' },
      { status: 500 }
    );
  }
}