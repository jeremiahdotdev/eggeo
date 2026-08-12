import { notFound } from 'next/navigation';
import { prisma } from '@eggeo/db';
import { EggCard } from '@eggeo/ui';
import { requirePageSession } from '@/components/RequireAuth';
import { SkyPage } from '@/components/SkyScene';

export default async function EggPage({ params }: { params: Promise<{ uuid: string }> }) {
  await requirePageSession();
  const { uuid } = await params;
  const egg = await prisma.egg.findUnique({
    where: {
      id: uuid,
    },
    include: {
      coords: true,
    },
  });

  if (!egg) {
    notFound();
  }

  return (
    <SkyPage>
      <EggCard egg={egg} />
    </SkyPage>
  );
}
