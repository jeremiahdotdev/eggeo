import { z } from 'zod';

export const authCredentialsSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8),
});

export const createAccountSchema = authCredentialsSchema.extend({
  name: z.string().trim().min(1).max(100).optional(),
});

export type AuthCredentials = z.infer<typeof authCredentialsSchema>;
export type CreateAccountInput = z.infer<typeof createAccountSchema>;

export function toTitleCase(value: string) {
  return value.replace(/\w\S*/g, (text) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase());
}
