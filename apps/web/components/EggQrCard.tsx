'use client';

import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';
import { EggeoButton } from '@eggeo/ui';
import { apiRequest } from '@/lib/clientApi';
import { parseLinkFromEgg } from '@/lib/egg';

type Egg = {
  id: string;
  title?: string | null;
  color?: string | null;
};

export function EggQrCard({ egg }: { egg: Egg }) {
  const [isDeleted, setIsDeleted] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function deleteEgg() {
    setIsDeleting(true);
    try {
      await apiRequest(`/api/eggs/${egg.id}`, undefined, { method: 'DELETE' });
      setIsDeleted(true);
    } finally {
      setIsDeleting(false);
    }
  }

  if (isDeleted) return null;

  const eggLink = parseLinkFromEgg(egg.id);

  return (
    <article className="egg-card" style={{ backgroundColor: egg.color ?? '#fff' }}>
      <div className="qr-frame">
        <QRCodeSVG value={eggLink} size={160} />
      </div>
      <h2>{egg.title || 'Untitled Egg'}</h2>
      <p className="qr-blurb">{eggLink}</p>
      <div className="no-print">
        <EggeoButton disabled={isDeleting} intent="danger" onPress={deleteEgg}>
          Delete
        </EggeoButton>
      </div>
    </article>
  );
}
