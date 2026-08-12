'use client';

import type { CSSProperties } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { appText } from '@eggeo/domain';
import { EggeoEventPicker } from '@eggeo/ui';

type EventOption = {
  id: string;
  title: string;
};

export function EventFilter({
  allLabel = appText.events.labels.allEggs,
  events,
  requireSelection = false,
  webStyle,
}: {
  allLabel?: string;
  events: EventOption[];
  requireSelection?: boolean;
  webStyle?: CSSProperties;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedEventId = searchParams.get('eventId') ?? '';

  function changeEvent(eventId: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (eventId) {
      params.set('eventId', eventId);
    } else {
      params.delete('eventId');
    }

    router.push(`/codes${params.size ? `?${params}` : ''}`);
  }

  return (
    <EggeoEventPicker
      allLabel={allLabel}
      events={events}
      requireSelection={requireSelection}
      selectedEventId={selectedEventId}
      webStyle={webStyle}
      onSelect={changeEvent}
    />
  );
}
