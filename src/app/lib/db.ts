/*
 * This file contains the connection to the database
 * It is used by the dataaccess.ts module to fetch data
 * 
 * It wrappers the Pool() object from the pg library
 * to provide a reusable connection pool to the database
 * 
 * This avoid leaking connection handles to the database
 * 
 * IMPORTANT: Dependency on .env file that must be set up in the project root
 * Check dot-env-example
 */
const { Pool } = require('pg');
require ('dotenv').config();

const connectionPool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

module.exports = connectionPool;