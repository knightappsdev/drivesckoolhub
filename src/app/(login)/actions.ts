'use server';

import { redirect } from 'next/navigation';

export async function signOut() {
  // Simple sign out - redirect to login
  redirect('/login');
}