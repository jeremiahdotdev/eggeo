import { StyleSheet } from 'react-native';

export const nativeGrassWind = {
  'wind-a': { duration: 2700, translateX: 2.5 },
  'wind-b': { duration: 3100, translateX: -2 },
  'wind-c': { duration: 2400, translateX: 3.25 },
} as const;

export type GrassWind = keyof typeof nativeGrassWind;

export const nativeStyles = StyleSheet.create({
  grassOverlay: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 3,
  },
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
});
