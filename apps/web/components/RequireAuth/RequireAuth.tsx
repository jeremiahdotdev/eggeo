import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';

export async function requirePageSession() {
  const session = await getSession();

  if (!session) {
    redirect('/signin');
  }

  return session;
}
