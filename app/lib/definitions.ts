// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  encpassword: string;
  emailVerified: Date;
};

export type Cost = {
  cost_id: string;
  cost_name: string;
  category_id: string;
};

export type Person = {
  person_id: string;
  person_name: string;
  person_surname: string;
};

export type ProjectCostPeriod = {
  project_id: string;
  cost_id: string;
};

export type ProjectPersonPeriod = {
  project_id: string;
  cost_id: string;
  estimate: number;
  real: number;
  period_start: Date;
  period_end: Date;
};

export type ProjectPersonRole = {
  project_id: string;
  person_id: string;
  role_id: string;
};

export type Project = {
  project_id: string;
  project_creation_date: Date;
  project_name: string;
  project_start_date: Date;
  project_end_date: Date;
  project_scope: string;
};

export type Role = {
  role_id: string;
  role_name: string;
};

/*

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type InvoicePerCustomer = {
  id : string,
  amount : number,
  date : string,
  status : string,
  name : string,
  email : string,
  image_url : string,
};

*/