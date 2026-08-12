'use client';

import { appText } from '@eggeo/static-text';
import { EggeoButton } from '@eggeo/ui';

export function PrintAction() {
  return (
    <div className="no-print">
      <EggeoButton intent="secondary" onPress={() => window.print()}>
        {appText.nav.print}
      </EggeoButton>
    </div>
  );
}
