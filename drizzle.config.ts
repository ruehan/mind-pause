import type { Config } from 'drizzle-kit';

export default {
  schema: './app/db/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/mind_pause',
  },
  verbose: true,
  strict: true,
} satisfies Config;
