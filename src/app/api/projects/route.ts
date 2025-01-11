import { fetchMostRecentProjects } from '@/app/lib/data';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limitParam = searchParams.get('limit');
  
  const limit = limitParam ? parseInt(limitParam) : 0;
  
  const projects = await fetchMostRecentProjects(limit);
  
  return Response.json(projects);
} 