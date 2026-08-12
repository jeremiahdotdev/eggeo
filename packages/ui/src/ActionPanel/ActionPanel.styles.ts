import type { CSSProperties } from 'react';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  button: {
    width: '100%',
  },
  label: {
    textAlign: 'center',
  },
  panel: {
    width: '100%',
  },
});

export const webStyles = {
  link: {
    display: 'block',
    textDecoration: 'none',
    width: '100%',
  },
} satisfies Record<string, CSSProperties>;
