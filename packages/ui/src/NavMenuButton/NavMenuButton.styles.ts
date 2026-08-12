import { StyleSheet } from 'react-native';
import { eggeoColors } from '../tokens';

export const styles = StyleSheet.create({
  nativeButton: {
    alignItems: 'center',
    backgroundColor: eggeoColors.paper,
    borderColor: eggeoColors.border,
    borderRadius: 6,
    borderWidth: 2,
    height: 44,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { height: 3, width: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 0,
    width: 44,
  },
});
