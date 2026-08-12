import { eggeoColors } from '../tokens';

export const styles = {
  panel: {
    backgroundColor: eggeoColors.paper,
    borderColor: eggeoColors.border,
    borderRadius: 8,
    borderWidth: 2,
    gap: 12,
    maxWidth: 420,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 0,
    width: '100%',
    zIndex: 2,
  },
} as const;
