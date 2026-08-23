import type { ApiEgg, ApiEggLocation, ApiEvent } from '@eggeo/api-client';
import { appText } from '@eggeo/domain';
import { EggIcon, EggeoButton, EggeoEventPicker, EggeoPanel, EggeoText } from '@eggeo/ui';
import * as Location from 'expo-location';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import MapView, { Marker, type Region } from 'react-native-maps';
import Svg, { Circle, Path } from 'react-native-svg';
import { api } from '../../lib/api';
import { styles } from './LocatorView.styles';
import { FindView } from '../FindView';
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
  const [isFindModalOpen, setIsFindModalOpen] = useState(false);
  const [message, setMessage] = useState('Finding your location...');
  const [selectedEgg, setSelectedEgg] = useState<ApiEgg | null>(null);

  const loadNearby = useCallback(async (coords: { latitude: number; longitude: number }, nextEventId = eventId) => {
    if (!nextEventId) {
      setEggs([]);
      return;
    }

    try {
      const nearby = await api.getNearbyEggs({ lat: coords.latitude, lng: coords.longitude }, nextEventId);
      setEggs(nearby.filter((egg) => parseCoords(egg.coords)));
    } catch (error) {
      console.error(error);
    }
  }, [eventId]);

  useEffect(() => {
    api
      .getEvents()
      .then((nextEvents) => {
        setEvents(nextEvents);
        setEventId((currentEventId) => currentEventId || nextEvents[0]?.id || '');
      })
      .catch(() => {
        setEvents([]);
        setEventId('');
      });
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
        <MapView ref={mapRef} initialRegion={region} showsCompass={false} showsPointsOfInterest={false} showsUserLocation style={styles.map}>
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
          <EggeoEventPicker
            allLabel={appText.events.labels.selectEvent}
            events={events}
            requireSelection
            selectedEventId={eventId}
            style={styles.eventPicker}
            onSelect={(nextEventId) => {
              setEventId(nextEventId);
              setSelectedEgg(null);
            }}
          />
        </View>
      )}
      <Pressable accessibilityLabel="Open QR finder" accessibilityRole="button" onPress={() => setIsFindModalOpen(true)} style={styles.findButton}>
        <Svg fill="none" height={30} stroke="#111111" strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} viewBox="0 0 30 30" width={30}>
          <Circle cx={13} cy={13} r={8} />
          <Path d="M19 19 25 25" />
        </Svg>
      </Pressable>
      {selectedEgg && (
        <View style={styles.popover}>
          <EggeoPanel style={styles.popoverPanel}>
            <ScrollView contentContainerStyle={styles.popoverContent} showsVerticalScrollIndicator={false}>
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
            </ScrollView>
          </EggeoPanel>
        </View>
      )}
      <Modal animationType="slide" onRequestClose={() => setIsFindModalOpen(false)} transparent visible={isFindModalOpen}>
        <Pressable onPress={() => setIsFindModalOpen(false)} style={styles.findModalOverlay}>
          <Pressable onPress={(event) => event.stopPropagation()} style={styles.findModalPanel}>
            <View style={styles.findModalHeader}>
              <EggeoText colorized style={styles.findModalTitle}>
                {appText.nav.find}
              </EggeoText>
              <EggeoButton intent="ghost" onPress={() => setIsFindModalOpen(false)}>
                {appText.common.actions.close}
              </EggeoButton>
            </View>
            <ScrollView contentContainerStyle={styles.findModalContent} showsVerticalScrollIndicator={false}>
              <FindView showTitle={false} />
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
