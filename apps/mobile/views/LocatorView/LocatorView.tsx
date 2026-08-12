import type { ApiEgg, ApiEggLocation, ApiEvent } from '@eggeo/api-client';
import { appText } from '@eggeo/domain';
import { EggIcon, EggeoButton, EggeoPanel, EggeoText } from '@eggeo/ui';
import * as Location from 'expo-location';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import MapView, { Marker, type Region } from 'react-native-maps';
import { api } from '../../lib/api';
import { styles } from './LocatorView.styles';
import { ScreenTitle, viewStyles } from '../shared';

const latitudeDelta = 0.006;
const longitudeDelta = 0.006;

function parseCoords(coords: ApiEggLocation | null | undefined) {
  const lat = Number(coords?.lat);
  const lng = Number(coords?.lng);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  return { latitude: lat, longitude: lng };
}

export function LocatorView() {
  const mapRef = useRef<MapView | null>(null);
  const [region, setRegion] = useState<Region | null>(null);
  const [eggs, setEggs] = useState<ApiEgg[]>([]);
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [eventId, setEventId] = useState('');
  const [message, setMessage] = useState('Finding your location...');
  const [selectedEgg, setSelectedEgg] = useState<ApiEgg | null>(null);

  const loadNearby = useCallback(async (coords: { latitude: number; longitude: number }, nextEventId = eventId) => {
    try {
      const nearby = await api.getNearbyEggs({ lat: coords.latitude, lng: coords.longitude }, nextEventId || undefined);
      setEggs(nearby.filter((egg) => parseCoords(egg.coords)));
    } catch (error) {
      console.error(error);
    }
  }, [eventId]);

  useEffect(() => {
    api.getEvents().then(setEvents).catch(() => setEvents([]));
  }, []);

  useEffect(() => {
    if (region) {
      void loadNearby(region);
    }
  }, [eventId, loadNearby, region]);

  useEffect(() => {
    let subscription: Location.LocationSubscription | undefined;
    let isMounted = true;

    async function watchLocation() {
      const permission = await Location.requestForegroundPermissionsAsync();

      if (!permission.granted) {
        setMessage('Allow location access to center the map and show nearby eggs.');
        return;
      }

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 5,
          timeInterval: 10000,
        },
        (position) => {
          if (!isMounted) {
            return;
          }

          const nextRegion = {
            latitude: position.coords.latitude,
            latitudeDelta,
            longitude: position.coords.longitude,
            longitudeDelta,
          };

          setRegion(nextRegion);
          setMessage('');
          mapRef.current?.animateToRegion(nextRegion, 300);
          void loadNearby(nextRegion);
        },
      );
    }

    void watchLocation();

    return () => {
      isMounted = false;
      subscription?.remove();
    };
  }, [loadNearby]);

  return (
    <View style={styles.screen}>
      {region ? (
        <MapView ref={mapRef} initialRegion={region} showsCompass={false} showsPointsOfInterests={false} showsUserLocation style={styles.map}>
          {eggs.map((egg) => {
            const coords = parseCoords(egg.coords);

            if (!coords) {
              return null;
            }

            return (
              <Marker key={egg.id} coordinate={coords} onPress={() => setSelectedEgg(egg)}>
                <View style={styles.eggMarker}>
                  <EggIcon color={egg.color} seed={egg.id} size={32} strokeWidth={5} />
                </View>
              </Marker>
            );
          })}
        </MapView>
      ) : (
        <View style={styles.emptyMap}>
          <ScreenTitle>{appText.nav.locator}</ScreenTitle>
        </View>
      )}
      {message && (
        <View style={styles.status}>
          <EggeoPanel>
            <EggeoText style={viewStyles.centerText}>{message}</EggeoText>
          </EggeoPanel>
        </View>
      )}
      {events.length > 0 && (
        <View style={styles.eventBar}>
          <ScrollView contentContainerStyle={styles.eventBarContent} horizontal showsHorizontalScrollIndicator={false}>
            <EggeoButton intent={!eventId ? undefined : 'ghost'} onPress={() => setEventId('')}>
              {appText.events.labels.allEggs}
            </EggeoButton>
            {events.map((event) => (
              <EggeoButton intent={eventId === event.id ? undefined : 'ghost'} key={event.id} onPress={() => setEventId(event.id)}>
                {event.title}
              </EggeoButton>
            ))}
          </ScrollView>
        </View>
      )}
      {selectedEgg && (
        <View style={styles.popover}>
          <EggeoPanel>
            <View style={viewStyles.stack}>
              <View style={viewStyles.row}>
                <EggIcon color={selectedEgg.color} seed={selectedEgg.id} size={54} />
                <EggeoButton intent="ghost" onPress={() => setSelectedEgg(null)}>
                  {appText.common.actions.close}
                </EggeoButton>
              </View>
              <EggeoText colorized style={viewStyles.cardTitle}>
                {selectedEgg.title || appText.eggs.labels.untitled}
              </EggeoText>
              {selectedEgg.description && <EggeoText style={viewStyles.centerText}>{selectedEgg.description}</EggeoText>}
              <EggeoText style={viewStyles.centerText}>{appText.eggs.points(selectedEgg.points)}</EggeoText>
            </View>
          </EggeoPanel>
        </View>
      )}
    </View>
  );
}
