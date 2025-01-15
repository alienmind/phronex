/*
 * This is the API route for the persons
 * It is required purely for dynamically refreshing the persons list in the dashboard
 * Could be replaced by a server action in the future
 * 
 * @returns {Promise<VPerson[]>} - The persons
 */
import { fetchPersons } from '@/app/lib/dataaccess';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const persons = await fetchPersons();
    return NextResponse.json(persons);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch persons.' },
      { status: 500 }
    );
  }
} 