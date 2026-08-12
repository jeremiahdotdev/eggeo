import type { CSSProperties } from 'react';
import { eggeoColors } from '../tokens';

export const styles = {
  card: {
    alignItems: 'center',
    background: eggeoColors.paper,
    border: `2px solid ${eggeoColors.border}`,
    borderRadius: 8,
    boxShadow: '8px 8px 0 rgb(0 0 0 / 0.16)',
    display: 'grid',
    gap: 12,
    justifyItems: 'center',
    padding: 18,
    textAlign: 'center',
  },
} satisfies Record<string, CSSProperties>;
