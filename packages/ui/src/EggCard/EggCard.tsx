import { EggIcon } from '../EggIcon';
import { styles } from './EggCard.styles';

export type EggCardView = {
  color?: string | null;
  description?: string | null;
  id?: string;
  points?: number | null;
  title?: string | null;
};

export function EggCard({ egg }: { egg: EggCardView }) {
  const points = egg.points ?? 1;

  return (
    <article style={styles.card}>
      <h2>{egg.title || 'Untitled Egg'}</h2>
      <EggIcon color={egg.color} seed={egg.id ?? egg.title ?? 'egg'} size={150} />
      <p>{egg.description || 'No description yet.'}</p>
      <strong>{points === 1 ? '+1 pt.' : `+${points} pts.`}</strong>
    </article>
  );
}
