import knex from 'knex';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Knex with PostgreSQL if DATABASE_URL is set, otherwise fallback to SQLite
const db = knex(
  process.env.DATABASE_URL
    ? {
        client: 'pg',
        connection: process.env.DATABASE_URL,
        searchPath: ['knex', 'public'],
      }
    : {
        client: 'sqlite3',
        connection: {
          filename: path.join(__dirname, 'database.sqlite')
        },
        useNullAsDefault: true
      }
);

export default db;
