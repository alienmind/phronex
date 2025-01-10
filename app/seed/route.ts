'use server';
const connectionPool = require('../../db');
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
} from '../lib/load-data';

async function dropTables() {
  await connectionPool.query(`DROP TABLE IF EXISTS users CASCADE`);
  await connectionPool.query(`DROP TABLE IF EXISTS role CASCADE`);
  await connectionPool.query(`DROP TABLE IF EXISTS category CASCADE`);
  await connectionPool.query(`DROP TABLE IF EXISTS cost CASCADE`);
  await connectionPool.query(`DROP TABLE IF EXISTS person CASCADE`);
  await connectionPool.query(`DROP TABLE IF EXISTS projects CASCADE`);
  await connectionPool.query(`DROP TABLE IF EXISTS project_cost_period CASCADE`);
  await connectionPool.query(`DROP TABLE IF EXISTS project_person_role CASCADE`);
}

async function seedProjects() {
  await connectionPool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  await connectionPool.query(`
    CREATE TABLE IF NOT EXISTS projects (
      project_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      project_creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      project_name VARCHAR(255) NOT NULL,
      project_start_date DATE NOT NULL,
      project_end_date DATE NOT NULL,
      project_scope TEXT
    );
  `);

  const insertedProjects = await Promise.all(
    projects.map(async (project) => {
      return await connectionPool.query(`
        INSERT INTO projects (project_id, project_name, project_start_date, project_end_date, project_scope)
        VALUES ('${project.project_id}', '${project.project_name}', '${project.project_start_date}', '${project.project_end_date}', '${project.project_scope}')
        ON CONFLICT (project_id) DO NOTHING;
      `);
    }),
  );

  return insertedProjects;

}

async function seedUsers() {
  await connectionPool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  await connectionPool.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

  await connectionPool.query(`
    CREATE TABLE IF NOT EXISTS users (
      user_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      encpassword TEXT NOT NULL
    );
  `);

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      return await connectionPool.query(`
        INSERT INTO users (user_id, name, email, encpassword)
        VALUES ('${user.user_id}', '${user.name}', '${user.email}', crypt('${user.password}', gen_salt('bf',4)))
        ON CONFLICT (user_id) DO NOTHING;
      `);
    }),
  );

  return insertedUsers;
}

async function seedRoles() {
  await connectionPool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  await connectionPool.query(`
    CREATE TABLE IF NOT EXISTS role (
      role_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      role_description VARCHAR(255) NOT NULL
    );
  `);

  const insertedRoles = await Promise.all(
    roles.map(async (role) => {
      return await connectionPool.query(`
        INSERT INTO role (role_id, role_description)
        VALUES ('${role.role_id}', '${role.role_description}')
        ON CONFLICT (role_id) DO NOTHING;
      `);
    }),
  );

  return insertedRoles;
}

async function seedCategories() {
  await connectionPool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  await connectionPool.query(`
    CREATE TABLE IF NOT EXISTS category (
      category_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      category_name VARCHAR(255) NOT NULL
    );
  `);

  const insertedCategories = await Promise.all(
    categories.map(async (category) => {
      return await connectionPool.query(`
        INSERT INTO category (category_id, category_name)
        VALUES ('${category.category_id}', '${category.category_name}')
        ON CONFLICT (category_id) DO NOTHING;
      `);
    }),
  );

  return insertedCategories;
}

async function seedCosts() {
  await connectionPool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  await connectionPool.query(`
    CREATE TABLE IF NOT EXISTS cost (
      cost_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      cost_name VARCHAR(255) NOT NULL,
      category_id UUID NOT NULL,
      FOREIGN KEY (category_id) REFERENCES category(category_id)
    );
  `);

  const insertedCosts = await Promise.all(
    costs.map(async (cost) => {
      return await connectionPool.query(`
        INSERT INTO cost (cost_id, cost_name, category_id)
        VALUES ('${cost.cost_id}', '${cost.cost_name}', '${cost.category_id}')
        ON CONFLICT (cost_id) DO NOTHING;
      `);
    }),
  );

  return insertedCosts;
}

async function seedProjectCostPeriods() {
  await connectionPool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  await connectionPool.query(`
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
  `);

  const insertedProjectCosts = await Promise.all(
    projectCostPeriods.map(async (period) => {
      return await connectionPool.query(`
        INSERT INTO project_cost_period (project_id, cost_id, estimate, real, period_start, period_end)
        VALUES ('${period.project_id}', '${period.cost_id}', ${period.estimate}, ${period.real || 'NULL'}, 
                '${period.period_start}', '${period.period_end}')
        ON CONFLICT (project_id, cost_id) DO NOTHING;
      `);
    }),
  );

  return insertedProjectCosts;
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
      return await connectionPool.query(`
        INSERT INTO project_person_role (project_id, person_id, role_id)
        VALUES ('${assignment.project_id}', '${assignment.person_id}', '${assignment.role_id}')
        ON CONFLICT (project_id, person_id) DO NOTHING;
      `);
    }),
  );

  return insertedProjectPersonRoles;
}

async function seedPersons() {
  await connectionPool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  await connectionPool.query(`
    CREATE TABLE IF NOT EXISTS person (
      person_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      person_name VARCHAR(255) NOT NULL,
      person_surname VARCHAR(255) NOT NULL
    );
  `);

  const insertedPersons = await Promise.all(
    persons.map(async (person) => {
      return await connectionPool.query(`
        INSERT INTO person (person_id,person_name, person_surname)
        VALUES ('${person.person_id}', '${person.person_name}', '${person.person_surname}')
        ON CONFLICT (person_id) DO NOTHING;
      `);
    }),
  );

  return insertedPersons;
}

export async function GET() {
  try {

    // Drop all tables
    // THIS SHOULD NEVER GO TO PRODUCTION
    await dropTables();

    // First seed the independent tables
    await seedUsers();
    await seedPersons();
    await seedRoles();
    await seedCategories();
    await seedProjects();
    
    // Then seed the dependent tables
    await seedCosts();
    await seedProjectCostPeriods();
    await seedProjectPersonRoles();

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    //await connectionPool.query(`ROLLBACK`);
    return Response.json({ error }, { status: 500 });
  }
}

