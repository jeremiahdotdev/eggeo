import { eggeoColors } from '@eggeo/ui';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  eggMarker: {
    alignItems: 'center',
    backgroundColor: eggeoColors.paper,
    borderColor: eggeoColors.border,
    borderRadius: 999,
    borderWidth: 2,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  emptyMap: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 18,
  },
  eventBar: {
    left: 18,
    position: 'absolute',
    right: 18,
    top: 18,
    zIndex: 4,
  },
  eventBarContent: {
    gap: 8,
  },
  map: {
    flex: 1,
  },
  popover: {
    bottom: 18,
    left: 18,
    position: 'absolute',
    right: 18,
  },
  screen: {
    flex: 1,
  },
  status: {
    left: 18,
    position: 'absolute',
    right: 18,
    top: 82,
  },
});
