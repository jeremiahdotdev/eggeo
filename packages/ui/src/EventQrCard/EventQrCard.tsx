'use client';

import type { ReactNode } from 'react';
import { appText } from '@eggeo/domain';
import { eggeoColors } from '../tokens';
import { EggeoButton } from '../primitives';
import { EggeoQrCard } from '../QrCard';
import { QrCodeOutline } from '../QrCodeOutline';
import { styles } from './EventQrCard.styles';

type QrCardWebClasses = {
  actions?: string;
  frame?: string;
  qrBox?: string;
  root?: string;
  title?: string;
};

type EggeoEventQrCardProps = {
  deleteLabel?: string;
  disabled?: boolean;
  isOwner?: boolean | null;
  onDelete?: () => void;
  qr?: ReactNode;
  title?: string | null;
  webClasses?: QrCardWebClasses;
};

export function EggeoEventQrCard({
  deleteLabel = appText.common.actions.delete,
  disabled = false,
  isOwner = false,
  onDelete,
  qr,
  title,
  webClasses,
}: EggeoEventQrCardProps) {
  return (
    <EggeoQrCard
      action={
        isOwner && onDelete ? (
          <EggeoButton disabled={disabled} intent="danger" onPress={onDelete} style={styles.deleteButton}>
            {deleteLabel}
          </EggeoButton>
        ) : undefined
      }
      color={eggeoColors.paper}
      qr={qr ?? <QrCodeOutline style={styles.qr} />}
      title={title || appText.events.labels.untitled}
      webClasses={webClasses}
    />
  );
}
