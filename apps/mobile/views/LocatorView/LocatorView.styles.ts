import { eggeoColors } from '@eggeo/ui';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  closeButton: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: eggeoColors.border,
    borderRadius: 999,
    borderWidth: 2,
    height: 46,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 0,
    width: 46,
  },
  emptyMap: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 18,
  },
  map: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 0,
  },
  overlayLayer: {
    bottom: 0,
    elevation: 20,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 20,
  },
  popover: {
    bottom: 102,
    elevation: 7,
    left: 18,
    maxHeight: '48%',
    position: 'absolute',
    right: 18,
    zIndex: 6,
  },
  popoverContent: {
    gap: 14,
  },
  popoverPanel: {
    maxHeight: '100%',
  },
  screen: {
    flex: 1,
    overflow: 'visible',
    position: 'relative',
  },
  status: {
    left: 18,
    position: 'absolute',
    right: 18,
    top: 18,
  },
});
