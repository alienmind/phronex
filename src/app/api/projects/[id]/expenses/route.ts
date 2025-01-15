import { fetchProjectExpensesAndBudget, createExpense } from '@/app/lib/dataaccess';
import { NextRequest, NextResponse } from 'next/server';

/*
 * This is the API route for the expenses of a project
 * It is required purely for dynamically refreshing the expenses list in the project details page
 * Could be replaced by a server action in the future
 * 
 * @returns {Promise<VExpense[]>} - The expenses
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  const searchParams = request.nextUrl.searchParams;
  const startDate = searchParams.get('start_date') || '1900-01-01';
  const endDate = searchParams.get('end_date') || '2100-01-01';

  if (!id) {
    console.error('Project ID is required');
    return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
  }

  try {
    const expenses = await fetchProjectExpensesAndBudget(
      id,
      new Date(startDate),
      new Date(endDate)
    );
    return NextResponse.json(expenses);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
  }
}

/**
 * This is the API route for creating an expense for a project
 * 
 * @returns {Promise<VExpense>} - The created expense
 */
export async function POST(
  request: Request
) {
  try {
    const data = await request.json();
    const newExpense = await createExpense(data);
    return NextResponse.json({ expense: newExpense });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
  }
} 