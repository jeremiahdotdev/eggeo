'use client';

import { GoogleMap, OverlayView, useJsApiLoader } from '@react-google-maps/api';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { EggIcon } from '@/components/EggIcon';
import { PageTitle } from '@/components/PageTitle';
import { UserMarker } from '@/components/UserMarker';
import { apiRequest } from '@/lib/clientApi';

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

const defaultCenter = { lat: 0, lng: 0 };

function parseCoords(coords: NearbyEgg['coords']): Location | null {
  const lat = Number(coords?.lat);
  const lng = Number(coords?.lng);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  return { lat, lng };
}

export function NearbyEggs({ mapsApiKey }: { mapsApiKey: string }) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [center, setCenter] = useState<Location>(defaultCenter);
  const [eggs, setEggs] = useState<NearbyEgg[]>([]);
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

  const loadNearby = useCallback(async (position: Location) => {
    try {
      const params = new URLSearchParams({
        lat: String(position.lat),
        lng: String(position.lng),
      });
      const nearby = await apiRequest<NearbyEgg[]>(`/api/eggs/nearby?${params}`);
      setEggs(nearby.filter((egg) => parseCoords(egg.coords)));
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const nextCenter = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCenter(nextCenter);
        mapRef.current?.panTo(nextCenter);
        void loadNearby(nextCenter);
      },
      () => {},
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
      <section className="locator-map-fallback panel stack">
        <PageTitle>Map</PageTitle>
        <p className="message error">Add NEXT_PUBLIC_MAPS_API_KEY or NUXT_PUBLIC_MAPS_API_KEY to enable the map.</p>
      </section>
    );
  }

  if (loadError) {
    return (
      <section className="locator-map-fallback panel stack">
        <PageTitle>Map</PageTitle>
        <p className="message error">Unable to load Google Maps.</p>
      </section>
    );
  }

  return (
    <section className="locator-map-shell">
      {!isLoaded ? (
        <div className="locator-map-loading panel">
          <strong>Loading map...</strong>
        </div>
      ) : (
        <GoogleMap
          center={center}
          mapContainerClassName="locator-map"
          onLoad={(map) => {
            mapRef.current = map;
          }}
          options={mapOptions}
          zoom={17}
        >
          <OverlayView mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET} position={center}>
            <div className="map-marker map-marker-user">
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
                <button className="map-marker map-marker-egg" onClick={() => setSelectedEgg(egg)} type="button">
                  <EggIcon color={egg.color} seed={egg.id} size={32} strokeWidth={5} />
                </button>
              </OverlayView>
            );
          })}
        </GoogleMap>
      )}
      {selectedEgg ? (
        <aside className="locator-egg-popover panel stack">
          <div className="row">
            <EggIcon color={selectedEgg.color} seed={selectedEgg.id} size={54} />
            <button className="button ghost" onClick={() => setSelectedEgg(null)} type="button">
              Close
            </button>
          </div>
          <strong>{selectedEgg.title || 'Hidden egg'}</strong>
          {selectedEgg.description ? <p>{selectedEgg.description}</p> : null}
          <span>{Math.abs(selectedEgg.points ?? 1) === 1 ? `${selectedEgg.points ?? 1} pt.` : `${selectedEgg.points ?? 1} pts.`}</span>
        </aside>
      ) : null}
    </section>
  );
}
