import { prisma } from '@eggeo/db';
import { appText } from '@eggeo/domain';
import { EggIcon, EggeoText, ScoreBubble } from '@eggeo/ui';
import { requirePageSession } from '@/components/RequireAuth';
import { SkyScene } from '@/components/SkyScene';
import { sumEggPoints } from '@/lib/egg';
import styles from './page.module.css';

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
  const points = sumEggPoints(foundEggs);

  return (
    <SkyScene className="home-hero" variant="home">
      <section className="home-inner">
        <div className="home-title-lock">
          <EggeoText className={styles.title} colorized variant="title">
            {appText.brand.title}
          </EggeoText>
        </div>
        <div className="home-egg">
          <div className="home-hill" aria-hidden="true" />
          <EggIcon seed="dashboard-eggeo" size={360} showGrass />
          <ScoreBubble className="score-bubble" size="var(--score-bubble-size)">
            {String(points)}
          </ScoreBubble>
        </div>
      </section>
    </SkyScene>
  );
}
