import { requirePageSession } from '@/components/RequireAuth';
import { EventsClient } from './EventsClient';

export default async function EventsPage() {
  await requirePageSession();

  return <EventsClient />;
}
