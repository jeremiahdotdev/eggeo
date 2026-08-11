import { prisma } from '@eggeo/db';
import { EggQrCard } from '@/components/EggQrCard';
import { PrintButton } from '@/components/PrintButton';
import { requirePageSession } from '@/components/RequireAuth';

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
    <main className="page stack">
      <PrintButton />
      <section className="cards">
        {eggs.map((egg) => (
          <EggQrCard egg={egg} key={egg.id} />
        ))}
      </section>
    </main>
  );
}
