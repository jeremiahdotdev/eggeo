import { StyleSheet } from 'react-native';

export const viewStyles = StyleSheet.create({
  cardTitle: {
    fontSize: 28,
    lineHeight: 34,
    textAlign: 'center',
  },
  centerText: {
    textAlign: 'center',
  },
  floatingBlock: {
    backgroundColor: 'rgba(255, 255, 255, 0.86)',
    borderColor: '#2d2d2d',
    borderRadius: 6,
    borderWidth: 2,
    gap: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.14,
    shadowRadius: 0,
  },
  message: {
    backgroundColor: 'rgba(255, 255, 255, 0.86)',
    borderColor: '#2d2d2d',
    borderRadius: 6,
    borderWidth: 2,
    paddingHorizontal: 10,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.14,
    shadowRadius: 0,
    textAlign: 'center',
  },
  panelTitle: {
    fontSize: 52,
    lineHeight: 58,
    textAlign: 'center',
  },
  rankName: {
    flex: 1,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  screenTitle: {
    fontSize: 48,
    lineHeight: 56,
    textAlign: 'center',
  },
  stack: {
    alignSelf: 'stretch',
    elevation: 3,
    gap: 14,
    minWidth: 0,
    position: 'relative',
    width: '100%',
    zIndex: 3,
  },
});
