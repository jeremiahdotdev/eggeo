import { appText } from '@eggeo/static-text';
import { EggeoButton, EggeoField, EggeoPanel } from '@eggeo/ui';
import { useState } from 'react';
import { View } from 'react-native';
import { api } from '../lib/api';
import { ScreenMessage, ScreenTitle, viewStyles } from './shared';

export function CreateView() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [points, setPoints] = useState('1');
  const [color, setColor] = useState('#ffffff');
  const [count, setCount] = useState('1');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit() {
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await api.createEggs({
        color,
        count: Number(count),
        description,
        points: Number(points),
        title,
      });
      setMessage(appText.eggs.messages.created(response.created));
      setTitle('');
      setDescription('');
      setPoints('1');
      setCount('1');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : appText.eggs.messages.unableToCreate);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View style={viewStyles.stack}>
      <ScreenTitle>{appText.nav.create}</ScreenTitle>
      <EggeoPanel>
        <EggeoField label={appText.eggs.fields.title} onChangeText={setTitle} required value={title} />
        <EggeoField label={appText.eggs.fields.description} multiline onChangeText={setDescription} required value={description} />
        <EggeoField keyboardType="default" label={appText.eggs.fields.points} onChangeText={setPoints} required type="number" value={points} />
        <EggeoField label={appText.eggs.fields.color} onChangeText={setColor} type="color" value={color} />
        <EggeoField keyboardType="default" label={appText.eggs.fields.count} onChangeText={setCount} required type="number" value={count} />
        <ScreenMessage>{message}</ScreenMessage>
        <EggeoButton isLoading={isSubmitting} onPress={submit}>
          {appText.common.actions.submit}
        </EggeoButton>
      </EggeoPanel>
    </View>
  );
}
