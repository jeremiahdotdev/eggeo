'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { appText } from '@eggeo/static-text';
import { EggeoAuthPanel, type AuthPanelMode } from '@eggeo/ui';
import { apiRequest } from '@/lib/clientApi';

export function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthPanelMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  );
}
