import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z
  .object({
    PORT: z.coerce.number().default(5000),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    AI_PROVIDER: z.enum(['pollinations', 'replicate']).default('pollinations'),
    REPLICATE_API_TOKEN: z.string().optional(),
    CORS_ORIGIN: z.string().default('http://localhost:5173'),
    // Optional: imgbb API key for uploading reference images used by Pollinations.
    // Without it Pollinations generates from text prompt only (no room photo reference).
    // Get a free key at https://api.imgbb.com/
    IMGBB_API_KEY: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.AI_PROVIDER === 'replicate') {
      const token = data.REPLICATE_API_TOKEN;
      if (!token) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['REPLICATE_API_TOKEN'],
          message:
            'REPLICATE_API_TOKEN required when AI_PROVIDER=replicate. Get one at https://replicate.com/account/api-tokens',
        });
      } else if (token.includes('your_token') || !token.startsWith('r8_')) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['REPLICATE_API_TOKEN'],
          message: 'REPLICATE_API_TOKEN looks invalid. It must start with "r8_".',
        });
      }
    }
  });

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('');
  console.error('❌ Invalid environment variables:');
  for (const issue of parsed.error.issues) {
    console.error(`   • ${issue.path.join('.')}: ${issue.message}`);
  }
  console.error('');
  console.error('💡 Откройте backend/.env и проверьте значения.');
  console.error('');
  process.exit(1);
}

export const env = parsed.data;
