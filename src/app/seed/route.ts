/*
 * This file contrlols the seeding into the database with demo data
 * It is used for development purposes only
 * For the specific data, check load-data.ts
 */
'use server';
const connectionPool = require('@/app/lib/db');
import {
  // New
  users,
  roles,
  categories,
  projectExpenses,
  persons,
  projects,
  projectBudget,
  projectPersonRoles,
} from '@/app/seed/load-data';

import {
  User,
  Role,
  Category,
  ProjectExpense,
  Person,
  Project,
  ProjectBudget,
  ProjectPersonRole,
} from '@/app/lib/dataschemas';

// Drop all tables to start fresh
async function dropTables() {
  const dropQueries = [
    'DROP TABLE IF EXISTS users CASCADE',
    'DROP TABLE IF EXISTS role CASCADE',
    'DROP TABLE IF EXISTS category CASCADE',
    'DROP TABLE IF EXISTS project_expense CASCADE',
    'DROP TABLE IF EXISTS person CASCADE',
    'DROP TABLE IF EXISTS project CASCADE',
    'DROP TABLE IF EXISTS project_budget CASCADE',
    'DROP TABLE IF EXISTS project_person_role CASCADE',
    'DROP TABLE IF EXISTS role CASCADE',
  ];

  for (const query of dropQueries) {
    console.log('Executing query:', query);
    await connectionPool.query(query);
  }
}

// Seed the users table
// For this we will need to encrypt the password in the database, so we deploy
// Additionally, for this and all subsequent tables we will deploy the uuid extension
async function seedUsers() {
  await connectionPool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  await connectionPool.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      encpassword TEXT NOT NULL,
      emailVerified TIMESTAMP
    );
  `;
  
  console.log('Executing query:', createTableQuery);
  await connectionPool.query(createTableQuery);

  const insertedUsers = await Promise.all(
    users.map(async (user : User) => {
      const insertQuery = `
        INSERT INTO users (id, name, email, encpassword, emailVerified)
        VALUES ('${user.id}', '${user.name}', '${user.email}', crypt('${user.encpassword}', gen_salt('bf',4)), current_timestamp)
        ON CONFLICT (id) DO NOTHING;
      `;
      console.log('Executing query:', insertQuery);
      try {
        return await connectionPool.query(insertQuery);
      } catch (error) {
        console.error('Failed to insert user:', JSON.stringify(user, null, 2));
        console.error('Error:', error);
        throw error;
      }
    }),
  );

  return insertedUsers;
}


// Seed a set of roles
async function seedRoles() {
  await connectionPool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS role (
      role_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      role_description VARCHAR(255) NOT NULL
    );
  `;
  
  console.log('Executing query:', createTableQuery);
  await connectionPool.query(createTableQuery);

  const insertedRoles = await Promise.all(
    roles.map(async (role : Role) => {
      const insertQuery = `
        INSERT INTO role (role_id, role_description)
        VALUES ('${role.role_id}', '${role.role_name}')
        ON CONFLICT (role_id) DO NOTHING;
      `;
      console.log('Executing query:', insertQuery);
      try {
        return await connectionPool.query(insertQuery);
      } catch (error) {
        console.error('Failed to insert role:', JSON.stringify(role, null, 2));
        console.error('Error:', error);
        throw error;
      }
    }),
  );

  return insertedRoles;
}

