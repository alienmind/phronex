import { z } from 'zod';

export const CreateProjectFormSchema = z.object({
  project_id: z.string().optional(),
  project_name: z.string().min(2, { message: "Name must be at least 2 chars" }).max(255, { message: "Name must less than 255 chars" }),
  project_start_date: z.date().optional(),
  project_end_date: z.date().optional(),
  project_creation_date: z.date().optional(),
});
