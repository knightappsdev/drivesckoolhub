import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyRefreshToken, generateTokens, setAuthCookies } from '@/lib/auth';
import { getUserById } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token');

    if (!refreshToken?.value) {
      return NextResponse.json(
        { error: 'Refresh token not found' },
        { status: 401 }
      );
    }

    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken.value);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid refresh token' },
        { status: 401 }
      );
    }

    // Get updated user data
    const user = await getUserById(payload.userId);
    if (!user || !user.is_active) {
      return NextResponse.json(
        { error: 'User not found or inactive' },
        { status: 401 }
      );
    }

    // Generate new tokens
    const { password_hash, ...userWithoutPassword } = user;
    const tokens = generateTokens(userWithoutPassword);

    // Set new cookies
    await setAuthCookies(tokens);

    return NextResponse.json({
      success: true,
      message: 'Token refreshed successfully',
      user: tokens.user,
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}