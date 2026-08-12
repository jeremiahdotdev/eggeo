import type { CSSProperties } from 'react';
import { StyleSheet } from 'react-native';
import { eggeoColors, eggeoFonts } from '../tokens';

export const qrCardSize = 168;

export const styles = StyleSheet.create({
  actions: {
    alignSelf: 'stretch',
    display: 'flex',
  },
  card: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: eggeoColors.paper,
    borderColor: eggeoColors.border,
    borderRadius: 8,
    borderWidth: 2,
    gap: 12,
    minWidth: 0,
    overflow: 'hidden',
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 0,
  },
  frame: {
    alignItems: 'center',
    backgroundColor: eggeoColors.paper,
    borderColor: eggeoColors.border,
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: 'center',
    maxWidth: '100%',
    padding: 12,
  },
  qrBox: {
    alignItems: 'center',
    height: qrCardSize,
    justifyContent: 'center',
    width: qrCardSize,
  },
  title: {
    fontFamily: eggeoFonts.comic,
    fontSize: 19,
    fontWeight: '900',
    lineHeight: 22,
    margin: 0,
    maxWidth: '100%',
    textAlign: 'center',
  },
});

export const webStyles = {
  actions: {
    display: 'flex',
    width: '100%',
  },
  card: {
    alignItems: 'center',
    backgroundColor: eggeoColors.paper,
    border: `2px solid ${eggeoColors.border}`,
    borderRadius: 8,
    boxShadow: '8px 8px 0 rgb(0 0 0 / 0.16)',
    boxSizing: 'border-box',
    display: 'grid',
    gap: 12,
    justifyItems: 'center',
    maxWidth: '100%',
    padding: 18,
    textAlign: 'center',
    width: '100%',
  },
  frame: {
    background: eggeoColors.paper,
    border: `2px solid ${eggeoColors.border}`,
    borderRadius: 8,
    boxSizing: 'border-box',
    display: 'grid',
    padding: 12,
    placeItems: 'center',
  },
  qrBox: {
    display: 'grid',
    height: qrCardSize,
    placeItems: 'center',
    width: qrCardSize,
  },
  title: {
    fontFamily: `${eggeoFonts.comic}, "Comic Sans MS", "Comic Sans", Arial, sans-serif`,
    fontSize: '1.18rem',
    fontWeight: 900,
    lineHeight: 1.12,
    margin: 0,
    textAlign: 'center',
  },
} satisfies Record<string, CSSProperties>;
