import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

config();

export default defineConfig({
  dbCredentials: {
    url: process.env.DB_CONNECTION_STRING,
  },
  dialect: 'postgresql',
  schema: './src/drizzle/schemas/index.ts',
  out: './migrations',
  verbose: true,
  strict: true,
});
