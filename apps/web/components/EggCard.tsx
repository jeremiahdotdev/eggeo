import { EggIcon } from '@/components/EggIcon';

export type EggView = {
  id?: string;
  title?: string | null;
  description?: string | null;
  color?: string | null;
  points?: number | null;
};

export function EggCard({ egg }: { egg: EggView }) {
  const points = egg.points ?? 1;

  return (
    <article className="egg-card">
      <h2>{egg.title || 'Untitled Egg'}</h2>
      <EggIcon color={egg.color} seed={egg.id ?? egg.title ?? 'egg'} size={150} />
      <p>{egg.description || 'No description yet.'}</p>
      <strong>{points === 1 ? '+1 pt.' : `+${points} pts.`}</strong>
    </article>
  );
}
