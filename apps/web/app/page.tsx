import { redirect } from 'next/navigation';
import { appText } from '@eggeo/static-text';
import { EggeoTitle } from '@eggeo/ui';
import { AuthForm } from '@/components/AuthForm';
import { SkyScene } from '@/components/SkyScene';
import { getSession } from '@/lib/session';

export default async function HomePage() {
  const session = await getSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <SkyScene className="auth-scene" variant="auth">
      <div className="auth-panel-wrap">
        <div className="auth-title">
          <EggeoTitle>{appText.brand.title}</EggeoTitle>
        </div>
        <AuthForm />
      </div>
    </SkyScene>
  );
}
