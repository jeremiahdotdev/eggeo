'use client';

import type { ReactNode } from 'react';
import { View } from 'react-native';
import { styles } from './SkyScene.styles';
import type { EggeoStyle } from '../types';

function Cloud({ style }: { style: EggeoStyle }) {
  return (
    <View pointerEvents="none" style={[styles.cloud, style]}>
      <View style={styles.cloudPuffLeft} />
      <View style={styles.cloudPuffRight} />
    </View>
  );
}

export function EggeoSkyScene({
  children,
  hillStyle,
  hillWrapStyle,
  showHill = true,
  style,
}: {
  children: ReactNode;
  hillStyle?: EggeoStyle;
  hillWrapStyle?: EggeoStyle;
  showHill?: boolean;
  style?: EggeoStyle;
}) {
  return (
    <View style={[styles.skyScene, style]}>
      <Cloud style={styles.cloudOne} />
      <Cloud style={styles.cloudTwo} />
      <Cloud style={styles.cloudThree} />
      <Cloud style={styles.cloudFour} />
      <Cloud style={styles.cloudFive} />
      <Cloud style={styles.cloudSix} />
      {showHill && (
        <View pointerEvents="none" style={[styles.hillWrap, hillWrapStyle]}>
          <View style={[styles.hill, hillStyle]} />
        </View>
      )}
      {children}
    </View>
  );
}
