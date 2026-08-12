'use client';

import { useState } from 'react';
import { EggIcon, EggeoButton, EggeoText } from '@eggeo/ui';
import { QrScanner } from '@/components/QrScanner';
import { apiRequest } from '@/lib/clientApi';
import { isUuid, parseEggFromLink } from '@/lib/egg';

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
    const id = parseEggFromLink(value);
    setMessage('');

    if (!isUuid(id)) {
      setMessage('Enter a valid egg code or egg link.');
      return;
    }

    setInput(id);
    setIsFinding(true);
    try {
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

  return (
    <section className="stack">
      <EggeoText colorized variant="pageTitle">
        Find
      </EggeoText>
      <QrScanner disabled={isFinding || isCollecting} onDetect={performFind} />
      {foundEgg && (
        <section className="panel stack">
          <div className="row">
            <div>
              <h2>{foundEgg.Egg.title || 'Egg found!'}</h2>
              <p>{foundEgg.Egg.description}</p>
              <strong>{foundEgg.Egg.points === 1 ? '+1 pt.' : `+${foundEgg.Egg.points ?? 1} pts.`}</strong>
            </div>
            <EggIcon color={foundEgg.Egg.color} seed={foundEgg.Egg.title ?? 'found-egg'} />
          </div>
          <EggeoButton disabled={isCollecting || message === 'Egg Collected!'} onPress={collectEgg}>
            Collect Egg Now
          </EggeoButton>
        </section>
      )}
      {message && <p className="message">{message}</p>}
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
    <section className="stack">
      <EggeoText colorized variant="pageTitle">
        Hide
      </EggeoText>
      <QrScanner disabled={isSubmitting} onDetect={performHide} />
      {message && <p className="message">{message}</p>}
    </section>
  );
}
