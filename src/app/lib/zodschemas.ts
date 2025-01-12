/*
 * This file contains all the Zod schemas for for validation
 * Only the schemas that are used in concrete forms the frontend are exported here
 */
import { z } from 'zod';

export const CreateProjectFormSchema = z.object({
  project_id: z.string().optional(),
  project_name: z.string().min(2, { message: "Name must be at least 2 chars" }).max(255, { message: "Name must less than 255 chars" }),
  project_start_date: z.coerce.date().optional(),
  project_end_date: z.coerce.date().optional(),
  project_creation_date: z.coerce.date().optional(),
  project_manager_id: z.string().uuid({ message: 'Project manager is required.' }),
  project_scope: z.string().optional(),
});

export const UpdateProjectSchema = z.object({
  project_name: z.string().min(2),
  project_scope: z.string(),
  project_start_date: z.date(),
  project_end_date: z.date(),
  project_manager_id: z.string().min(1)
});

export const UpdateExpenseListFilterSchema = z.object({
  expense_start_date: z.date(),
  expense_end_date: z.date(),
});