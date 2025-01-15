import { fetchResourcesForProjectId } from '@/app/lib/dataaccess';
import { NextRequest, NextResponse } from 'next/server';

/**
 * This is the API route for the resources of a project
 * It is required purely for dynamically refreshing the resources list in the project details page
 * Could be replaced by a server action in the future
 * 
 * @returns {Promise<VResource[]>} - The resources
 */
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
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 });
  }
} 