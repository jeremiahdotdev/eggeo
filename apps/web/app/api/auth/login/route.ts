import bcrypt from 'bcryptjs';
import { prisma } from '@eggeo/db';
import { authCredentialsSchema } from '@eggeo/validation';
import { apiError, badRequest, ok } from '@/lib/api';
import { setSession } from '@/lib/session';

export async function POST(request: Request) {
  try {
    const parsed = authCredentialsSchema.safeParse(await request.json());

    if (!parsed.success) {
      return badRequest('Email or password is incorrect.');
    }

    const email = parsed.data.email.toLowerCase();
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username: email }],
      },
    });

    if (!user?.email || !user.passwordHash) {
      return badRequest('Email or password is incorrect.');
    }

    const passwordMatches = await bcrypt.compare(parsed.data.password, user.passwordHash);

    if (!passwordMatches) {
      return badRequest('Email or password is incorrect.');
    }

    await setSession({
      username: user.username,
      email: user.email,
      name: user.name,
    });

    return ok({ status: 'ok' });
  } catch (error) {
    return apiError(error);
  }
}
