import { redirect } from 'next/navigation';
import { AuthForm } from '@/components/AuthForm';
import { SkyScene } from '@/components/SkyScene';
import { getSession } from '@/lib/session';

export default async function SignInPage() {
  const session = await getSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <SkyScene className="auth-scene" variant="auth">
      <div className="auth-panel-wrap">
        <AuthForm />
      </div>
    </SkyScene>
  );
}
