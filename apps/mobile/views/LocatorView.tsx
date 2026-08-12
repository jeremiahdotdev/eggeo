import { appText } from '@eggeo/static-text';
import { EggeoPanel, EggeoText } from '@eggeo/ui';
import { View } from 'react-native';
import { ScreenTitle, viewStyles } from './shared';

export function LocatorView() {
  return (
    <View style={viewStyles.stack}>
      <ScreenTitle>{appText.nav.locator}</ScreenTitle>
      <EggeoPanel>
        <EggeoText style={viewStyles.centerText}>{appText.map.messages.mobilePlaceholder}</EggeoText>
      </EggeoPanel>
    </View>
  );
}
