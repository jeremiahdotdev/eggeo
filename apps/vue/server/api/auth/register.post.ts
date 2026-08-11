import bcrypt from 'bcryptjs';
import { prisma } from '@eggeo/db';
import { createAccountSchema } from '@eggeo/validation';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const parsed = createAccountSchema.safeParse(body);

  if (!parsed.success) {
    setResponseStatus(event, 400);
    return {
      status: 'invalid',
      message: 'Enter a valid email and a password with at least 8 characters.',
    };
  }

  const email = parsed.data.email.toLowerCase();
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    setResponseStatus(event, 409);
    return {
      status: 'exists',
      message: 'An account already exists for that email.',
    };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  await prisma.user.create({
    data: {
      username: email,
      email,
      passwordHash,
      name: parsed.data.name,
    },
  });

  return {
    status: 'ok',
  };
});
