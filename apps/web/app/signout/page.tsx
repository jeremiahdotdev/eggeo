import { redirect } from 'next/navigation';
import { clearSession } from '@/lib/session';

export default async function SignOutPage() {
  await clearSession();
  redirect('/');
}
