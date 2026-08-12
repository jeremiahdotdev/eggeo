import type { ReactNode } from 'react';
import { appText } from '@eggeo/domain';
import { EggeoText } from '@eggeo/ui';
import styles from './PrintEggSheet.module.css';

export function PrintEggSheet({
  children,
  emptyMessage = appText.eggs.messages.noPrintableEggs,
  isEmpty = false,
}: {
  children: ReactNode;
  emptyMessage?: string;
  isEmpty?: boolean;
}) {
  if (isEmpty) {
    return (
      <section className={styles.empty}>
        <EggeoText>{emptyMessage}</EggeoText>
      </section>
    );
  }

  return <section className={styles.sheet}>{children}</section>;
}
