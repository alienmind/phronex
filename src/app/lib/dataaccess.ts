/*
 * This file contains the data access functions for the database
 * All of the database abstractions are here
 * 
 * Note that this file is not intended to be used in the client components
 * Any attempt to "use client" will cause an error
 * 
 * In order to get access to these functions, you need wrap them in a server action or in a API
 */
import type { User, Project, ProjectExpense, Person,
              VProjectResources, VProjectWithProjectManager,
              VProjectExpensesWithCategoryBudget,
              VProjectBudgetReport,
              VPerson,
              Category,
              Role,
              VRole,
              VCategory
} from '@/app/lib/dataschemas';

const connectionPool = require('@/app/lib/db');

/*
 * This generic function runs a query and logs it to the console
 * It will also return the result of the query
 */
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

/********************************* PROJECT MANAGEMENT *********************************/

/*
 * This is the function to add a project to the database
 * It will insert the project into the project table
 * 
 * FIXME - It should also insert the project manager into the project_person_role table
 * 
 * Note that id and creation date are omitted as will be auto-generated by the database
 */
export async function createProject(project: Project) {
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
    const query = {
      text: `
      UPDATE project SET project_name = $1, project_scope = $2,
      project_start_date = $3, project_end_date = $4, project_manager_id = $5
      WHERE project_id = $6`,
      values: [data.project_name, data.project_scope, data.project_start_date, data.project_end_date, data.project_manager_id, data.project_id]
    };
    await connectionPool.query(query);
    await connectionPool.query("COMMIT");
}

/*
 * This is the function to fetch the most expensive projects in terms of expenses
 * It will return the projects in the projects table
 * It will also join the person table to get the project manager's name
 * 
 * It allows for a limit and a search term
 */
export async function fetchTopProjects(limit?: number, search?: string) {
  try {
    limit = limit || 100
    const query = {
      text: `
        SELECT 
          p.project_id,
          p.project_name,
          p.project_scope,
          p.project_start_date,
          p.project_end_date,
          COALESCE(SUM(e.expense_value), 0) as total_spent,
          COALESCE(SUM(pb.project_category_budget), 0) as total_budget
        FROM project p
        LEFT JOIN project_expense e ON p.project_id = e.project_id
        LEFT JOIN project_budget pb ON p.project_id = pb.project_id
        WHERE 
          CASE 
            WHEN $2::text IS NOT NULL THEN 
              LOWER(p.project_name) LIKE LOWER($2) OR 
              LOWER(COALESCE(project_name, '')) LIKE LOWER($2)
            ELSE true
          END
        GROUP BY 
          p.project_id, 
          p.project_name,
          p.project_scope,
          p.project_start_date,
          p.project_end_date
        ORDER BY total_spent DESC
        LIMIT $1
      `,
      values: [limit, search ? `%${search}%` : null],
    };

    const { rows } = await logQuery(query);
    return rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch projects');
  }
}

/*
 * This will fetch a single project by its id
 * It will return the project in the projects table combined with the project manager's name
 * It will also join the person table to get the project manager's name
 */
export async function fetchProjectById(id: string) : Promise<VProjectWithProjectManager> {
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
    return result.rows[0] as VProjectWithProjectManager;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch project.');
  }
}


/********************************* PROJECT EXPENSES *********************************/

/*
 * This will fetch the project expenses (for one concrete project) combined for the budget for each category
 * It will include the individual expenses and the budgeted amount
 * This will enable the frontend to display the individual expenses and which expenses belong to categories
 * that are close to being spent
 * 
 * It does add a fake "all_columns" with all the columns concatenated to enable the filtering by any text
 */
