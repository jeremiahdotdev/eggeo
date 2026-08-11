import { prisma } from '@eggeo/db';
import { BubbleDigits, BubbleLabel } from '@/components/BubbleText';
import { EggIcon } from '@/components/EggIcon';
import { requirePageSession } from '@/components/RequireAuth';
import { SkyScene } from '@/components/SkyScene';

export default async function DashboardPage() {
  const session = await requirePageSession();
  const foundEggs = await prisma.userEgg.findMany({
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
  const points = foundEggs.map((entry) => entry.Egg.points ?? 1).reduce((a, b) => a + b, 0);

  return (
    <SkyScene className="home-hero" variant="home">
      <section className="home-inner">
        <div className="home-title-lock">
          <BubbleDigits label="Eggeo" />
        </div>
        <div className="home-egg">
          <EggIcon seed="dashboard-eggeo" size={220} />
          <BubbleLabel box="0 0 260 130" className="score-bubble" color="#ffffff">
            {points}
          </BubbleLabel>
        </div>
      </section>
    </SkyScene>
  );
}
