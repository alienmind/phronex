import { fetchPersons } from '@/app/lib/data';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const persons = await fetchPersons();
    return NextResponse.json(persons);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch persons.' },
      { status: 500 }
    );
  }
} 