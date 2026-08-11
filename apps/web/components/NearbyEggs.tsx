'use client';

import { useState } from 'react';
import { EggIcon } from '@/components/EggIcon';
import { apiRequest } from '@/lib/clientApi';

type NearbyEgg = {
  id: string;
  title?: string | null;
  description?: string | null;
  color?: string | null;
  coords?: {
    lat: string | number;
    lng: string | number;
  } | null;
};

export function NearbyEggs() {
  const [eggs, setEggs] = useState<NearbyEgg[]>([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function loadNearby() {
    setMessage('');

    if (!navigator.geolocation) {
      setMessage('Location is not available in this browser.');
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const params = new URLSearchParams({
            lat: String(position.coords.latitude),
            lng: String(position.coords.longitude),
          });
          const response = await apiRequest<NearbyEgg[]>(`/api/eggs/nearby?${params}`);
          setEggs(response);
          setMessage(response.length ? '' : 'No hidden eggs nearby.');
        } catch (error) {
          setMessage(error instanceof Error ? error.message : 'Unable to load nearby eggs.');
        } finally {
          setIsLoading(false);
        }
      },
      () => {
        setMessage('Unable to read your location.');
        setIsLoading(false);
      },
    );
  }

  return (
    <section className="page stack">
      <h1 className="page-title">Map</h1>
      <div className="panel stack">
        <button className="button" disabled={isLoading} onClick={loadNearby} type="button">
          {isLoading ? 'Finding eggs...' : 'Find Nearby Eggs'}
        </button>
        {message ? <p className="message">{message}</p> : null}
      </div>
      <div className="map-list">
        {eggs.map((egg) => {
          const lat = Number(egg.coords?.lat);
          const lng = Number(egg.coords?.lng);
          return (
            <article className="leader-card row" key={egg.id}>
              <div className="row">
                <EggIcon color={egg.color} seed={egg.id} size={42} />
                <div>
                  <strong>{egg.title || 'Hidden egg'}</strong>
                  <p>{egg.description}</p>
                </div>
              </div>
              {Number.isFinite(lat) && Number.isFinite(lng) ? (
                <a className="button secondary" href={`https://www.google.com/maps?q=${lat},${lng}`} rel="noreferrer" target="_blank">
                  Open Map
                </a>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
