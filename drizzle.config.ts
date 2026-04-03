import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env' });
config({ path: '.env.local', override: true });

if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL is missing. Add it to .env or .env.local before running Drizzle commands.',
  );
}

export default defineConfig({
  out: './drizzle',
  schema: './db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
