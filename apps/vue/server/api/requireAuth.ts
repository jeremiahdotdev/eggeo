import { getServerSession } from '#auth';
import { prisma } from '@eggeo/db';

export function requireAuth(func: (event: any) => Promise<any>) {
  return async (event: any) => {
    const session = await getServerSession(event);
    if (!session?.user?.email) {
      return { status: 'unauthenticated' };
    }
    const user = {
      username: session.user.email,
      email: session.user.email,
      name: session.user.name ?? undefined,
    };
    try {
      await prisma.user.update({
        where: {
          username: session.user.email,
        },
        data: user,
      });
      return func(event);
    } catch {
      return { status: 'unknown' };
    }
  };
}

export async function getUser(event: any) {
  const session = await getServerSession(event);
  if (!session?.user?.email) {
    return undefined;
  } else {
    return session.user.email;
  }
}
