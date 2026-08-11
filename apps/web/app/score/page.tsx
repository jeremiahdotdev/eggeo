import { prisma } from '@eggeo/db';
import { requirePageSession } from '@/components/RequireAuth';
import { ScoreReset } from '@/components/ScoreReset';
import { SkyScene } from '@/components/SkyScene';

export default async function ScorePage() {
  const session = await requirePageSession();
  const data = await prisma.userEgg.findMany({
    where: {
      username: session.username,
    },
    select: {
      Egg: {
        select: {
          points: true,
        },
      },
    },
  });
  const points = data.map((entry) => entry.Egg.points ?? 1).reduce((a, b) => a + b, 0);

  return (
    <SkyScene className="hero">
      <ScoreReset initialPoints={points} />
    </SkyScene>
  );
}
