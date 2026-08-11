import { redirect } from 'next/navigation';
import { AuthForm } from '@/components/AuthForm';
import { getSession } from '@/lib/session';

export default async function SignInPage() {
  const session = await getSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <main className="auth-scene">
      <div className="home-clouds auth-clouds" aria-hidden="true">
        <span className="cloud cloud-one" />
        <span className="cloud cloud-two" />
        <span className="cloud cloud-three" />
        <span className="cloud cloud-four" />
        <span className="cloud cloud-five" />
      </div>
      <div className="auth-panel-wrap">
        <AuthForm />
      </div>
    </main>
  );
}
