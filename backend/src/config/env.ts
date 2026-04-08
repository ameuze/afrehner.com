import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3001),
  DATABASE_URL: z.string().optional(),
  PLAYWRIGHT_TESTS_DIR: z.string().default('../playwright-tests'),
  REPORTS_DIR: z.string().default('./reports'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  PORTFOLIO_URL: z.string().default('http://localhost:5173'),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('Invalid environment variables:')
  console.error(parsed.error.flatten().fieldErrors)
  process.exit(1)
}

export const env = parsed.data
