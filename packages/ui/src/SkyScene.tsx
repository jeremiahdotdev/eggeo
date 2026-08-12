'use client';

import type { ReactNode } from 'react';
import { Box } from '@gluestack-ui/themed/build/components/Box';
import type { EggeoStyle } from './types';
import { styles } from './styles';

function Cloud({ style }: { style: EggeoStyle }) {
  return (
    <Box pointerEvents="none" style={[styles.cloud, style]}>
      <Box style={styles.cloudPuffLeft} />
      <Box style={styles.cloudPuffRight} />
    </Box>
  );
}

export function EggeoSkyScene({ children, style }: { children: ReactNode; style?: EggeoStyle }) {
  return (
    <Box style={[styles.skyScene, style]}>
      <Cloud style={styles.cloudOne} />
      <Cloud style={styles.cloudTwo} />
      <Cloud style={styles.cloudThree} />
      <Cloud style={styles.cloudFour} />
      <Box pointerEvents="none" style={styles.hillWrap}>
        <Box style={styles.hill} />
      </Box>
      {children}
    </Box>
  );
}
