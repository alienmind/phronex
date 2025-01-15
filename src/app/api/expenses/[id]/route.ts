import { updateExpense } from '@/app/lib/dataaccess';
import { NextResponse } from 'next/server';

/**
 * This is the API route for the expenses
 * It is required purely for dynamically refreshing the expenses list in the dashboard
 * Could be replaced by a server action in the future
 * 
 * @returns {Promise<VExpense>} - The updated expense
 */
export async function POST(
  request: Request,
) {
  try {
    const data = await request.json();
    const updatedExpense = await updateExpense(data.expense_id, data);
    return NextResponse.json({ expense: updatedExpense });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to update expense' }, { status: 500 });
  }
} 