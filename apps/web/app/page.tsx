import { redirect } from 'next/navigation';
import { BubbleDigits } from '@/components/BubbleText';
import { EggIcon } from '@/components/EggIcon';
import { SkyScene } from '@/components/SkyScene';
import { getSession } from '@/lib/session';

export default async function HomePage() {
  const session = await getSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <SkyScene className="home-hero" showHill={false} variant="home">
      <section className="home-inner">
        <div className="home-title-lock">
          <BubbleDigits label="Eggeo" />
        </div>
        <div className="home-egg">
          <div className="home-hill" aria-hidden="true" />
          <EggIcon seed="home-eggeo" size={360} showGrass />
        </div>
      </section>
    </SkyScene>
  );
}