// Seed a set of categories for the expenses
async function seedCategories() {
  await connectionPool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS category (
      category_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      category_name VARCHAR(255) NOT NULL
    );
  `;
  
  console.log('Executing query:', createTableQuery);
  await connectionPool.query(createTableQuery);

  const insertedCategories = await Promise.all(
    categories.map(async (category : Category) => {
      const insertQuery = `
        INSERT INTO category (category_id, category_name)
        VALUES ('${category.category_id}', '${category.category_name}')
        ON CONFLICT (category_id) DO NOTHING;
      `;
      console.log('Executing query:', insertQuery);
      try {
        return await connectionPool.query(insertQuery);
      } catch (error) {
        console.error('Failed to insert category:', JSON.stringify(category, null, 2));
        console.error('Error:', error);
        throw error;
      }
    }),
  );

  return insertedCategories;
}

// Seed a set of expenses for a project
async function seedProjectExpenses() {
  await connectionPool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS project_expense (
      expense_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      project_id UUID NOT NULL,
      category_id UUID NOT NULL,
      expense_name VARCHAR(255) NOT NULL,
      expense_date TIMESTAMP NOT NULL,
      expense_value DECIMAL(10,2) NOT NULL,
      FOREIGN KEY (project_id) REFERENCES project(project_id),
      FOREIGN KEY (category_id) REFERENCES category(category_id)
    );
  `;
  
  console.log('Executing query:', createTableQuery);
  await connectionPool.query(createTableQuery);

  const insertedProjectExpenses = await Promise.all(
    projectExpenses.map(async (expense : ProjectExpense) => {
      const insertQuery = {
        text: `INSERT INTO project_expense (expense_id, project_id, category_id, expense_name, expense_date, expense_value) 
        VALUES ($1,$2,$3,$4,$5,$6)
        ON CONFLICT (expense_id) DO NOTHING;
      `,
        values: [expense.expense_id, expense.project_id, expense.category_id, expense.expense_name, expense.expense_date, expense.expense_value]
      };
      console.log('Executing query:', insertQuery);
      try {
        return await connectionPool.query(insertQuery);
      } catch (error) {
        console.error('Failed to insert project expense:', JSON.stringify(expense, null, 2));
        console.error('Error:', error);
        throw error;
      }
    }),
  );

  return insertedProjectExpenses;
}

async function seedProjectBudget() {
  await connectionPool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS project_budget (
      project_id UUID NOT NULL,
      category_id UUID NOT NULL,
      project_category_budget DECIMAL(10,2) NOT NULL,
      PRIMARY KEY (project_id, category_id),
      FOREIGN KEY (project_id) REFERENCES project(project_id),
      FOREIGN KEY (category_id) REFERENCES category(category_id)
    );
  `;
  
  console.log('Executing query:', createTableQuery);
  await connectionPool.query(createTableQuery);

  const insertedProjectBudget = await Promise.all(
    projectBudget.map(async (budget : ProjectBudget) => {
      const insertQuery = {
        text: `
          INSERT INTO project_budget (project_id, category_id, project_category_budget)
          VALUES ($1,$2,$3)
          ON CONFLICT (project_id, category_id) DO NOTHING;
        `,
        values: [budget.project_id, budget.category_id, budget.project_category_budget]
      };
      console.log('Executing query:', insertQuery.text, 'with values:', insertQuery.values);
      try {
        return await connectionPool.query(insertQuery);
      } catch (error) {
        console.error('Failed to insert project budget:', JSON.stringify(budget, null, 2));
        console.error('Error:', error);
        throw error;
      }
    }),
  );

  return insertedProjectBudget;
}

async function seedProjectPersonRoles() {
  await connectionPool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  await connectionPool.query(`
    CREATE TABLE IF NOT EXISTS project_person_role (
      project_id UUID NOT NULL,
      person_id UUID NOT NULL,
      role_id UUID NOT NULL,
      PRIMARY KEY (project_id, person_id),
      FOREIGN KEY (project_id) REFERENCES project(project_id),
      FOREIGN KEY (person_id) REFERENCES person(person_id),
      FOREIGN KEY (role_id) REFERENCES role(role_id)
    );
  `);

  const insertedProjectPersonRoles = await Promise.all(
    projectPersonRoles.map(async (assignment : ProjectPersonRole) => {
      try {
        return await connectionPool.query(`
          INSERT INTO project_person_role (project_id, person_id, role_id)
          VALUES ('${assignment.project_id}', '${assignment.person_id}', '${assignment.role_id}')
          ON CONFLICT (project_id, person_id) DO NOTHING;
        `);
      } catch (error) {
        console.error('Failed to insert project person role:', JSON.stringify(assignment, null, 2));
        console.error('Error:', error);
        throw error;
      }
    }),
  );

  return insertedProjectPersonRoles;
}

async function seedPersons() {
  await connectionPool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS person (
      person_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      person_name VARCHAR(255) NOT NULL,
      person_surname VARCHAR(255) NOT NULL,
      person_email VARCHAR(255) NOT NULL
    );
  `;
  
  console.log('Executing query:', createTableQuery);
  await connectionPool.query(createTableQuery);

  const insertedPersons = await Promise.all(
    persons.map(async (person : Person) => {
      const insertQuery = {
        text: `INSERT INTO person (person_id, person_name, person_surname, person_email)
        VALUES ($1,$2,$3,$4)
        ON CONFLICT (person_id) DO NOTHING;`,
        values: [person.person_id, person.person_name, person.person_surname, person.person_email]
      };
      console.log('Executing query:', insertQuery);
      try {
        return await connectionPool.query(insertQuery);
      } catch (error) {
        console.error('Failed to insert person:', JSON.stringify(person, null, 2));
        console.error('Error:', error);
        throw error;
      }
    }),
  );

  return insertedPersons;
}

