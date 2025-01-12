import { fetchMostRecentProjects } from '@/app/lib/dataaccess';
import { NextRequest } from 'next/server';

/*
 * This is the API route for the projects
 * It is required purely for dynamically refreshing the projects list in the dashboard
 * Could be replaced by a server action in the future
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limitParam = searchParams.get('limit');
  
  const limit = limitParam ? parseInt(limitParam) : 0;
  
  const projects = await fetchMostRecentProjects(limit);
  
  return Response.json(projects);
} 