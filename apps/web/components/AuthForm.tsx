'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/clientApi';

type Mode = 'login' | 'create';

export function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
      setMessage(error instanceof Error ? error.message : 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="panel stack" onSubmit={submit}>
      <h1 className="page-title">{mode === 'login' ? 'Log in' : 'Create account'}</h1>
      {mode === 'create' ? (
        <label className="field">
          <span>Name</span>
          <input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} />
        </label>
      ) : null}
      <label className="field">
        <span>Email</span>
        <input autoComplete="email" required type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      </label>
      <label className="field">
        <span>Password</span>
        <input
          autoComplete={mode === 'create' ? 'new-password' : 'current-password'}
          minLength={8}
          required
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>
      {message ? <p className="message error">{message}</p> : null}
      <button className="button" disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Working...' : mode === 'login' ? 'Log in' : 'Create account'}
      </button>
      <button
        className="button ghost"
        type="button"
        onClick={() => {
          setMode(mode === 'login' ? 'create' : 'login');
          setMessage('');
        }}
      >
        {mode === 'login' ? 'Need an account?' : 'Already have an account?'}
      </button>
    </form>
  );
}
