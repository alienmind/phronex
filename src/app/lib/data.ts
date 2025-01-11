import type { ProjectWithPersonRole, User, Project } from '@/app/lib/definitions';

//import { sql } from '@vercel/postgres';
const connectionPool = require('@/app/lib/db');

export async function fetchPersons() {
  try {
    const query = `
    SELECT person_id, person_name, person_surname 
    FROM person 
    ORDER BY person_surname, person_name`;
    
    const data = await connectionPool.query(query);
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch persons.');
  }
} 


//
// Authentication SQL flow with PostgreSQL (the right way)
// 1) Set up the database (see load-data.ts) with the extension pgcrypto
//   CREATE EXTENSION pgcrypto;
// 2) The following command encodes a password "mypasss" with a salt of 4 rounds of blowfish (increase to 8 in prod)
//   SELECT crypt('mypass', gen_salt('bf', 4));
// 3) The following insert will store the encoded password in the database 
//   INSERT INTO users (user_id,enc_pass) VALUES (1,crypt('mypass', gen_salt('bf', 4)));
// 4) The following query will check if the password is correct
//   SELECT * FROM users WHERE email='test@test.com' and encpass = crypt('plain_password', encpass)
export async function getUser(email: string, password: string): Promise<User | undefined> {
  try {
    const user = await connectionPool.query(`SELECT * FROM users WHERE email='${email}' and encpassword = crypt('${password}', encpassword)`);
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export async function addProject(project: Project) {
  // Insert data into the database
  try {
    await connectionPool.query({
      text: `INSERT INTO projects (
        project_name, 
        project_start_date, 
        project_end_date, 
        project_scope,
        project_manager_id
      ) VALUES ($1, $2, $3, $4, $5)`,
      values: [
        project.project_name,
        project.project_start_date,
        project.project_end_date,
        project.project_scope,
        project.project_manager_id
      ]
    });

  } catch (error) {
    // If a database error occurs, return a more specific error.
    console.log("Database error: ", JSON.stringify(error));
    return {
      message: 'Database Error: Failed to create project',
    };
  }
 
  await connectionPool.query(`COMMIT`);
}

export async function updateProject(data: Project) {
    const query = {
      text: `UPDATE projects SET project_name = $1, project_scope = $2, project_start_date = $3, project_end_date = $4, project_manager_id = $5 WHERE project_id = $6`,
      values: [data.project_name, data.project_scope, data.project_start_date, data.project_end_date, data.project_manager_id, data.project_id]
    };
    console.log('Executing query:', query.text);
    console.log('With values:', query.values);
    await connectionPool.query(query);
    console.log("Update successful!");
    await connectionPool.query("COMMIT");
}

export async function fetchMostRecentProjects(limit?: number) {
  try {
    if (limit && limit <= 0) {
      limit = undefined;
    }
    const query = `
    SELECT a.project_id, project_creation_date, project_name, project_start_date, project_end_date,
       project_scope, person_name, person_surname
    FROM projects a
    LEFT OUTER JOIN person b on a.project_manager_id = b.person_id
    ORDER BY a.project_start_date DESC
    ${limit ? `LIMIT ${limit}` : ''}
    `;

    const data = await connectionPool.query(query);

    const mostRecentProjects = data.rows.map((project: ProjectWithPersonRole) => ({
      ...project,
    }));
    return mostRecentProjects;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch most recent projects.');
  }
}

export async function fetchProjectById(id: string) {
  try {
    const query = `
      SELECT p.*, 
             person.person_name, 
             person.person_surname
      FROM projects p
      LEFT JOIN person ON p.project_manager_id = person.person_id
      WHERE p.project_id = $1
    `;
    
    const result = await connectionPool.query(query, [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch project.');
  }
}

export async function fetchCostDetailsForProjectId(id: string) {
  try {
    console.log('AAA Fetching costs for project:', id);
    const query = `
      SELECT c.cost_id, estimate, real, period_start, period_end, cost_name, category_name
      FROM projects a
      JOIN project_cost_period b ON a.project_id = b.project_id
      JOIN cost c ON b.cost_id = c.cost_id
      JOIN category d ON c.category_id = d.category_id
      WHERE a.project_id = $1
    `;
    
    const result = await connectionPool.query(query, [id]);
    return result.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch project costs.');
  }
}

export async function fetchResourcesForProjectId(id: string) {
  try {
    const query = `
      SELECT person_name || ' ' || person_surname as person_name, role_description
      FROM projects a
      JOIN project_person_role b on a.project_id = b.project_id
      JOIN role c on b.role_id = c.role_id
      JOIN person d on b.person_id = d.person_id
      WHERE a.project_id = $1
    `;
    
    const result = await connectionPool.query(query, [id]);
    return result.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch project costs.');
  }
}

/*

import {
  CustomersTableType,
  InvoiceForm,
  LatestInvoiceRaw,
} from './definitions';
import { formatCurrency } from './utils';

export async function fetchRevenue() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    //console.log('Fetching revenue data...');
    //await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await connectionPool.query(`SELECT * FROM revenue`);

    //console.log('Data fetch completed after 3 seconds.');

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    //const data = await sql<LatestInvoiceRaw>`
    const data = await connectionPool.query(`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`
    );

    const latestInvoices = data.rows.map((invoice: LatestInvoiceRaw) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = connectionPool.query(`SELECT COUNT(*) FROM invoices`);
    const customerCountPromise = connectionPool.query(`SELECT COUNT(*) FROM customers`);
    const invoiceStatusPromise = connectionPool.query(`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`);

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
    const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    //const invoices = await sql<InvoicesTable>`
    const invoices = await connectionPool.query(`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE '%${query}%' OR
        customers.email ILIKE '%${query}%' OR
        invoices.amount::text ILIKE '%${query}%' OR
        invoices.date::text ILIKE '%${query}%' OR
        invoices.status ILIKE '%${query}%'
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `);
    return invoices.rows;
   return [];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const count = await connectionPool.query(`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE '%${query}%' OR
      customers.email ILIKE '%${query}%' OR
      invoices.amount::text ILIKE '%${query}%' OR
      invoices.date::text ILIKE '%${query}%' OR
      invoices.status ILIKE '%${query}%'
  `);

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    //const data = await sql<InvoiceForm>`
    const data = await connectionPool.query(`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = '${id}';
    `);

    const invoice = data.rows.map((invoice : InvoiceForm) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));
    console.log(invoice); // Invoice is an empty array []
    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    //const data = await sql<CustomerField>`
    const data = await connectionPool.query(`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `);

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    //<CustomersTableType>
    const data = await connectionPool.query(`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE '%${query}%' OR
        customers.email ILIKE '%${query}%'
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `);

    const customers = data.rows.map((customer : CustomersTableType) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}
*/