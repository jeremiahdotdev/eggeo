'use client';

import { useMemo, useState } from 'react';
import { appText } from '@eggeo/domain';
import { EggeoEventQrCard, EggeoText } from '@eggeo/ui';
import { QRCodeSVG } from 'qrcode.react';
import { CreateEventForm } from '@/components/CreateEventForm';
import { useEventSelection } from '@/components/EventSelection';
import { PrintEggSheet } from '@/components/PrintEggSheet';
import { SkyPage } from '@/components/SkyScene';
import { apiRequest } from '@/lib/clientApi';
import { parseLinkFromEvent } from '@/lib/egg';

export function EventsClient() {
  const { events, refreshEvents } = useEventSelection();
  const [deletingEventId, setDeletingEventId] = useState('');
  const ownedEvents = useMemo(() => events.filter((event) => event.isOwner), [events]);

  async function deleteEvent(id: string) {
    setDeletingEventId(id);

    try {
      await apiRequest<{ deleted: boolean }>(`/api/events/${id}`, undefined, { method: 'DELETE' });
      await refreshEvents();
    } finally {
      setDeletingEventId('');
    }
  }

  return (
    <SkyPage>
      <EggeoText colorized variant="pageTitle">
        {appText.nav.events}
      </EggeoText>
      <CreateEventForm />
      <PrintEggSheet isEmpty={ownedEvents.length === 0}>
        {ownedEvents.map((event) => (
          <EggeoEventQrCard
            disabled={deletingEventId === event.id}
            isOwner
            key={event.id}
            onDelete={() => void deleteEvent(event.id)}
            qr={<QRCodeSVG value={parseLinkFromEvent(event.id)} />}
            title={event.title}
          />
        ))}
      </PrintEggSheet>
    </SkyPage>
  );
}
