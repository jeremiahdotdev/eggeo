import { ok } from '@/lib/api';
import { clearSession } from '@/lib/session';

export async function POST() {
  await clearSession();
  return ok({ status: 'ok' });
}
