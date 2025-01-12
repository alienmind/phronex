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
  role_name: string;
};

// Derived schemas
// We explicit these joins between certain tables as per the front-end needs

// Resources assigned to a project
export type ProjectResource = {
  project_id: string;
  person_name: string;
  person_surname: string;
  role_description: string;
};

// Project combined with project manager
export type ProjectWithProjectManager = {
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
export type ProjectExpensesCategoryBudgetTableView = {
  expense_id: string;
  expense_name: string;
  expense_date: Date;
  expense_value: number;
  category_name: string;
  project_category_budget: number;
  all_columns: string;
};

// Resources assigned to a project with all_columns to enable filtering
export type ProjectResourceTableView = {
  project_id: string;
  person_id: string;
  person_name: string;
  person_surname: string;
  role_description: string;
  all_columns: string;
};


