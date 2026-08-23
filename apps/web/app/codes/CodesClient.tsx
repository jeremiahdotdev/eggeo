'use client';

import { useEffect, useState } from 'react';
import type { ApiEgg } from '@eggeo/api-client';
import { appText } from '@eggeo/domain';
import { EggeoEventPicker, EggeoQrCard } from '@eggeo/ui';
import { QRCodeSVG } from 'qrcode.react';
import { useEventSelection } from '@/components/EventSelection';
import { PrintAction } from '@/components/PrintAction';
import { PrintEggSheet } from '@/components/PrintEggSheet';
import { SkyPage } from '@/components/SkyScene';
import { apiRequest } from '@/lib/clientApi';
import { parseLinkFromEgg } from '@/lib/egg';
import styles from './page.module.css';

export function CodesClient() {
  const { events, refreshEvents, selectedOwnerEvent, setSelectedEventId } = useEventSelection();
  const [eggs, setEggs] = useState<ApiEgg[]>([]);
  const [isLoadingEggs, setIsLoadingEggs] = useState(false);
  const [deletingEggId, setDeletingEggId] = useState('');
  const eventId = selectedOwnerEvent?.id ?? '';

  useEffect(() => {
    let isCancelled = false;

    async function loadEggs() {
      if (!eventId) {
        setEggs([]);
        return;
      }

      setIsLoadingEggs(true);

      try {
        const params = new URLSearchParams({ eventId });
        const nextEggs = await apiRequest<ApiEgg[]>(`/api/user-eggs?${params}`);

        if (!isCancelled) {
          setEggs(nextEggs);
        }
      } catch {
        if (!isCancelled) {
          setEggs([]);
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingEggs(false);
        }
      }
    }

    void loadEggs();

    return () => {
      isCancelled = true;
    };
  }, [eventId]);

  async function deleteEgg(id: string) {
    setDeletingEggId(id);

    try {
      await apiRequest<{ deleted: boolean }>(`/api/eggs/${id}`, undefined, { method: 'DELETE' });
      setEggs((currentEggs) => currentEggs.filter((egg) => egg.id !== id));
      await refreshEvents(eventId);
    } finally {
      setDeletingEggId('');
    }
  }

  const isEmpty = !eventId || isLoadingEggs || eggs.length === 0;

  return (
    <SkyPage>
      <div className={`${styles.printControls} no-print`}>
        <EggeoEventPicker
          allLabel={appText.events.labels.selectEvent}
          events={events}
          ownerOnly
          requireSelection
          selectedEventId={eventId}
          webStyle={{ margin: 0, maxWidth: 320, width: '100%' }}
          onSelect={setSelectedEventId}
        />
        <PrintAction disabled={!selectedOwnerEvent || isLoadingEggs || eggs.length === 0} />
      </div>
      <PrintEggSheet
        emptyMessage={!eventId ? appText.eggs.messages.selectEventToPrint : isLoadingEggs ? 'Loading eggs...' : undefined}
        isEmpty={isEmpty}
      >
        {eggs.map((egg) => (
          <EggeoQrCard
            action={
              <button className={styles.deleteButton} disabled={deletingEggId === egg.id} onClick={() => void deleteEgg(egg.id)} type="button">
                {appText.common.actions.delete}
              </button>
            }
            color={egg.color}
            key={egg.id}
            qr={<QRCodeSVG value={parseLinkFromEgg(egg.id)} />}
            title={egg.title || appText.eggs.labels.untitled}
          />
        ))}
      </PrintEggSheet>
    </SkyPage>
  );
}
