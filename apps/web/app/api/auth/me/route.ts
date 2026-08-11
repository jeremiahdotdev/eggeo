import { ok } from '@/lib/api';
import { getSession } from '@/lib/session';

export async function GET() {
  const session = await getSession();
  return ok({ user: session ?? null });
}
