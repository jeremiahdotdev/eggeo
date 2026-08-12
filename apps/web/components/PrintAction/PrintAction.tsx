'use client';

import { appText } from '@eggeo/domain';
import { EggeoButton } from '@eggeo/ui';
import styles from './PrintAction.module.css';

export function PrintAction({ disabled = false }: { disabled?: boolean }) {
  return (
    <div className={`${styles.wrap} no-print`}>
      <EggeoButton disabled={disabled} intent="secondary" onPress={() => window.print()}>
        {appText.nav.print}
      </EggeoButton>
    </div>
  );
}
