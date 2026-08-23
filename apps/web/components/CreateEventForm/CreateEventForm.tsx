'use client';

import type { ApiEvent } from '@eggeo/api-client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { appText } from '@eggeo/domain';
import { EggeoButton, EggeoField } from '@eggeo/ui';
import { useEventSelection } from '@/components/EventSelection';
import { apiRequest } from '@/lib/clientApi';
import styles from './CreateEventForm.module.css';

export function CreateEventForm() {
  const router = useRouter();
  const { refreshEvents } = useEventSelection();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function createEvent() {
    setIsSubmitting(true);
    setMessage('');

    try {
      const event = await apiRequest<ApiEvent>('/api/events', {
        description,
        title,
      });
      setTitle('');
      setDescription('');
      setMessage(appText.events.messages.created);
      await refreshEvents(event.id);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : appText.events.messages.unableToCreate);
    } finally {
      setIsSubmitting(false);
    }
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void createEvent();
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <EggeoField label={appText.events.fields.title} onChangeText={setTitle} required value={title} />
      <EggeoField label={appText.events.fields.description} multiline onChangeText={setDescription} value={description} />
      {message && <p className={styles.message}>{message}</p>}
      <EggeoButton disabled={isSubmitting} onPress={createEvent}>
        {appText.events.actions.create}
      </EggeoButton>
    </form>
  );
}
