'use client';

import { useState } from 'react';
import { EggeoButton, EggeoField } from '@eggeo/ui';
import { apiRequest } from '@/lib/clientApi';

export function CreateEggForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [points, setPoints] = useState(1);
  const [color, setColor] = useState('#ffffff');
  const [count, setCount] = useState(1);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function createEggs() {
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await apiRequest<{ created: number }>('/api/eggs', {
        title,
        description,
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
    <form className="panel stack" onSubmit={submit}>
      <EggeoField label="Title" required value={title} onChangeText={setTitle} />
      <EggeoField label="Description" multiline required value={description} onChangeText={setDescription} />
      <EggeoField label="Points per egg" min={-100} required type="number" value={points} onChangeText={(value) => setPoints(Number(value))} />
      <EggeoField label="Color" type="color" value={color} onChangeText={setColor} />
      <EggeoField label="Number of Eggs" min={1} required type="number" value={count} onChangeText={(value) => setCount(Number(value))} />
      {message && <p className="message">{message}</p>}
      <EggeoButton disabled={isSubmitting} onPress={createEggs}>
        Submit
      </EggeoButton>
    </form>
  );
}
