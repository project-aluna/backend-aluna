import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.string().transform(Number).default(3000),
  DATABASE_URL: z.string().url(),
  CORS_ORIGIN: z.string().url(),
  AUTH_PROVIDER: z.string(),
  SUPABASE_JWT_SECRET: z.string(),
  API_VERSION: z.string().default('v1'),
  LOG_LEVEL: z.enum(['info', 'warn', 'error', 'debug']).default('info'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Environment validation failed:');
  console.error(JSON.stringify(parsed.error.format(), null, 2));
  process.exit(1);
}

export const env = parsed.data;
