import { fetchCategories } from '@/app/lib/dataaccess';
import { NextResponse } from 'next/server';

/**
 * This is the API route for the categories
 * It is required purely for dynamically refreshing the categories list in the dashboard
 * Could be replaced by a server action in the future
 * 
 * @returns {Promise<VCategory[]>} - The categories
 */
export async function GET() {
  try {
    const categories = await fetchCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
} 