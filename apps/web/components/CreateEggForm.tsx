'use client';

import { useState } from 'react';
import { apiRequest } from '@/lib/clientApi';

export function CreateEggForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [points, setPoints] = useState(1);
  const [color, setColor] = useState('#ffffff');
  const [count, setCount] = useState(1);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
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

  return (
    <form className="panel stack" onSubmit={submit}>
      <label className="field">
        <span>Title</span>
        <input required value={title} onChange={(event) => setTitle(event.target.value)} />
      </label>
      <label className="field">
        <span>Description</span>
        <textarea required value={description} onChange={(event) => setDescription(event.target.value)} />
      </label>
      <label className="field">
        <span>Points per egg</span>
        <input min={-100} required type="number" value={points} onChange={(event) => setPoints(event.target.valueAsNumber)} />
      </label>
      <label className="field">
        <span>Color</span>
        <input type="color" value={color} onChange={(event) => setColor(event.target.value)} />
      </label>
      <label className="field">
        <span>Number of Eggs</span>
        <input min={1} required type="number" value={count} onChange={(event) => setCount(event.target.valueAsNumber)} />
      </label>
      {message ? <p className="message">{message}</p> : null}
      <button className="button" disabled={isSubmitting} type="submit">
        Submit
      </button>
    </form>
  );
}
