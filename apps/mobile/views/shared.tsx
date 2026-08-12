import { EggeoText } from '@eggeo/ui';
import { StyleSheet } from 'react-native';

export function ScreenTitle({ children }: { children: string }) {
  return (
    <EggeoText colorized style={viewStyles.screenTitle} variant="pageTitle">
      {children.toUpperCase()}
    </EggeoText>
  );
}

export function ScreenMessage({ children }: { children?: string }) {
  return children && <EggeoText style={viewStyles.message}>{children}</EggeoText>;
}

export const viewStyles = StyleSheet.create({
  cardTitle: {
    fontSize: 28,
    lineHeight: 34,
    textAlign: 'center',
  },
  centerText: {
    textAlign: 'center',
  },
  message: {
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
    gap: 14,
  },
});
