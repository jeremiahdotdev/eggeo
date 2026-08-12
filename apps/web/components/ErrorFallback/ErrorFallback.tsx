'use client';

import { EggeoButton, EggeoText } from '@eggeo/ui';
import { SkyScene } from '@/components/SkyScene';
import styles from './ErrorFallback.module.css';

export function ErrorFallback({
  actionLabel = 'Go Home',
  message,
  onAction,
  title = 'Oops! Something went wrong.',
}: {
  actionLabel?: string;
  message?: string;
  onAction: () => void;
  title?: string;
}) {
  return (
    <SkyScene className="hero">
      <section className={styles.panel}>
        <div className={styles.title}>
          <EggeoText className={styles.titleText} colorized variant="pageTitle">
            {title}
          </EggeoText>
        </div>
        {message && (
          <div className={styles.message}>
            <EggeoText>{message}</EggeoText>
          </div>
        )}
        <EggeoButton intent="secondary" onPress={onAction}>
          {actionLabel}
        </EggeoButton>
      </section>
    </SkyScene>
  );
}
