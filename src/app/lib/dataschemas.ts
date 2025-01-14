/*
 * This file contains objects types wrapping the database tables.
 * Could be generated automatically if using an ORM such as Prisma.
 */

// A user of the system. Not the same as a "Person" (human resource)
export type User = {
  id: string;
  name: string;
  email: string;
  encpassword: string;
  emailVerified: Date;
};

// A recorded expense of the project
// It belongs to a category that is budgeted per project
export type ProjectExpense = {
  expense_id: string;
  project_id: string;
  category_id: string;
  expense_name: string;
  expense_date: Date;
  expense_value: number;
};

// A category of the cost
// Categories are reusable between projects
export type Category = {
  category_id: string;
  category_name: string;
};

// The budget for each category per project
export type ProjectBudget = {
  project_id: string;
  category_id: string;
  project_category_budget: number;
};

// A human resource, assignable to projects
export type Person = {
  person_id: string;
  person_name: string;
  person_surname: string;
  person_email: string;
};

// Each person can have multiple roles in different projects
export type ProjectPersonRole = {
  project_id: string;
  person_id: string;
  role_id: string;
};

// A project occurs in a time frame with a clear scope
// It also have a mandatory project manager so we don't
// force it to be related through the ProjectPersonRole table
// This is a special situation
export type Project = {
  project_id: string;
  project_name: string;
  project_scope?: string | undefined;
  project_creation_date?: Date | undefined;
  project_start_date?: Date | undefined;
  project_end_date?: Date | undefined;
  project_manager_id: string;
};

// Roles are generic and reusable between projects
export type Role = {
  role_id: string;
  role_description: string;
};

// Derived schemas
// We explicit these joins between certain tables as per the front-end needs
// They include additional fields (when relevant) to make easier the update (composite_id) or the search (all_columns)
// Notation: they have V prefix to indicate they are sort of UI views not actual database tables

// Project combined with project manager
export type VProjectWithProjectManager = {
  project_id: string;
  project_creation_date: Date;
  project_name: string;
  project_start_date: Date;
  project_end_date: Date;
  project_scope: string;
  project_manager_id: string;
  person_name: string;
  person_surname: string;
  person_email: string;
};

// Detailed view of the project expenses combined with the budget for each category
// We also add an all_columns to enable filtering
export type VProjectExpensesWithCategoryBudget = {
  expense_id: string;
  expense_name: string;
  expense_date: Date;
  expense_value: number;
  category_id: string;
  category_name: string;
  project_category_budget: number;
  project_id: string;
  all_columns: string;
};

// Resources assigned to a project with all_columns and composite_id to enable filtering and updating
export type VProjectResources = {
  project_id: string;
  person_id: string;
  person_name: string;
  person_surname: string;
  person_name_surname: string; // Artificial field to enable filtering and editing
  role_id: string;
  role_description: string;
  composite_id: string; // Concatenation of project_id and person_id to make easier the update
  all_columns: string;
};

// A person with all_columns to enable filtering
export type VPerson = Person & {
  all_columns: string;
};

// A role with all_columns to enable filtering
export type VRole = Role & {
  all_columns: string;
};


