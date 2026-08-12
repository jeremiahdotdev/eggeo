import type { CSSProperties } from 'react';
import { StyleSheet } from 'react-native';
import { eggeoColors } from '../tokens';

export const styles = StyleSheet.create({
  nativeField: {
    gap: 6,
  },
  nativeLabel: {
    color: eggeoColors.ink,
    fontWeight: '900',
  },
  nativeChevron: {
    color: eggeoColors.ink,
    fontSize: 18,
    fontWeight: '900',
  },
  nativeMenu: {
    alignSelf: 'stretch',
    backgroundColor: eggeoColors.paper,
    borderColor: eggeoColors.border,
    borderRadius: 8,
    borderWidth: 2,
    marginHorizontal: 18,
    maxHeight: '70%',
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 0,
  },
  nativeMenuList: {
    gap: 10,
  },
  nativeMenuTitle: {
    color: eggeoColors.ink,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 12,
    textAlign: 'center',
  },
  nativeOption: {
    backgroundColor: eggeoColors.paper,
    borderColor: eggeoColors.border,
    borderRadius: 6,
    borderWidth: 2,
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  nativeOptionSelected: {
    backgroundColor: '#FBBF24',
  },
  nativeOptionText: {
    color: eggeoColors.ink,
    fontSize: 16,
    fontWeight: '900',
  },
  nativeOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.32)',
    flex: 1,
    justifyContent: 'center',
  },
  nativeSelect: {
    alignItems: 'center',
    backgroundColor: '#FBBF24',
    borderColor: eggeoColors.border,
    borderRadius: 8,
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 0,
  },
  nativeSelectDisabled: {
    opacity: 0.6,
  },
  nativeSelectText: {
    color: eggeoColors.ink,
    flex: 1,
    fontSize: 17,
    fontWeight: '900',
  },
});

export const webStyles = {
  field: {
    color: eggeoColors.ink,
    display: 'grid',
    gap: 6,
    fontWeight: 900,
    width: '100%',
  },
  form: {
    alignItems: 'center',
    display: 'flex',
    gap: 10,
    justifyContent: 'center',
    margin: '0 auto',
    maxWidth: 420,
    width: '100%',
  },
  select: {
    background: '#FBBF24',
    border: `2px solid ${eggeoColors.border}`,
    borderRadius: 8,
    boxSizing: 'border-box',
    color: eggeoColors.ink,
    font: 'inherit',
    fontSize: 17,
    fontWeight: 900,
    minHeight: 48,
    padding: '8px 36px 8px 14px',
    boxShadow: '4px 4px 0 rgb(0 0 0 / 0.2)',
    width: '100%',
  },
} satisfies Record<string, CSSProperties>;
