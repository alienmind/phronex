import { fetchResourcesForProjectId } from '@/app/lib/dataaccess';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest
) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  const role = searchParams.get('role');

  if (!id) {
    return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
  }

  try {
    const resources = await fetchResourcesForProjectId(id, role || undefined);
    return NextResponse.json(resources);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 });
  }
} 