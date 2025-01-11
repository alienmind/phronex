'use server';
const connectionPool = require('@/app/lib/db');
import {
  // New
  users,
  roles,
  categories,
  costs,
  persons,
  projects,
  projectCostPeriods,
  projectPersonRoles,
} from '@/app/seed/load-data';

async function dropTables() {
  const dropQueries = [
    'DROP TABLE IF EXISTS users CASCADE',
    'DROP TABLE IF EXISTS role CASCADE',
    'DROP TABLE IF EXISTS category CASCADE',
    'DROP TABLE IF EXISTS cost CASCADE',
    'DROP TABLE IF EXISTS person CASCADE',
    'DROP TABLE IF EXISTS projects CASCADE',
    'DROP TABLE IF EXISTS project_cost_period CASCADE',
    'DROP TABLE IF EXISTS project_person_role CASCADE'
  ];

  for (const query of dropQueries) {
    console.log('Executing query:', query);
    await connectionPool.query(query);
  }
}

/*
async function seedAuthAdapterTables() {
  await connectionPool.query(`
    CREATE TABLE verification_token
    (
      identifier TEXT NOT NULL,
      expires TIMESTAMPTZ NOT NULL,
      token TEXT NOT NULL,

      PRIMARY KEY (identifier, token)
    );
  `);

  await connectionPool.query(`
    CREATE TABLE accounts
    (
      id SERIAL,
      userId INTEGER NOT NULL,
      type VARCHAR(255) NOT NULL,
      provider VARCHAR(255) NOT NULL,
      providerAccountId VARCHAR(255) NOT NULL,
      refresh_token TEXT,
      access_token TEXT,
      expires_at BIGINT,
      id_token TEXT,
      scope TEXT,
      session_state TEXT,
      token_type TEXT,
      PRIMARY KEY (id)
    );
  `);

  await connectionPool.query(`
    CREATE TABLE sessions
    (
      id SERIAL,
      userId INTEGER NOT NULL,
      expires TIMESTAMPTZ NOT NULL,
      sessionToken VARCHAR(255) NOT NULL,
      PRIMARY KEY (id)
    );
  `);

  await connectionPool.query(`
    CREATE TABLE users
    (
      id SERIAL,
      name VARCHAR(255),
      email VARCHAR(255),
      emailVerified TIMESTAMPTZ,
      image TEXT,
      PRIMARY KEY (id)
    );
  `);
}
*/

