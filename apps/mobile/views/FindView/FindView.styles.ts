import { eggeoColors } from '@eggeo/ui';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  actionStack: {
    alignSelf: 'stretch',
    gap: 10,
  },
  eggPreview: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: eggeoColors.paper,
    borderColor: eggeoColors.border,
    borderRadius: 999,
    borderWidth: 2,
    height: 168,
    justifyContent: 'center',
    width: 168,
  },
  mutedText: {
    opacity: 0.7,
  },
  pointsText: {
    fontSize: 20,
    lineHeight: 26,
    textAlign: 'center',
  },
  resultCopy: {
    alignItems: 'center',
    gap: 8,
  },
  resultPanel: {
    alignItems: 'center',
    gap: 16,
  },
});
