import { fetchProjectExpensesAndBudget } from '@/app/lib/dataaccess';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const searchParams = request.nextUrl.searchParams;
  const startDate = searchParams.get('start_date') || '1900-01-01';
  const endDate = searchParams.get('end_date') || '2100-01-01';

  try {
    const expenses = await fetchProjectExpensesAndBudget(
      params.id,
      new Date(startDate),
      new Date(endDate)
    );
    return NextResponse.json(expenses);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
  }
} 