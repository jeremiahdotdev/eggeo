import { requirePageSession } from '@/components/RequireAuth';
import { CodesClient } from './CodesClient';

export default async function CodesPage() {
  await requirePageSession();

  return <CodesClient />;
}
