'use client';

import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';
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

  return (
    <article className="egg-card" style={{ backgroundColor: egg.color ?? '#fff' }}>
      <h2>{egg.title || 'Untitled Egg'}</h2>
      <div className="qr-frame">
        <QRCodeSVG value={parseLinkFromEgg(egg.id)} size={160} />
      </div>
      <button className="button danger no-print" disabled={isDeleting} onClick={deleteEgg} type="button">
        Delete
      </button>
    </article>
  );
}
