'use client';

import { useState } from 'react';
import { appText } from '@eggeo/domain';
import { EggIcon, EggeoButton, EggeoText } from '@eggeo/ui';
import { QrScanner } from '@/components/QrScanner';
import { apiRequest } from '@/lib/clientApi';
import { isUuid, parseEggFromLink, parseScanTarget } from '@/lib/egg';
import styles from './EggCodeFlow.module.css';

type FoundEgg = {
  Egg: {
    title?: string | null;
    description?: string | null;
    color?: string | null;
    points?: number | null;
  };
};

export function FindEggFlow() {
  const [input, setInput] = useState('');
  const [foundEgg, setFoundEgg] = useState<FoundEgg>();
  const [message, setMessage] = useState('');
  const [isCollecting, setIsCollecting] = useState(false);
  const [isFinding, setIsFinding] = useState(false);

  async function performFind(value: string) {
    const target = parseScanTarget(value);
    const id = target.id;
    setMessage('');

    if (!isUuid(id)) {
      setMessage(appText.events.messages.invalidCode);
      return;
    }

    setInput(id);
    setIsFinding(true);
    try {
      if (target.type === 'event') {
        const event = await apiRequest<{ title: string }>(`/api/events/${id}/join`, {});
        setFoundEgg(undefined);
        setMessage(appText.events.messages.joined(event.title));
        return;
      }

      const response = await apiRequest<FoundEgg>(`/api/eggs/${id}/find`, {});
      setFoundEgg(response);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to find egg.');
    } finally {
      setIsFinding(false);
    }
  }

  async function collectEgg() {
    const id = parseEggFromLink(input);
    setIsCollecting(true);
    setMessage('');

    try {
      await apiRequest(`/api/eggs/${id}/collect`, {});
      setMessage('Egg Collected!');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to collect egg.');
    } finally {
      setIsCollecting(false);
    }
  }

  function leaveEggHidden() {
    setInput('');
    setFoundEgg(undefined);
    setMessage('');
  }

  const wasCollected = message === appText.eggs.messages.collected;

  return (
    <section className={styles.stack}>
      <EggeoText colorized variant="pageTitle">
        {appText.nav.find}
      </EggeoText>
      <QrScanner disabled={isFinding || isCollecting} onDetect={performFind} />
      {message && <p className={styles.actionMessage}>{message}</p>}
      {foundEgg && (
        <section className={styles.panel}>
          <div className={styles.row}>
            <div>
              <h2>{foundEgg.Egg.title || 'Egg found!'}</h2>
              <p>{foundEgg.Egg.description}</p>
              <strong>{foundEgg.Egg.points === 1 ? '+1 pt.' : `+${foundEgg.Egg.points ?? 1} pts.`}</strong>
            </div>
            <EggIcon color={foundEgg.Egg.color} seed={foundEgg.Egg.title ?? 'found-egg'} />
          </div>
          <div className={styles.buttonRow}>
            <EggeoButton disabled={isCollecting || wasCollected} onPress={collectEgg}>
              {appText.eggs.actions.collectNow}
            </EggeoButton>
            <EggeoButton disabled={isCollecting || wasCollected} intent="ghost" onPress={leaveEggHidden}>
              {appText.eggs.actions.leaveHidden}
            </EggeoButton>
          </div>
        </section>
      )}
    </section>
  );
}

export function HideEggFlow() {
  const [input, setInput] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function performHide(value: string) {
    const id = parseEggFromLink(value);
    setMessage('');

    if (!isUuid(id)) {
      setMessage('Enter a valid egg code or egg link.');
      return;
    }

    if (!navigator.geolocation) {
      setMessage('Location is not available in this browser.');
      return;
    }

    setInput(id);
    setIsSubmitting(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await apiRequest(`/api/eggs/${id}/hide`, {
            coords: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
          setMessage('Egg Hidden!');
          setInput('');
        } catch (error) {
          setMessage(error instanceof Error ? error.message : 'Unable to hide egg.');
        } finally {
          setIsSubmitting(false);
        }
      },
      () => {
        setMessage('Unable to read your location.');
        setIsSubmitting(false);
      },
    );
  }

  return (
    <section className={styles.stack}>
      <EggeoText colorized variant="pageTitle">
        {appText.nav.hide}
      </EggeoText>
      <QrScanner disabled={isSubmitting} onDetect={performHide} />
      {message && <p className={styles.actionMessage}>{message}</p>}
    </section>
  );
}
