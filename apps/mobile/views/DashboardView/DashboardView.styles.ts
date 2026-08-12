import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  dashboard: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start',
    minHeight: 720,
    paddingTop: 16,
  },
  eggStage: {
    alignItems: 'center',
    height: 650,
    justifyContent: 'center',
    marginTop: 34,
    overflow: 'visible',
    position: 'relative',
    width: '100%',
    zIndex: 3,
  },
  eggWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -40,
    zIndex: 3,
  },
  scoreBubble: {
    position: 'absolute',
    zIndex: 4,
  },
});
