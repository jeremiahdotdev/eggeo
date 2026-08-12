'use client';

import { GoogleMap, OverlayView, useJsApiLoader } from '@react-google-maps/api';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { EggIcon, EggeoButton, EggeoText, UserMarker } from '@eggeo/ui';
import { apiRequest } from '@/lib/clientApi';
import styles from './NearbyEggs.module.css';

type Location = {
  lat: number;
  lng: number;
};

type NearbyEgg = {
  id: string;
  title?: string | null;
  description?: string | null;
  color?: string | null;
  points?: number | null;
  coords?: {
    lat: string | number;
    lng: string | number;
  } | null;
};

type EventOption = {
  id: string;
  title: string;
};

const defaultCenter = { lat: 0, lng: 0 };

function parseCoords(coords: NearbyEgg['coords']): Location | null {
  const lat = Number(coords?.lat);
  const lng = Number(coords?.lng);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  return { lat, lng };
}

export function NearbyEggs({ events = [], initialEventId = '', mapsApiKey }: { events?: EventOption[]; initialEventId?: string; mapsApiKey: string }) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [center, setCenter] = useState<Location>(defaultCenter);
  const [eggs, setEggs] = useState<NearbyEgg[]>([]);
  const [eventId, setEventId] = useState(initialEventId);
  const [locationMessage, setLocationMessage] = useState('Finding your location...');
  const [selectedEgg, setSelectedEgg] = useState<NearbyEgg | null>(null);
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: mapsApiKey,
    id: 'eggeo-google-map',
  });

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      clickableIcons: false,
      disableDefaultUI: false,
      fullscreenControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      zoomControl: true,
    }),
    [],
  );

  const loadNearby = useCallback(async (position: Location, nextEventId = eventId) => {
    try {
      const params = new URLSearchParams({
        lat: String(position.lat),
        lng: String(position.lng),
      });

      if (nextEventId) {
        params.set('eventId', nextEventId);
      }

      const nearby = await apiRequest<NearbyEgg[]>(`/api/eggs/nearby?${params}`);
      setEggs(nearby.filter((egg) => parseCoords(egg.coords)));
    } catch (error) {
      console.error(error);
    }
  }, [eventId]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationMessage('Location is not available in this browser.');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const nextCenter = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCenter(nextCenter);
        setLocationMessage('');
        mapRef.current?.panTo(nextCenter);
        void loadNearby(nextCenter);
      },
      () => {
        setLocationMessage('Allow location access to center the map and show nearby eggs.');
      },
      {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 15000,
      },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [loadNearby]);

  if (!mapsApiKey) {
    return (
      <section className={styles.fallback}>
        <EggeoText colorized variant="pageTitle">
          Map
        </EggeoText>
        <p className={styles.message}>Add NEXT_PUBLIC_MAPS_API_KEY or NUXT_PUBLIC_MAPS_API_KEY to enable the map.</p>
      </section>
    );
  }

  if (loadError) {
    return (
      <section className={styles.fallback}>
        <EggeoText colorized variant="pageTitle">
          Map
        </EggeoText>
        <p className={styles.message}>Unable to load Google Maps.</p>
      </section>
    );
  }

  return (
    <section className={styles.shell}>
      {events.length > 0 && (
        <div className={styles.eventBar}>
          <select
            aria-label="Event"
            className={styles.eventSelect}
            onChange={(event) => {
              const nextEventId = event.target.value;
              setEventId(nextEventId);
              setSelectedEgg(null);
              void loadNearby(center, nextEventId);
            }}
            value={eventId}
          >
            <option value="">All Eggs</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>
        </div>
      )}
      {!isLoaded ? (
        <div className={styles.loading}>
          <strong>Loading map...</strong>
        </div>
      ) : (
        <GoogleMap
          center={center}
          mapContainerClassName={styles.map}
          onLoad={(map) => {
            mapRef.current = map;
          }}
          options={mapOptions}
          zoom={17}
        >
          <OverlayView mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET} position={center}>
            <div className={styles.userMarker}>
              <UserMarker size={42} />
            </div>
          </OverlayView>
          {eggs.map((egg) => {
            const position = parseCoords(egg.coords);

            if (!position) {
              return null;
            }

            return (
              <OverlayView key={`${egg.id}-${position.lat}-${position.lng}`} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET} position={position}>
                <button className={styles.eggMarker} onClick={() => setSelectedEgg(egg)} type="button">
                  <EggIcon color={egg.color} seed={egg.id} size={32} strokeWidth={5} />
                </button>
              </OverlayView>
            );
          })}
        </GoogleMap>
      )}
      {locationMessage && <div className={styles.status}>{locationMessage}</div>}
      {selectedEgg && (
        <aside className={styles.popover}>
          <div className={styles.row}>
            <EggIcon color={selectedEgg.color} seed={selectedEgg.id} size={54} />
            <EggeoButton intent="ghost" onPress={() => setSelectedEgg(null)}>
              Close
            </EggeoButton>
          </div>
          <strong>{selectedEgg.title || 'Hidden egg'}</strong>
          {selectedEgg.description && <p>{selectedEgg.description}</p>}
          <span>{Math.abs(selectedEgg.points ?? 1) === 1 ? `${selectedEgg.points ?? 1} pt.` : `${selectedEgg.points ?? 1} pts.`}</span>
        </aside>
      )}
    </section>
  );
}