export async function fetchProjectExpensesAndBudget(id: string, expenses_start_date: Date, expenses_end_date: Date) : Promise<VProjectExpensesWithCategoryBudget[]> {
  try {
    const query = {
      text: `
        SELECT a.expense_id, a.expense_name, a.expense_date, a.expense_value, c.category_id, c.category_name, b.project_category_budget, b.project_id,
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
    
    const result = await logQuery(query);
    return result.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch project expenses.');
  }
}

// Update an expense
export async function updateExpense(id: string, data: Partial<ProjectExpense>) {
  try {
    const result = await logQuery(`
      UPDATE project_expense 
      SET 
        expense_name = COALESCE($1, expense_name),
        expense_value = COALESCE($2, expense_value),
        expense_date = COALESCE($3, expense_date),
        category_id = COALESCE($4, category_id)
      WHERE expense_id = $5
      RETURNING *;
    `, [data.expense_name, data.expense_value, data.expense_date, data.category_id, id]);

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

export async function deleteExpense(id: string) {
  try {
    const result = await logQuery({
      text: `
        DELETE FROM project_expense 
        WHERE expense_id = $1
        RETURNING *;
      `,
      values: [id]
    });

    if (result.rows.length === 0) {
      throw new Error('Expense not found');
    }

    return result.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to delete expense');
  }
}

export async function fetchProjectBudgetReport(id: string, start_date?: Date, end_date?: Date) : Promise<VProjectBudgetReport[]> {
  try {
    const query = {
      text: `
        SELECT c.category_id, c.category_name, b.project_category_budget as budget, sum(a.expense_value) as spent
        FROM project_expense a
        LEFT OUTER JOIN project_budget b ON (a.project_id = b.project_id and a.category_id = b.category_id)
        LEFT OUTER JOIN category c ON b.category_id = c.category_id
        WHERE a.project_id = $1
        AND a.expense_date > $2
        AND a.expense_date < $3
        GROUP BY c.category_id, c.category_name, b.project_category_budget
        ORDER BY budget desc, category_name
      `,
      values: [id, (start_date ? start_date : '1900-01-01'), (end_date ? end_date : '2100-01-01')]
    };
    const result = await connectionPool.query(query);
    return result.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch project expenses.');
  }
}


/********************************* PROJECT RESOURCES *********************************/

/*
 * This is the function to fetch the resources assigned to a project
 * @param id - the id of the project
 */
export async function fetchResourcesForProjectId(id: string, role?: string): Promise<VProjectResources[]> {
  try {
    const query = {
      text: `
        SELECT a.project_id, b.person_id, person_name, person_surname, person_name || ' ' || person_surname as person_name_surname,
               c.role_id, c.role_description,
               person_name || ' ' || person_surname || role_description as all_columns,
               a.project_id || '_' || b.person_id as composite_id
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
 * This is the function to update a project resource
 * It will update the role assignment and return the updated resource
 * The action can come either for having changed the role or the person
 */
export async function updateProjectResource(projectId: string, personId: string, data: Partial<VProjectResources>) {
  try {
    let result;

    if (data.role_id) {
      // Handle direct role_id update
      result = await logQuery(`
        UPDATE project_person_role 
        SET role_id = $1
        WHERE project_id = $2 AND person_id = $3
        RETURNING *;
      `, [data.role_id, projectId, personId]);
   } else if (data.person_id) {
      // Handle person reassignment
      result = await logQuery(`
        UPDATE project_person_role 
        SET person_id = $1
        WHERE project_id = $2 AND person_id = $3
        RETURNING *;
      `, [data.person_id, projectId, personId]);

      // If the person has been reassigned that's the value we need to use
      personId = data.person_id;
    }

    if (!result || result.rows.length === 0) {
      throw new Error('Project resource not found');
    }

    // Fetch the updated resource with all fields
    const updatedResource = await logQuery(`
      SELECT 
        ppr.project_id,
        p.person_id,
        p.person_name,
        p.person_surname,
        p.person_name || ' ' || p.person_surname as person_name_surname,
        r.role_id,
        r.role_description,
        ppr.project_id || '_' || ppr.person_id as composite_id,
        CONCAT(p.person_name, ' ', p.person_surname, ' ', r.role_description) as all_columns
      FROM project_person_role ppr
      JOIN person p ON p.person_id = ppr.person_id
      JOIN role r ON r.role_id = ppr.role_id
      WHERE ppr.project_id = $1 AND ppr.person_id = $2
    `, [projectId, personId]);

    return updatedResource.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to update project resource');
  }
}

export async function createProjectResource(data: Partial<VProjectResources>) {
  try {
    // First insert the role assignment
    const result = await logQuery(`
      INSERT INTO project_person_role (project_id, person_id, role_id)
      VALUES (
        $1,
        $2,
        (SELECT role_id FROM role WHERE role_description = $3)
      )
      RETURNING *;
    `, [data.project_id, data.person_id, data.role_description]);

    // Then fetch the complete resource data
    const newResource = await logQuery(`
      SELECT 
        ppr.project_id,
        p.person_id,
        p.person_name,
        p.person_surname,
        r.role_id,
        r.role_description,
        CONCAT(p.person_name, ' ', p.person_surname, ' ', r.role_description) as all_columns,
        ppr.project_id || '_' || ppr.person_id as composite_id
      FROM project_person_role ppr
      JOIN person p ON p.person_id = ppr.person_id
      JOIN role r ON r.role_id = ppr.role_id
      WHERE ppr.project_id = $1 AND ppr.person_id = $2
    `, [data.project_id, data.person_id]);

    return newResource.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to create project resource');
  }
}

export async function deleteProjectResource(projectId: string, personId: string) {
  try {
    const result = await logQuery(`
      DELETE FROM project_person_role
      WHERE project_id = $1 AND person_id = $2
      RETURNING *;
    `, [projectId, personId]);

    if (result.rows.length === 0) {
      throw new Error('DELETE Project resource not found');
    }

    return result.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to delete project resource');
  }
}



/********************************* PERSONS *********************************/

/*
 * This is the function to fetch the persons from the database
 * It will return the persons in the person table
 * It is mostly used from the persons API to fill out dynamically any resource assignment select box
 */
export async function fetchPersons() : Promise<VPerson[]> {
  try {
    const query = `
      SELECT person_id, person_name, person_surname, person_email, person_name || ' ' || person_surname as person_name_surname,
             person_id || ' ' || person_name || ' ' || person_surname || ' ' || COALESCE(person_email, '') as all_columns
      FROM person 
      ORDER BY person_surname, person_name
    `;
    
    const data = await connectionPool.query(query);
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch persons.');
  }
}

export async function updatePerson(personId: string, data: Partial<VPerson>) {
  try {
    const result = await logQuery(`
      UPDATE person 
      SET 
        person_name = COALESCE($1, person_name),
        person_surname = COALESCE($2, person_surname),
        person_email = COALESCE($3, person_email)
      WHERE person_id = $4
      RETURNING *;
    `, [data.person_name, data.person_surname, data.person_email, personId]);

    if (result.rows.length === 0) {
      throw new Error('Person not found');
    }

    // Fetch the updated person with all fields
    const updatedPerson = await logQuery(`
      SELECT 
        person_id,
        person_name,
        person_surname,
        person_email,
        person_id || ' ' || person_name || ' ' || person_surname || ' ' || COALESCE(person_email, '') as all_columns
      FROM person
      WHERE person_id = $1
    `, [personId]);

    return updatedPerson.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to update person');
  }
}

export async function createPerson(data: Partial<VPerson>) {
  try {
    const result = await logQuery(`
      INSERT INTO person (person_name, person_surname, person_email)
      VALUES ($1, $2, $3)
      RETURNING *;
    `, [data.person_name, data.person_surname, data.person_email]);

    // Fetch the complete person data
    const newPerson = await logQuery(`
      SELECT 
        person_id,
        person_name,
        person_surname,
        person_email,
        person_id || ' ' || person_name || ' ' || person_surname || ' ' || COALESCE(person_email, '') as all_columns
      FROM person
      WHERE person_id = $1
    `, [result.rows[0].person_id]);

    return newPerson.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to create person');
  }
}

export async function deletePerson(personId: string) : Promise<VPerson> {
  try {
    const result = await logQuery(`
      DELETE FROM person
      WHERE person_id = $1
      RETURNING *;
    `, [personId]);

    if (result.rows.length === 0) {
      throw new Error('Person not found');
    }

    return result.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to delete person');
  }
}


/********************************* ROLES *********************************/

export async function fetchRoles() : Promise<Role[]> {
  try {
    const query = `
      SELECT role_id, role_description
      FROM role
      ORDER BY role_description
    `;
    
    const result = await connectionPool.query(query);
    return result.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch roles.');
  }
}

export async function updateRole(roleId: string, data: Partial<VRole>) {
  try {
    const result = await logQuery(`
      UPDATE role 
      SET role_description = COALESCE($1, role_description)
      WHERE role_id = $2
      RETURNING *;
    `, [data.role_description, roleId]);

    if (result.rows.length === 0) {
      throw new Error('Role not found');
    }

    // Fetch the updated role with all fields
    const updatedRole = await logQuery(`
      SELECT 
        role_id,
        role_description,
        role_description as all_columns
      FROM role
      WHERE role_id = $1
    `, [roleId]);

    return updatedRole.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to update role');
  }
}

export async function createRole(data: Partial<VRole>) {
  try {
    const result = await logQuery(`
      INSERT INTO role (role_description)
      VALUES ($1)
      RETURNING *;
    `, [data.role_description]);

    // Fetch the complete role data
    const newRole = await logQuery(`
      SELECT 
        role_id,
        role_description,
        role_description as all_columns
      FROM role
      WHERE role_id = $1
    `, [result.rows[0].role_id]);

    return newRole.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to create role');
  }
}

export async function deleteRole(roleId: string) {
  try {
    const result = await logQuery(`
      DELETE FROM role
      WHERE role_id = $1
      RETURNING *;
    `, [roleId]);

    if (result.rows.length === 0) {
      throw new Error('Role not found');
    }

    return result.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to delete role');
  }
}

/********************************* CATEGORIES *********************************/

export async function fetchCategories() : Promise<Category[]> {
  try {
    const query = `
      SELECT category_id, category_name
      FROM category
      ORDER BY category_name
    `;
    
    const result = await connectionPool.query(query);
    return result.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch categories.');
  }
}

export async function updateCategory(categoryId: string, data: Partial<VCategory>) {
  try {
    const result = await logQuery(`
      UPDATE category 
      SET category_name = COALESCE($1, category_name)
      WHERE category_id = $2
      RETURNING *;
    `, [data.category_name, categoryId]);

    if (result.rows.length === 0) {
      throw new Error('Category not found');
    }

    // Fetch the updated category with all fields
    const updatedCategory = await logQuery(`
      SELECT 
        category_id,
        category_name,
        category_name as all_columns
      FROM category
      WHERE category_id = $1
    `, [categoryId]);

    return updatedCategory.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to update category');
  }
}

export async function createCategory(data: Partial<VCategory>) {
  try {
    const result = await logQuery(`
      INSERT INTO category (category_name)
      VALUES ($1)
      RETURNING *;
    `, [data.category_name]);

    // Fetch the complete category data
    const newCategory = await logQuery(`
      SELECT 
        category_id,
        category_name,
        category_name as all_columns
      FROM category
      WHERE category_id = $1
    `, [result.rows[0].category_id]);

    return newCategory.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to create category');
  }
}

export async function deleteCategory(categoryId: string) {
  try {
    const result = await logQuery(`
      DELETE FROM category
      WHERE category_id = $1
      RETURNING *;
    `, [categoryId]);

    if (result.rows.length === 0) {
      throw new Error('Category not found');
    }

    return result.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to delete category');
  }
}

export async function updateProjectCategoryBudget(
  projectId: string,
  categoryId: string,
  budget: number
): Promise<void> {
  console.log("UPSERT project_budget", projectId, categoryId, budget)
  const sql = `
    INSERT INTO project_budget (project_id, category_id, project_category_budget) 
    VALUES ($1, $2, $3)
    ON CONFLICT (project_id, category_id) DO UPDATE SET project_category_budget = $3
  `;
  await logQuery(sql, [projectId, categoryId, budget]);
}

export async function deleteProject(id: string) {
  try {
    const result = await logQuery({
      text: 'DELETE FROM project WHERE project_id = $1 RETURNING *',
      values: [id],
    });

    if (result.rows.length === 0) {
      throw new Error('Project not found');
    }

    return result.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to delete project');
  }
}

export async function fetchProjects(limit: number = 0) {
  try {
    const query = {
      text: `
        SELECT 
          p.project_id,
          p.project_name,
          p.project_scope,
          p.project_start_date,
          p.project_end_date,
          COALESCE(SUM(pb.project_category_budget), 0) as total_budget,
          COALESCE(SUM(e.expense_value), 0) as total_spent
        FROM project p
        LEFT JOIN project_budget pb ON p.project_id = pb.project_id
        LEFT JOIN project_expense e ON p.project_id = e.project_id
        GROUP BY p.project_id, p.project_name, p.project_scope, p.project_start_date, p.project_end_date
        ORDER BY p.project_id DESC
        ${limit ? 'LIMIT $1' : ''}
      `,
      values: limit ? [limit] : [],
    };

    const result = await logQuery(query);
    return result.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch projects');
  }
}