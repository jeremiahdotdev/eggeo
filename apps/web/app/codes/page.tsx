import { prisma } from '@eggeo/db';
import { EggQrCard } from '@/components/EggQrCard';
import { PrintAction } from '@/components/PrintAction';
import { requirePageSession } from '@/components/RequireAuth';
import { SkyPage } from '@/components/SkyScene';

export default async function CodesPage() {
  const session = await requirePageSession();
  const eggs = await prisma.egg.findMany({
    where: {
      username: session.username,
      isCollected: false,
    },
    orderBy: {
      title: 'asc',
    },
  });

  return (
    <SkyPage>
      <PrintAction />
      <section className="cards">
        {eggs.map((egg) => (
          <EggQrCard egg={egg} key={egg.id} />
        ))}
      </section>
    </SkyPage>
  );
}
