'use server';
 
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { CreateProjectFormSchema } from '@/app/lib/schemas';
import { z } from 'zod';
const connectionPool = require('../../db');

/*
 * User authentication
 */
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

/*
 * Project creation
 */
 
// Omit a few values that will be calculated
// project_id is autogenerated by the database as UUID
// project_creation_date is autogenerated by this action
const CreateProject = CreateProjectFormSchema.omit({ project_id: true, project_creation_date: true });

export type State = {
  errors?: {
    project_id?: string[];
    project_name?: string[];
    project_start_date?: string[];
    project_end_date?: string[];
    project_creation_date?: string[];
  };
  message?: string | null;
};
export async function createProject(
  prevState: State | undefined,
  formData: FormData,
) {

  // Validate form using Zod
  const validatedFields = CreateProject.safeParse({
    project_id: formData.get('project_id'),
    project_name: formData.get('project_name'),
    project_start_date: formData.get('project_start_date'),
    project_end_date: formData.get('project_end_date'),
  });

  const rawFormData = Object.fromEntries(formData.entries())

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    console.log("Validation error: ", JSON.stringify(validatedFields));
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to create project.',
    };
  }
 
  // Prepare data for insertion into the database
  const { project_name, project_start_date, project_end_date } = validatedFields.data;

  // Insert data into the database
  try {
    await connectionPool.query({
      text: "INSERT INTO projects (project_name, project_start_date, project_end_date) VALUES ($1, $2, $3)",
      values: [project_name, project_start_date, project_end_date]
    });

  } catch (_error) {
    // If a database error occurs, return a more specific error.
    console.log("Database error: ", JSON.stringify(_error));
    return {
      message: 'Database Error: Failed to create project',
    };
  }
 
  await connectionPool.query(`COMMIT`);

  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath('/dashboard');
  redirect('/dashboard');
}

/*
// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }
 
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
 
  try {
    await connectionPool.query(`
      UPDATE invoices
      SET customer_id = '${customerId}', amount = ${amountInCents}, status = '${status}'
      WHERE id = '${id}'
    `);
  } catch (_error) {
    return { message : "Database Error: Failed to Update Invoice." };
  } 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  // Test error
  // throw new Error('Failed to Delete Invoice');
  try {
    await connectionPool.query(`DELETE FROM invoices WHERE id = '${id}'`);
    revalidatePath('/dashboard/invoices');
  } catch (_error) {
    return; // {
    //  message : "Database Error: Failed to Delete Invoice."
    //};
  }
}
*/ 