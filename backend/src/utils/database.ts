import knex from 'knex';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const knexInstance = knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'psychologist_directory',
  },
  migrations: {
    directory: path.join(__dirname, '../migrations'),
  },
  seeds: {
    directory: path.join(__dirname, '../seeds'),
  },
  pool: { min: 2, max: 10 },
  debug: process.env.NODE_ENV !== 'production',
});

export default knexInstance;
