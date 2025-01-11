import { fetchMostRecentProjects } from '@/app/lib/data';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limitParam = searchParams.get('limit');
  
  // Only pass a limit if it's not 'all' and is a valid number
  const limit = limitParam && limitParam !== 'all' ? parseInt(limitParam) : undefined;
  
  const projects = await fetchMostRecentProjects(limit);
  
  return Response.json(projects);
} 