async function seedProjects() {
  const output = {
    createTable: '',
    inserts: [] as string[],
    errors: [] as string[]
  };

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS projects (
      project_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      project_creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      project_name VARCHAR(255) NOT NULL UNIQUE,
      project_start_date DATE NOT NULL,
      project_end_date DATE NOT NULL,
      project_scope TEXT,
      project_manager_id UUID NOT NULL REFERENCES person(person_id)
    );
  `;
  
  output.createTable = createTableQuery;
  await connectionPool.query(createTableQuery);

  const insertedProjects = await Promise.all(
    projects.map(async (project) => {
      const insertQuery = {
        text: `INSERT INTO projects (project_id, project_creation_date, project_name, project_start_date, project_end_date, project_scope, project_manager_id)
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
    users.map(async (user) => {
      const insertQuery = `
        INSERT INTO users (id, name, email, encpassword, emailVerified)
        VALUES ('${user.id}', '${user.name}', '${user.email}', crypt('${user.password}', gen_salt('bf',4)), current_timestamp)
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
    roles.map(async (role) => {
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
    categories.map(async (category) => {
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

async function seedCosts() {
  await connectionPool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS cost (
      cost_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      cost_name VARCHAR(255) NOT NULL,
      category_id UUID NOT NULL,
      FOREIGN KEY (category_id) REFERENCES category(category_id)
    );
  `;
  
  console.log('Executing query:', createTableQuery);
  await connectionPool.query(createTableQuery);

  const insertedCosts = await Promise.all(
    costs.map(async (cost) => {
      const insertQuery = `
        INSERT INTO cost (cost_id, cost_name, category_id)
        VALUES ('${cost.cost_id}', '${cost.cost_name}', '${cost.category_id}')
        ON CONFLICT (cost_id) DO NOTHING;
      `;
      console.log('Executing query:', insertQuery);
      try {
        return await connectionPool.query(insertQuery);
      } catch (error) {
        console.error('Failed to insert cost:', JSON.stringify(cost, null, 2));
        console.error('Error:', error);
        throw error;
      }
    }),
  );

  return insertedCosts;
}

async function seedProjectCostPeriods() {
  await connectionPool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS project_cost_period (
      project_id UUID NOT NULL,
      cost_id UUID NOT NULL,
      estimate DECIMAL(10,2) NOT NULL,
      real DECIMAL(10,2),
      period_start DATE NOT NULL,
      period_end DATE NOT NULL,
      PRIMARY KEY (project_id, cost_id),
      FOREIGN KEY (project_id) REFERENCES projects(project_id),
      FOREIGN KEY (cost_id) REFERENCES cost(cost_id)
    );
  `;
  
  console.log('Executing query:', createTableQuery);
  await connectionPool.query(createTableQuery);

  const insertedProjectCostPeriods = await Promise.all(
    projectCostPeriods.map(async (period) => {
      const insertQuery = {
        text: `
          INSERT INTO project_cost_period (project_id, cost_id, estimate, real, period_start, period_end)
          VALUES ($1,$2,$3,$4,$5,$6)
          ON CONFLICT (project_id, cost_id) DO NOTHING;
        `,
        values: [period.project_id, period.cost_id, period.estimate, period.real, period.period_start, period.period_end]
      };
      console.log('Executing query:', insertQuery.text, 'with values:', insertQuery.values);
      try {
        return await connectionPool.query(insertQuery);
      } catch (error) {
        console.error('Failed to insert project cost period:', JSON.stringify(period, null, 2));
        console.error('Error:', error);
        throw error;
      }
    }),
  );

  return insertedProjectCostPeriods;
}

async function seedProjectPersonRoles() {
  await connectionPool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  await connectionPool.query(`
    CREATE TABLE IF NOT EXISTS project_person_role (
      project_id UUID NOT NULL,
      person_id UUID NOT NULL,
      role_id UUID NOT NULL,
      PRIMARY KEY (project_id, person_id),
      FOREIGN KEY (project_id) REFERENCES projects(project_id),
      FOREIGN KEY (person_id) REFERENCES person(person_id),
      FOREIGN KEY (role_id) REFERENCES role(role_id)
    );
  `);

  const insertedProjectPersonRoles = await Promise.all(
    projectPersonRoles.map(async (assignment) => {
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
      person_surname VARCHAR(255) NOT NULL
    );
  `;
  
  console.log('Executing query:', createTableQuery);
  await connectionPool.query(createTableQuery);

  const insertedPersons = await Promise.all(
    persons.map(async (person) => {
      const insertQuery = `
        INSERT INTO person (person_id, person_name, person_surname)
        VALUES ('${person.person_id}', '${person.person_name}', '${person.person_surname}')
        ON CONFLICT (person_id) DO NOTHING;
      `;
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
      costs: {} as any,
      projectCostPeriods: {} as any,
      projectPersonRoles: {} as any,
      errors: [] as string[]
    };

    // Drop all tables
    try {
      const dropQueries = [
        'DROP TABLE IF EXISTS users CASCADE',
        'DROP TABLE IF EXISTS role CASCADE',
        'DROP TABLE IF EXISTS category CASCADE',
        'DROP TABLE IF EXISTS cost CASCADE',
        'DROP TABLE IF EXISTS person CASCADE',
        'DROP TABLE IF EXISTS projects CASCADE',
        'DROP TABLE IF EXISTS project_cost_period CASCADE',
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
      output.costs = await seedCosts();
      output.projectCostPeriods = await seedProjectCostPeriods();
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

