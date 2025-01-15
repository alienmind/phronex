import { fetchRoles } from '@/app/lib/dataaccess';
import { NextResponse } from 'next/server';

/**
 * This is the API route for the roles
 * It is required purely for dynamically refreshing the roles list in admin table
 * Could be replaced by a server action in the future
 * 
 * @returns {Promise<VRole[]>} - The roles
 */
export async function GET() {
  try {
    const roles = await fetchRoles();
    return NextResponse.json(roles);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch roles' },
      { status: 500 }
    );
  }
} 