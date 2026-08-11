<script setup lang="ts">
import { GoogleMap, CustomMarker } from 'vue3-google-map';
import { $getEggsNearLocation } from '~/composables/gateway/egg';
import { useGeolocation } from '@vueuse/core';
import type { Egg, Location } from '~/types/egg';

const config = useRuntimeConfig();
const { coords, locatedAt } = useGeolocation();
const eggs = ref<Egg[]>();
const center = ref<Location>({ lat: 0, lng: 0 });
const searchedCoords = ref();
const searchedTime = ref();

const surpassedDistanceThreshold = (searched: any, current: any) => {
  if (!searched || !searched?.value) return true;
  if (!current || !current?.value) return true;

  const s = searched.value;
  const c = current.value;

  const latDiff = c.latitude - s.latitude;
  const lngDiff = c.longitude - s.longitude;

  return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) > 0.001;
};
const surpassedTimeThreshold = (searched: any, current: any) => {
  if (!searched) return true;
  if (!current) return true;

  return Math.abs(current - searched) > 60000;
};

const parseLatLng = (location: GeolocationCoordinates) => {
  return { lat: location.latitude, lng: location.longitude } as Location;
};
const parseLocation = (location: Location) => {
  return { latitude: location.lat, longitude: location.lng } as GeolocationCoordinates;
};
const float = (location?: { lat: string | number; lng: string | number }) => {
  if (!location) return;
  return {
    lat: typeof location.lat === 'string' ? parseFloat(location.lat) : location.lat,
    lng: typeof location.lng === 'string' ? parseFloat(location.lng) : location.lat,
  } as Location;
};
const filtered = (listOfEggs: any) => {
  if (!listOfEggs || !Array.isArray(listOfEggs)) return [];

  return listOfEggs.filter((egg: any) => !!egg.coords && !!egg.coords.lat && !!egg.coords.lng);
};

watch(locatedAt, async (newValue, oldValue) => {
  center.value = parseLatLng(coords.value);
  if (
    oldValue === null ||
    surpassedDistanceThreshold(searchedCoords, coords) ||
    surpassedTimeThreshold(searchedTime.value, newValue)
  ) {
    searchedCoords.value = coords.value;
    searchedTime.value = newValue;
    const [eggsNearby, error] = await $getEggsNearLocation({ coords: parseLatLng(coords.value) });
    const filteredEggs = filtered(eggsNearby);
    eggs.value = filteredEggs; // .length > 5 ? filteredEggs.slice(0, 5) : filteredEggs;
  }
});
</script>

<template>
  <GoogleMap class="h-full w-full" :apiKey="config.public.mapsApiKey" :center="center" :zoom="17">
    <CustomMarker key="current-user" :options="{ position: center, anchorPoint: 'CENTER' }">
      <span key="current-user-marker" class="flex items-center justify-center flex-col">
        <vUser :dimensions="{ width: 25 }" />
      </span>
    </CustomMarker>
    <CustomMarker
      v-for="egg of eggs"
      :key="`${egg.id}-${egg.coords?.lat}${egg.coords?.lng}`"
      :options="{
        position: float(egg.coords),
        anchorPoint: 'CENTER',
      }"
    >
      <span :key="egg.id" class="flex items-center justify-center flex-col">
        <EggImage :id="egg.id" :color="egg.color" :dimensions="{ width: 25 }" />
      </span>
    </CustomMarker>
  </GoogleMap>
</template>
