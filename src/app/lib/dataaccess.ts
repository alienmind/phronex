/*
 * This file contains the data access functions for the database
 * All of the database abstractions are here
 * 
 * Note that this file is not intended to be used in the client components
 * Any attempt to "use client" will cause an error
 * 
 * In order to get access to these functions, you need wrap them in a server action or in a API
 */
import type { User, Project, ProjectExpense, ProjectBudget, ProjectPersonRole, ProjectResource, ProjectWithProjectManager, ProjectExpensesCategoryBudgetTableView, ProjectResourceTableView } from '@/app/lib/dataschemas';

const connectionPool = require('@/app/lib/db');

const logQuery = async (query: string | { text: string, values: any[] }, values?: any[]) => {
  const queryText = typeof query === 'string' ? query : query.text;
  const queryValues = typeof query === 'string' ? values : query.values;
  
  console.log('\n=== Database Query ===');
  console.log('SQL:', queryText);
  console.log('Values:', queryValues);
  
  try {
    const result = await connectionPool.query(query, values);
    console.log('Result rows:', result.rows);
    console.log('Row count:', result.rowCount);
    console.log('===================\n');
    return result;
  } catch (error) {
    console.error('Query Error:', error);
    throw error;
  }
};

/*
 * This is the authentication flow for a user. It will match the provided username and password against the database
 * In order to avoid the client to depend on bcrypt() we use the pgcrypto extension to store and check the password
 * 
 * The authentication SQL flow with PostgreSQL requires this to be done right:
 * 1) Set up the database (see load-data.ts) with the extension pgcrypto
 *   CREATE EXTENSION pgcrypto;
 * 
 * 2) The following command encodes a password "mypasss" with a salt of 4 rounds of blowfish (increase to 8 in prod)
 *   SELECT crypt('mypass', gen_salt('bf', 4));
 * 
 * 3) The following insert will store the encoded password in the database 
 *   INSERT INTO users (user_id,enc_pass) VALUES (1,crypt('mypass', gen_salt('bf', 4)));
 * 
 * 4) The following query will check if the password is correct
 *   SELECT * FROM users WHERE email='test@test.com' and encpass = crypt('plain_password', encpass)
 */
