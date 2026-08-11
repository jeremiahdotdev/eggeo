import bcrypt from 'bcryptjs';
import { prisma } from '@eggeo/db';
import { createAccountSchema } from '@eggeo/validation';
import { apiError, badRequest, conflict, ok } from '@/lib/api';

export async function POST(request: Request) {
  try {
    const parsed = createAccountSchema.safeParse(await request.json());

    if (!parsed.success) {
      return badRequest('Enter a valid email and a password with at least 8 characters.');
    }

    const email = parsed.data.email.toLowerCase();
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username: email }],
      },
    });

    if (existingUser) {
      return conflict('An account already exists for that email.');
    }

    await prisma.user.create({
      data: {
        username: email,
        email,
        passwordHash: await bcrypt.hash(parsed.data.password, 12),
        name: parsed.data.name,
      },
    });

    return ok({ status: 'ok' });
  } catch (error) {
    return apiError(error);
  }
}
