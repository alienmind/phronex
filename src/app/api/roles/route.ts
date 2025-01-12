import { fetchRoles } from '@/app/lib/dataaccess';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const roles = await fetchRoles();
    return NextResponse.json(roles);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch roles' }, { status: 500 });
  }
} 