export async function getUser(email: string, password: string): Promise<User | undefined> {
  try {
    const user = await logQuery(`SELECT * FROM users WHERE email='${email}' and encpassword = crypt('${password}', encpassword)`);
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

/*
 * This is the function to add a project to the database
 * It will insert the project into the project table
 * 
 * FIXME - It should also insert the project manager into the project_person_role table
 * 
 * Note that id and creation date are omitted as will be auto-generated by the database
 */
export async function addProject(project: Project) {
  // Insert data into the database
  try {
    await logQuery({
      text: `INSERT INTO project (
        project_name, 
        project_scope,
        project_start_date, 
        project_end_date, 
        project_manager_id
      ) VALUES ($1, $2, $3, $4, $5)`,
      values: [
        project.project_name,
        project.project_scope,
        project.project_start_date,
        project.project_end_date,
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

/*
 * This is the function to update a project in the database
 */
export async function updateProject(data: Project) {
  await logQuery({
    text: `UPDATE project SET project_name = $1, project_scope = $2, project_start_date = $3, project_end_date = $4, project_manager_id = $5 WHERE project_id = $6`,
    values: [data.project_name, data.project_scope, data.project_start_date, data.project_end_date, data.project_manager_id, data.project_id]
  });
  await logQuery("COMMIT");
}

/*
 * This is the function to fetch the most recent projects from the database
 * It will return the projects in the projects table
 * It will also join the person table to get the project manager's name
 */
export async function fetchMostRecentProjects(limit?: number) : Promise<ProjectWithProjectManager[]> {
  try {
    if (limit && limit <= 0) {
      limit = undefined;
    }
    const data = await logQuery({
      text: `
        SELECT a.project_id, project_creation_date, project_name, project_start_date, project_end_date,
           project_scope, person_name, person_surname
        FROM project a
        LEFT OUTER JOIN person b on a.project_manager_id = b.person_id
        ORDER BY a.project_start_date DESC
        ${limit ? `LIMIT ${limit}` : ''}
      `,
      values: []
    });

    return data.rows.map((project: ProjectWithProjectManager) => ({
      ...project,
    }));
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch most recent projects.');
  }
}

/*
 * This will fetch a single project by its id
 * It will return the project in the projects table combined with the project manager's name
 * It will also join the person table to get the project manager's name
 */
export async function fetchProjectById(id: string) : Promise<ProjectWithProjectManager> {
  try {
    const result = await logQuery({
      text: `
        SELECT p.*, 
               person.person_name, 
               person.person_surname
        FROM project p
        LEFT JOIN person ON p.project_manager_id = person.person_id
        WHERE p.project_id = $1
      `,
      values: [id]
    });
    return result.rows[0] as ProjectWithProjectManager;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch project.');
  }
}

/*
 * This will fetch the project expenses (for one concrete project) combined for the budget for each category
 * It will include the individual expenses and the budgeted amount
 * This will enable the frontend to display the individual expenses and which expenses belong to categories
 * that are close to being spent
 * 
 * It does add a fake "all_columns" with all the columns concatenated to enable the filtering by any text
 */
export async function fetchProjectExpensesAndBudget(id: string, expenses_start_date: Date, expenses_end_date: Date) : Promise<ProjectExpensesCategoryBudgetTableView[]> {
  try {
    const query = {
      text: `
        SELECT a.expense_id, a.expense_name, a.expense_date, a.expense_value, c.category_name, b.project_category_budget,
               a.expense_id || ' ' || a.expense_name || ' ' || a.expense_date || ' ' || a.expense_value || ' ' || c.category_name || ' ' || b.project_category_budget
               as all_columns
        FROM project_expense a
        LEFT OUTER JOIN project_budget b ON (a.project_id = b.project_id and a.category_id = b.category_id)
        LEFT OUTER JOIN category c ON b.category_id = c.category_id
        WHERE a.project_id = $1
        AND a.expense_date > $2
        AND a.expense_date < $3
        ORDER BY a.expense_date DESC
      `,
      values: [id, (expenses_start_date ? expenses_start_date : '1900-01-01'), (expenses_end_date ? expenses_end_date : '2100-01-01')]
    };
    
    console.log('Executing query:', query.text);
    console.log('With values:', query.values);
    
    const result = await connectionPool.query(query);
    console.log('Query result:', result.rows);
    
    return result.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch project expenses.');
  }
}

/*
 * This is the function to fetch the resources assigned to a project
 * @param id - the id of the project
 */
export async function fetchResourcesForProjectId(id: string, role?: string) : Promise<ProjectResourceTableView[]> {
  try {
    const query = {
      text: `
        SELECT person_name || ' ' || person_surname as person_name, role_description, b.person_id,
               person_name || ' ' || person_surname || role_description as all_columns
        FROM project a
        JOIN project_person_role b on a.project_id = b.project_id
        JOIN role c on b.role_id = c.role_id
        JOIN person d on b.person_id = d.person_id
        WHERE a.project_id = $1
        ${role ? 'AND c.role_description = $2' : ''}
      `,
      values: role ? [id, role] : [id]
    };
    
    const result = await connectionPool.query(query);
    return result.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch project resources.');
  }
}

/*
 * This is the function to fetch the persons from the database
 * It will return the persons in the person table
 * It is mostly used from the persons API to fill out dynamically any resource assignment select box
 */
export async function fetchPersons() {
  try {
    const data = await logQuery({
      text: `
        SELECT person_id, person_name, person_surname, person_email,
               person_id || ' ' || person_name || ' ' || person_surname || ' ' || COALESCE(person_email, '') as all_columns
        FROM person 
        ORDER BY person_surname, person_name
      `,
      values: []
    });
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch persons.');
  }
}

export async function fetchRoles() {
  try {
    const result = await logQuery({
      text: `
        SELECT role_id, role_description
        FROM role
        ORDER BY role_description
      `,
      values: []
    });
    return result.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch roles.');
  }
}

export async function fetchCategories() {
  try {
    const result = await logQuery({
      text: `
        SELECT category_id, category_name
        FROM category
        ORDER BY category_name
      `,
      values: []
    });
    return result.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch categories.');
  }
}

// Add this function to handle expense updates
export async function updateExpense(id: string, data: Partial<ProjectExpense>) {
  try {
    const result = await logQuery({
      text: `
        UPDATE project_expense 
        SET 
          expense_name = COALESCE($1, expense_name),
          expense_value = COALESCE($2, expense_value),
          expense_date = COALESCE($3, expense_date)
        WHERE expense_id = $4
        RETURNING *;
      `,
      values: [data.expense_name, data.expense_value, data.expense_date, id]
    });

    if (result.rows.length === 0) {
      throw new Error('Expense not found');
    }

    return result.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to update expense');
  }
} 

export async function createExpense(data: Partial<ProjectExpense>) {
  try {
    const result = await logQuery({
      text: `
        INSERT INTO project_expense (
          project_id,
          expense_name,
          expense_value,
          expense_date,
          category_id
        ) VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `,
      values: [
        data.project_id,
        data.expense_name,
        data.expense_value,
        data.expense_date || new Date(),
        data.category_id
      ]
    });

    return result.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to create expense');
  }
} 

