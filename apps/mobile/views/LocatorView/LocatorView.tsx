import type { ApiEgg, ApiEggLocation } from '@eggeo/api-client';
import { appText } from '@eggeo/domain';
import { EggIcon, EggeoPanel, EggeoText } from '@eggeo/ui';
import * as Location from 'expo-location';
import { X } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import MapView, { Marker, type Region } from 'react-native-maps';
import { HuntScore } from '../../components/HuntScore';
import { api } from '../../lib/api';
import { applyQueuedEggActions, getCachedNearbyEggs, setCachedNearbyEggs } from '../../lib/offlineEggs';
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

export function LocatorView({
  offlineSyncRevision = 0,
  selectedEventId,
}: {
  offlineSyncRevision?: number;
  selectedEventId: string;
}) {
  const mapRef = useRef<MapView | null>(null);
  const [region, setRegion] = useState<Region | null>(null);
  const [eggs, setEggs] = useState<ApiEgg[]>([]);
  const [message, setMessage] = useState('Finding your location...');
  const [selectedEgg, setSelectedEgg] = useState<ApiEgg | null>(null);
  const eventId = selectedEventId;

  const loadNearby = useCallback(async (coords: { latitude: number; longitude: number }, nextEventId = eventId) => {
    if (!nextEventId) {
      setEggs([]);
      return;
    }

    try {
      const nearby = await api.getNearbyEggs({ lat: coords.latitude, lng: coords.longitude }, nextEventId);
      const visibleEggs = nearby.filter((egg) => parseCoords(egg.coords));
      setEggs(await applyQueuedEggActions(nextEventId, visibleEggs));
      setMessage('');
      await setCachedNearbyEggs(nextEventId, visibleEggs);
    } catch (error) {
      console.error(error);
      const cachedEggs = (await getCachedNearbyEggs(nextEventId)).filter((egg) => parseCoords(egg.coords));
      setEggs(cachedEggs);
      setMessage(cachedEggs.length > 0 ? 'Showing saved egg locations.' : appText.eggs.messages.unableToLoadEggs);
    }
  }, [eventId]);

  useEffect(() => {
    if (region) {
      void loadNearby(region);
    }
  }, [eventId, loadNearby, offlineSyncRevision, region]);

  useEffect(() => {
    setSelectedEgg(null);
  }, [eventId]);

  useEffect(() => {
    let isMounted = true;

    async function loadCachedEggs() {
      if (!eventId) {
        setEggs([]);
        return;
      }

      const cachedEggs = (await getCachedNearbyEggs(eventId)).filter((egg) => parseCoords(egg.coords));

      if (isMounted && cachedEggs.length > 0) {
        setEggs(cachedEggs);
        const coords = parseCoords(cachedEggs[0].coords);
        if (coords) setRegion(current => current ?? { ...coords, latitudeDelta, longitudeDelta });
      }
    }

    void loadCachedEggs();

    return () => {
      isMounted = false;
    };
  }, [eventId, offlineSyncRevision]);

  useEffect(() => {
    let subscription: Location.LocationSubscription | undefined;
    let isMounted = true;

    async function watchLocation() {
      const permission = await Location.requestForegroundPermissionsAsync();

      if (!permission.granted) {
        setMessage('Allow location access to center the map and show nearby eggs.');
        return;
      }

      const nextSubscription = await Location.watchPositionAsync(
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

        },
      );
      if (isMounted) subscription = nextSubscription;
      else nextSubscription.remove();
    }

    void watchLocation().catch(() => {
      if (isMounted) setMessage('Location is unavailable. Showing saved egg locations when available.');
    });

    return () => {
      isMounted = false;
      subscription?.remove();
    };
  }, [loadNearby]);

  return (
    <View style={styles.screen}>
      {region ? (
        <MapView ref={mapRef} initialRegion={region} showsCompass={false} showsPointsOfInterest={false} showsUserLocation style={styles.map}>
          {eggs.map((egg) => {
            const coords = parseCoords(egg.coords);

            if (!coords) {
              return null;
            }

            return (
              <Marker key={egg.id} coordinate={coords} onPress={() => setSelectedEgg(egg)}>
                <EggIcon color={egg.color} seed={egg.id} size={36} strokeWidth={6} />
              </Marker>
            );
          })}
        </MapView>
      ) : (
        <View style={styles.emptyMap}>
          <ScreenTitle>{appText.nav.locator}</ScreenTitle>
        </View>
      )}
      <View pointerEvents="box-none" style={styles.overlayLayer}>
        <View style={styles.status}><EggeoPanel>
          <HuntScore eventId={eventId} revision={offlineSyncRevision} />
          {Boolean(message) && <EggeoText>{message}</EggeoText>}
        </EggeoPanel></View>
        {selectedEgg && (
          <View style={styles.popover}>
            <EggeoPanel style={styles.popoverPanel}>
              <ScrollView contentContainerStyle={styles.popoverContent} showsVerticalScrollIndicator={false}>
                <View style={viewStyles.row}>
                  <EggeoText style={styles.popoverTitle}>
                    {selectedEgg.title || appText.eggs.labels.untitled}
                  </EggeoText>
                  <Pressable accessibilityLabel={appText.common.actions.close} accessibilityRole="button" onPress={() => setSelectedEgg(null)} style={styles.closeButton}>
                    <X color="#111111" size={24} strokeWidth={3} />
                  </Pressable>
                </View>
                {selectedEgg.description && <EggeoText style={styles.popoverDescription}>{selectedEgg.description}</EggeoText>}
              </ScrollView>
            </EggeoPanel>
          </View>
        )}
      </View>
    </View>
  );
}
