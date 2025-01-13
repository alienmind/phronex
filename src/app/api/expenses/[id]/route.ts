import { updateExpense } from '@/app/lib/dataaccess';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
) {
  try {
    const data = await request.json();
    console.log("data:::", JSON.stringify(data));
    const updatedExpense = await updateExpense(data.expense_id, data);
    return NextResponse.json({ expense: updatedExpense });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update expense' }, { status: 500 });
  }
} 