import { eggeoColors } from '@eggeo/ui';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  authHeader: {
    marginBottom: 22,
  },
  authPanelWrap: {
    alignSelf: 'stretch',
    paddingHorizontal: 18,
    zIndex: 2,
  },
  fullPageContent: {
    alignSelf: 'stretch',
    elevation: 2,
    flex: 1,
    position: 'relative',
    zIndex: 2,
  },
  keyboard: {
    flex: 1,
  },
  paddedFullPageContent: {
    padding: 18,
  },
  safeArea: {
    backgroundColor: eggeoColors.sky,
    flex: 1,
  },
  scroll: {
    alignSelf: 'stretch',
    elevation: 2,
    flex: 1,
    position: 'relative',
    zIndex: 2,
  },
  scrollContent: {
    flexGrow: 1,
    gap: 18,
    paddingBottom: 180,
    paddingHorizontal: 18,
    paddingTop: 18,
  },
});
