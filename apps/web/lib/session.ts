import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { prisma } from '@eggeo/db';

const sessionCookieName = 'eggeo_session';
const maxAgeSeconds = 60 * 60 * 24 * 30;

export type Session = {
  username: string;
  email: string;
  name?: string | null;
};

function getSecret() {
  const secret = process.env.AUTH_SECRET;

  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('AUTH_SECRET is required in production.');
  }

  return secret ?? 'eggeo-local-dev-secret';
}

function base64Url(value: string) {
  return Buffer.from(value).toString('base64url');
}

function sign(payload: string) {
  return createHmac('sha256', getSecret()).update(payload).digest('base64url');
}

function encodeSession(session: Session) {
  const expiresAt = Date.now() + maxAgeSeconds * 1000;
  const payload = base64Url(JSON.stringify({ ...session, expiresAt }));
  return `${payload}.${sign(payload)}`;
}

function decodeSession(value?: string): (Session & { expiresAt: number }) | undefined {
  if (!value) return undefined;

  const [payload, signature] = value.split('.');
  if (!payload || !signature) return undefined;

  const expected = sign(payload);
  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (providedBuffer.length !== expectedBuffer.length || !timingSafeEqual(providedBuffer, expectedBuffer)) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!parsed?.email || !parsed?.username || parsed.expiresAt < Date.now()) return undefined;
    return parsed;
  } catch {
    return undefined;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = decodeSession(cookieStore.get(sessionCookieName)?.value);

  if (!session) return undefined;

  const user = await prisma.user.findUnique({
    where: {
      username: session.username,
    },
    select: {
      username: true,
      email: true,
      name: true,
    },
  });

  if (!user?.email) return undefined;

  return {
    username: user.username,
    email: user.email,
    name: user.name,
  };
}

export async function requireSession() {
  const session = await getSession();

  if (!session) {
    throw new Response(JSON.stringify({ status: 'unauthenticated' }), {
      status: 401,
      headers: {
        'content-type': 'application/json',
      },
    });
  }

  return session;
}

export async function setSession(session: Session) {
  const cookieStore = await cookies();
  cookieStore.set(sessionCookieName, encodeSession(session), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: maxAgeSeconds,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(sessionCookieName);
}
