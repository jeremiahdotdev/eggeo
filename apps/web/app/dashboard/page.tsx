import { prisma } from '@eggeo/db';
import { appText } from '@eggeo/static-text';
import { EggIcon, EggeoText } from '@eggeo/ui';
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
          <EggeoText colorized style={{ fontSize: 96, lineHeight: 104 }} variant="title">
            {appText.brand.title}
          </EggeoText>
        </div>
        <div className="home-egg">
          <div className="home-hill" aria-hidden="true" />
          <EggIcon seed="dashboard-eggeo" size={360} showGrass />
          <div className="score-bubble">
            <EggeoText colorized style={{ fontSize: 58, lineHeight: 64 }} variant="title">
              {String(points)}
            </EggeoText>
          </div>
        </div>
      </section>
    </SkyScene>
  );
}
