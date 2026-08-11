import { redirect } from 'next/navigation';
import { BubbleDigits, BubbleLabel } from '@/components/BubbleText';
import { EggIcon } from '@/components/EggIcon';
import { getSession } from '@/lib/session';

export default async function HomePage() {
  const session = await getSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <main className="home-hero">
      <div className="home-clouds" aria-hidden="true">
        <span className="cloud cloud-one" />
        <span className="cloud cloud-two" />
        <span className="cloud cloud-three" />
        <span className="cloud cloud-four" />
        <span className="cloud cloud-five" />
        <span className="cloud cloud-six" />
        <span className="cloud cloud-seven" />
        <span className="cloud cloud-eight" />
      </div>
      <section className="home-inner">
        <BubbleLabel className="home-jeremiah">Jeremiah&apos;s</BubbleLabel>
        <BubbleDigits label="Eggeo" />
        <div className="home-egg">
          <div className="home-hill" aria-hidden="true" />
          <EggIcon seed="home-eggeo" size={360} showGrass />
        </div>
      </section>
    </main>
  );
}
