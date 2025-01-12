import { fetchResourcesForProjectId } from '@/app/lib/dataaccess';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const searchParams = request.nextUrl.searchParams;
  const role = searchParams.get('role');

  try {
    const resources = await fetchResourcesForProjectId(params.id, role || undefined);
    return NextResponse.json(resources);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 });
  }
} 