export async function GET() {
  try {
    const output = {
      dropTables: [] as string[],
      projects: {} as any,
      users: {} as any,
      persons: {} as any,
      roles: {} as any,
      categories: {} as any,
      projectExpenses: {} as any,
      projectBudget: {} as any,
      projectPersonRoles: {} as any,
      errors: [] as string[]
    };

    // Drop all tables
    try {
      const dropQueries = [
        'DROP TABLE IF EXISTS users CASCADE',
        'DROP TABLE IF EXISTS role CASCADE',
        'DROP TABLE IF EXISTS category CASCADE',
        'DROP TABLE IF EXISTS project_expense CASCADE',
        'DROP TABLE IF EXISTS person CASCADE',
        'DROP TABLE IF EXISTS project CASCADE',
        'DROP TABLE IF EXISTS project_budget CASCADE',
        'DROP TABLE IF EXISTS project_person_role CASCADE'
      ];

      for (const query of dropQueries) {
        output.dropTables.push(query);
        await connectionPool.query(query);
      }
    } catch (error) {
      output.errors.push(`Drop tables error: ${error}`);
    }

    // First seed the independent tables
    try {
      output.users = await seedUsers();
      output.persons = await seedPersons();
      output.roles = await seedRoles();
      output.categories = await seedCategories();
      output.projects = await seedProjects();
    } catch (error) {
      output.errors.push(`Independent tables error: ${error}`);
    }
    
    // Then seed the dependent tables
    try {
      output.projectExpenses = await seedProjectExpenses();
      output.projectBudget = await seedProjectBudget();
      output.projectPersonRoles = await seedProjectPersonRoles();
    } catch (error) {
      output.errors.push(`Dependent tables error: ${error}`);
    }

    return Response.json(output);
  } catch (error) {
    return Response.json({ 
      error: 'Database seeding failed',
      details: error 
    }, { 
      status: 500 
    });
  }
}


// Seed the projects table
async function seedProjects() {
  const output = {
    createTable: '',
    inserts: [] as string[],
    errors: [] as string[]
  };

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS project (
      project_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      project_name VARCHAR(255) NOT NULL UNIQUE,
      project_scope TEXT,
      project_creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      project_start_date DATE NOT NULL,
      project_end_date DATE NOT NULL,
      project_manager_id UUID NOT NULL REFERENCES person(person_id)
    );
  `;
  
  output.createTable = createTableQuery;
  await connectionPool.query(createTableQuery);

  const insertedProjects = await Promise.all(
    projects.map(async (project) => {
      const insertQuery = {
        text: `INSERT INTO project (project_id, project_creation_date, project_name, project_start_date, project_end_date, project_scope, project_manager_id)
               VALUES ($1, current_timestamp, $2, $3, $4, $5, $6)
               ON CONFLICT (project_id) DO NOTHING`,
        values: [project.project_id, project.project_name, project.project_start_date, project.project_end_date, project.project_scope, project.project_manager_id]
      };
      
      output.inserts.push(`${insertQuery.text} [${insertQuery.values.join(', ')}]`);
      try {
        return await connectionPool.query(insertQuery);
      } catch (error) {
        const errorMsg = `Failed to insert project: ${JSON.stringify(project)} Error: ${error}`;
        output.errors.push(errorMsg);
        throw error;
      }
    }),
  );

  return output;
}


