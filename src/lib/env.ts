import { z, ZodIssue } from 'zod';

export const envSchema = z.object({
  NEXT_PUBLIC_MAPBOX_TOKEN: z.string(),
});

export type EnvSchema = z.infer<typeof envSchema>;

// Construct error messages from Zod issues
const constructEnvErrorMessages = (errors: ZodIssue[]): string[] =>
  errors.map((error, idx) => `${idx + 1}) ${error.path.join('.')} : ${error.message}`);

export const envValidator = () => {
  const envValidationResult = envSchema.safeParse(process.env);

  if (envValidationResult.error) {
    const errorMessages = constructEnvErrorMessages(envValidationResult.error.errors);
    throw new Error(
      `\n\n❌ Error in loading environment variables:\n${errorMessages.join('\n')}\n`,
    );
  }

  console.info('✅ Environment variables loaded successfully');
};
