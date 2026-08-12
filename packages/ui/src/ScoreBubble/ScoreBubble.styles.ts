import type { CSSProperties } from 'react';
import { StyleSheet } from 'react-native';
import { eggeoColors } from '../tokens';

export const styles = StyleSheet.create({
  bubble: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.86)',
    borderColor: eggeoColors.border,
    borderRadius: 999,
    borderWidth: 3,
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
});

export const webStyles = {
  bubble: {
    alignItems: 'center',
    background: 'rgb(255 255 255 / 0.86)',
    border: `3px solid ${eggeoColors.border}`,
    borderRadius: 999,
    display: 'grid',
    justifyItems: 'center',
    placeItems: 'center',
  },
} satisfies Record<string, CSSProperties>;
