'use client';

import { useState } from 'react';
import { appText } from '@eggeo/domain';
import { EggeoButton, EggeoEventPicker, EggeoField } from '@eggeo/ui';
import { apiRequest } from '@/lib/clientApi';
import styles from './CreateEggForm.module.css';

type EventOption = {
  id: string;
  title: string;
};

export function CreateEggForm({ events = [] }: { events?: EventOption[] }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [points, setPoints] = useState(1);
  const [color, setColor] = useState('#ffffff');
  const [count, setCount] = useState(1);
  const [eventId, setEventId] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canSubmit = Boolean(eventId) && !isSubmitting;

  async function createEggs() {
    if (!eventId) {
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await apiRequest<{ created: number }>('/api/eggs', {
        title,
        description,
        eventId,
        points,
        color,
        count,
      });
      setTitle('');
      setDescription('');
      setPoints(1);
      setCount(1);
      setMessage(`Created ${response.created} ${response.created === 1 ? 'egg' : 'eggs'}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to create eggs.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void createEggs();
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <EggeoField label="Title" required value={title} onChangeText={setTitle} />
      <EggeoField label="Description" multiline required value={description} onChangeText={setDescription} />
      <EggeoField label="Points per egg" min={-100} required type="number" value={points} onChangeText={(value) => setPoints(Number(value))} />
      <EggeoField label="Color" type="color" value={color} onChangeText={setColor} />
      <EggeoField label="Number of Eggs" min={1} required type="number" value={count} onChangeText={(value) => setCount(Number(value))} />
      <EggeoEventPicker allLabel={appText.events.labels.selectEvent} events={events} label="Event" requireSelection selectedEventId={eventId} onSelect={setEventId} />
      {message && <p className={styles.message}>{message}</p>}
      <EggeoButton disabled={!canSubmit} onPress={createEggs}>
        Submit
      </EggeoButton>
    </form>
  );
}
