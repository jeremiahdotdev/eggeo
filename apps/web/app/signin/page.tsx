'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { appText } from '@eggeo/domain';
import { EggeoAuthPanel, EggeoTitle, type AuthPanelMode } from '@eggeo/ui';
import { SkyScene } from '@/components/SkyScene';
import { apiRequest } from '@/lib/clientApi';

export default function SignInPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthPanelMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    apiRequest<{ user?: unknown }>('/api/auth/me')
      .then((session) => {
        if (session.user) {
          router.replace('/dashboard');
        }
      })
      .catch(() => undefined);
  }, [router]);

  async function submit() {
    setIsSubmitting(true);
    setMessage('');

    try {
      if (mode === 'create') {
        await apiRequest('/api/auth/register', {
          name: name || undefined,
          email,
          password,
        });
      }

      await apiRequest('/api/auth/login', {
        email,
        password,
      });
      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : appText.auth.messages.genericError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SkyScene className="auth-scene" variant="auth">
      <div className="auth-panel-wrap">
        <div className="auth-title">
          <EggeoTitle>{appText.brand.title}</EggeoTitle>
        </div>
        <EggeoAuthPanel
          email={email}
          isSubmitting={isSubmitting}
          message={message}
          mode={mode}
          name={name}
          onChangeEmail={setEmail}
          onChangeMode={(nextMode) => {
            setMode(nextMode);
            setMessage('');
          }}
          onChangeName={setName}
          onChangePassword={setPassword}
          onSubmit={submit}
          password={password}
        />
      </div>
    </SkyScene>
  );
}
