import type { CSSProperties } from 'react';
import { StyleSheet } from 'react-native';
import { eggeoColors } from '../tokens';

export const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#FBBF24',
    borderBottomWidth: 2,
    borderColor: eggeoColors.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  text: {
    color: '#111111',
    fontSize: 14,
    textAlign: 'center',
  },
});

export const webStyles = {
  banner: {
    backgroundColor: '#FBBF24',
    borderBottom: `2px solid ${eggeoColors.border}`,
    color: '#111111',
    fontSize: 14,
    padding: '8px 14px',
    textAlign: 'center',
  },
} satisfies Record<string, CSSProperties>;
