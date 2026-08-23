'use client';

import type { ApiEvent } from '@eggeo/api-client';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiRequest } from '@/lib/clientApi';

const STORAGE_KEY = 'eggeo.selectedEventId';

type EventSelectionContextValue = {
  events: ApiEvent[];
  isLoadingEvents: boolean;
  ownerEvents: ApiEvent[];
  refreshEvents: (preferredEventId?: string) => Promise<ApiEvent[]>;
  selectedEvent: ApiEvent | undefined;
  selectedEventId: string;
  selectedOwnerEvent: ApiEvent | undefined;
  setSelectedEventId: (eventId: string) => void;
};

const EventSelectionContext = createContext<EventSelectionContextValue | undefined>(undefined);

function eventExists(events: ApiEvent[], eventId?: string | null) {
  return Boolean(eventId && events.some((event) => event.id === eventId));
}

function getSelectedEventId(events: ApiEvent[], currentEventId: string, preferredEventId?: string) {
  if (eventExists(events, preferredEventId)) {
    return preferredEventId ?? '';
  }

  if (eventExists(events, currentEventId)) {
    return currentEventId;
  }

  return events[0]?.id ?? '';
}

export function EventSelectionProvider({ children, initialEvents }: { children: React.ReactNode; initialEvents: ApiEvent[] }) {
  const searchParams = useSearchParams();
  const queryEventId = searchParams.get('eventId') ?? '';
  const hasReadStoredEventId = useRef(false);
  const lastAppliedQueryEventId = useRef('');
  const [events, setEvents] = useState<ApiEvent[]>(initialEvents);
  const [selectedEventId, setSelectedEventIdState] = useState(() => initialEvents[0]?.id ?? '');
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);

  useEffect(() => {
    setEvents(initialEvents);
    setSelectedEventIdState((currentEventId) => getSelectedEventId(initialEvents, currentEventId));
  }, [initialEvents]);

  useEffect(() => {
    if (queryEventId && queryEventId !== lastAppliedQueryEventId.current) {
      lastAppliedQueryEventId.current = queryEventId;
      setSelectedEventIdState((currentEventId) => getSelectedEventId(events, currentEventId, queryEventId));
      return;
    }

    if (hasReadStoredEventId.current) {
      return;
    }

    hasReadStoredEventId.current = true;
    const storedEventId = window.localStorage.getItem(STORAGE_KEY) ?? '';
    setSelectedEventIdState((currentEventId) => getSelectedEventId(events, currentEventId, storedEventId));
  }, [events, queryEventId]);

  useEffect(() => {
    if (selectedEventId) {
      window.localStorage.setItem(STORAGE_KEY, selectedEventId);
      return;
    }

    window.localStorage.removeItem(STORAGE_KEY);
  }, [selectedEventId]);

  const setSelectedEventId = useCallback(
    (eventId: string) => {
      setSelectedEventIdState((currentEventId) => getSelectedEventId(events, currentEventId, eventId));
    },
    [events],
  );

  const refreshEvents = useCallback(
    async (preferredEventId?: string) => {
      setIsLoadingEvents(true);

      try {
        const nextEvents = await apiRequest<ApiEvent[]>('/api/events');
        setEvents(nextEvents);
        setSelectedEventIdState((currentEventId) => getSelectedEventId(nextEvents, currentEventId, preferredEventId));
        return nextEvents;
      } finally {
        setIsLoadingEvents(false);
      }
    },
    [],
  );

  const value = useMemo<EventSelectionContextValue>(() => {
    const ownerEvents = events.filter((event) => event.isOwner);
    const selectedEvent = events.find((event) => event.id === selectedEventId);
    const selectedOwnerEvent = ownerEvents.find((event) => event.id === selectedEventId);

    return {
      events,
      isLoadingEvents,
      ownerEvents,
      refreshEvents,
      selectedEvent,
      selectedEventId,
      selectedOwnerEvent,
      setSelectedEventId,
    };
  }, [events, isLoadingEvents, refreshEvents, selectedEventId, setSelectedEventId]);

  return <EventSelectionContext.Provider value={value}>{children}</EventSelectionContext.Provider>;
}

export function useEventSelection() {
  const context = useContext(EventSelectionContext);

  if (!context) {
    throw new Error('useEventSelection must be used inside EventSelectionProvider.');
  }

  return context;
}
