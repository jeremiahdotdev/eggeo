import type { ApiEgg, ApiEggLocation } from '@eggeo/api-client';
import { appText } from '@eggeo/domain';
import { EggIcon, EggeoPanel, EggeoText } from '@eggeo/ui';
import * as Location from 'expo-location';
import { X } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import MapView, { Marker, type Region } from 'react-native-maps';
import { api } from '../../lib/api';
import { getCachedNearbyEggs, setCachedNearbyEggs } from '../../lib/offlineEggs';
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
      setEggs(visibleEggs);
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
        <MapView ref={mapRef} initialRegion={region} showsCompass={false} showsPointsOfInterest={false} showsUserLocation style={styles.map}>
          {eggs.map((egg) => {
            const coords = parseCoords(egg.coords);

            if (!coords) {
              return null;
            }

            return (
              <Marker key={egg.id} coordinate={coords} onPress={() => setSelectedEgg(egg)}>
                <EggIcon color={egg.color} seed={egg.id} size={36} strokeWidth={5} />
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
        {message && (
          <View style={styles.status}>
            <EggeoPanel>
              <EggeoText style={viewStyles.centerText}>{message}</EggeoText>
            </EggeoPanel>
          </View>
        )}
        {selectedEgg && (
          <View style={styles.popover}>
            <EggeoPanel style={styles.popoverPanel}>
              <ScrollView contentContainerStyle={styles.popoverContent} showsVerticalScrollIndicator={false}>
                <View style={viewStyles.row}>
                  <EggIcon color={selectedEgg.color} seed={selectedEgg.id} size={54} />
                  <Pressable accessibilityLabel={appText.common.actions.close} accessibilityRole="button" onPress={() => setSelectedEgg(null)} style={styles.closeButton}>
                    <X color="#111111" size={28} strokeWidth={3} />
                  </Pressable>
                </View>
                <EggeoText colorized style={viewStyles.cardTitle}>
                  {selectedEgg.title || appText.eggs.labels.untitled}
                </EggeoText>
                {selectedEgg.description && <EggeoText style={viewStyles.centerText}>{selectedEgg.description}</EggeoText>}
                <EggeoText style={viewStyles.centerText}>{appText.eggs.points(selectedEgg.points)}</EggeoText>
              </ScrollView>
            </EggeoPanel>
          </View>
        )}
      </View>
    </View>
  );
}
