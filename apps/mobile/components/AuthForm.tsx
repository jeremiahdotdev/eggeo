import type { ApiSessionUser } from '@eggeo/api-client';
import { EGG_DEFAULT_POINTS } from '@eggeo/domain';
import { appText } from '@eggeo/static-text';
import { EggeoAuthPanel, type AuthPanelMode } from '@eggeo/ui';
import { useState } from 'react';
import { api } from '../lib/api';

export function AuthForm({ onSignedIn }: { onSignedIn: (user: ApiSessionUser) => void }) {
  const [mode, setMode] = useState<AuthPanelMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(appText.auth.messages.readyToHunt(EGG_DEFAULT_POINTS));
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit() {
    setIsSubmitting(true);
    setMessage('');

    try {
      if (mode === 'create') {
        await api.createAccount({ email, name: name || undefined, password });
      }

      await api.login({ email, password });
      const session = await api.getMe();
      if (session.user) {
        onSignedIn(session.user);
        return;
      }

      setMessage(
        appText.auth.messages.signedIn,
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : appText.auth.messages.requestFailed);
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
