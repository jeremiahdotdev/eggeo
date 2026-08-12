'use client';

import type { ReactNode } from 'react';
import { Box } from '@gluestack-ui/themed/build/components/Box';
import type { EggeoStyle } from './types';
import { styles } from './styles';

export function EggeoPanel({ children, style }: { children: ReactNode; style?: EggeoStyle }) {
  return <Box style={[styles.panel, style]}>{children}</Box>;
}
