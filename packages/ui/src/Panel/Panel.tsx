'use client';

import type { ReactNode } from 'react';
import { View } from 'react-native';
import { styles } from './Panel.styles';
import type { EggeoStyle } from '../types';

export function EggeoPanel({ children, style }: { children: ReactNode; style?: EggeoStyle }) {
  return <View style={[styles.panel, style]}>{children}</View>;
}
