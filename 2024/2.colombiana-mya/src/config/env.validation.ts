import { z } from 'zod';

export const envSchema = z.object({
  DB_NAME: z.coerce.string().min(1),
  DB_PASSWORD: z.coerce.string().min(1),
  DB_HOST: z.coerce.string().min(1),
  DB_PORT: z.coerce.number().min(1),
  DB_USERNAME: z.coerce.string().min(1),
  AUTH_JWT_SECRET: z.coerce.string().min(1),
  AUTH_JWT_EXPIRES: z.coerce.string().min(2),
});

export type TEnvSchema = z.infer<typeof envSchema>;
