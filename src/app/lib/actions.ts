'use server';

/*
 * This file contains the server actions for the project
 * 
 * They are used to handle the business logic of the project
 * and to interact with the database
 */
import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { CreateProjectFormSchema, UpdateProjectSchema } from '@/app/lib/zodschemas';
import { addProject, updateProject } from './dataaccess';
import { Project } from './dataschemas';

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
 * User logout
 */
export async function unauthenticate() {
  await signOut({redirectTo: '/'});
}

/*
 * Project creation
 * The form validation is done using Zod
 * The form data is validated and then inserted into the database
 * 
 * FIXME - we could also complement with client-side validation
 */
 
// Omit a few values that will be calculated
// project_id is autogenerated by the database as UUID
// project_creation_date is autogenerated by this action
const CreateProject = CreateProjectFormSchema.omit({ project_id: true, project_creation_date: true });


/*
 * Type for the project creation state
 * It is required for the validation logic
 */
export type CreateProjectState = {
  errors?: {
    project_id?: string[];
    project_name?: string[];
    project_start_date?: string[];
    project_end_date?: string[];
    project_creation_date?: string[];
    project_manager_id?: string[];
  };
  message?: string | null;
};

/*
 * Project creation server action
 * 
 * It is used to create a new project
 * @param prevState - the previous state of the project creation
 * @param formData - the form data to create the project
 */
export async function createProjectAction(prevState: CreateProjectState | undefined, formData: FormData) {
  console.log('Starting project creation with form data:', Object.fromEntries(formData));

  // Validate form using Zod
  const validatedFields = CreateProject.safeParse({
    project_id: formData.get('project_id'),
    project_name: formData.get('project_name'),
    project_start_date: formData.get('project_start_date'),
    project_end_date: formData.get('project_end_date'),
    project_manager_id: formData.get('project_manager_id'),
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

  console.log('Validation successful:', validatedFields.data);
 
  // Prepare data for insertion into the database
  const { project_name, project_start_date, project_end_date, project_manager_id } = validatedFields.data;

  // Please note that we are not providing project_id or project_scope
  // The former will be calculated by the database, the latter will require a bigger UI so we
  // leave it empty for now and force the user to fill it out properly in the project details page
  const project = {
    project_id: "",
    project_name: project_name,
    project_start_date: project_start_date,
    project_end_date: project_end_date,
    project_scope: "",
    project_manager_id: project_manager_id
  };

  console.log('Attempting to add project to database:', project);

  try {
    await addProject(project);
    console.log('Project successfully added to database');
  } catch (error) {
    console.error('Failed to add project:', error);
    throw error;
  }

  console.log('Revalidating dashboard path and redirecting');
  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath('/dashboard');
  redirect('/dashboard');
}

/*
 * Project update server action
 * 
 * It is used to update a project
 * @param prevState - the previous state of the project update
 * @param formData - the form data to update the project
 */
export async function updateProjectAction(
  prevState: any,
  formData: FormData
) {
  console.log(JSON.stringify(formData));

  const data = {
    project_id: formData.get('project_id'),
    project_name: formData.get('project_name'),
    project_scope: formData.get('project_scope'),
    project_start_date: new Date(formData.get('project_start_date') as string),
    project_end_date: new Date(formData.get('project_end_date') as string),
    project_manager_id: formData.get('project_manager_id'),
  };

  try {
    const result = UpdateProjectSchema.safeParse(data);
    if (!result.success) {
      return { error: 'Invalid form data' };
    }
    await updateProject(data as Project);
    revalidatePath(`/dashboard/projects/${data.project_id}`);
  } catch (error) {
    console.log(JSON.stringify({ error: 'Failed to update project ' + JSON.stringify(error) }));
    return { error: 'Failed to update project ' + JSON.stringify(error) };
  }
  redirect('/dashboard');
  //return { success: true }; - cannot really return as we are redirecting
} 