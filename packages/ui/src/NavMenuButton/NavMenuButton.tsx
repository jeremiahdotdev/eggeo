'use client';

import type { CSSProperties } from 'react';
import { Platform, Pressable, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { styles } from './NavMenuButton.styles';
import { eggeoColors } from '../tokens';
import type { EggeoStyle } from '../types';

export function EggeoNavMenuButton({
  expanded,
  className,
  onPress,
  style,
  webStyle,
}: {
  expanded?: boolean;
  className?: string;
  onPress: () => void;
  style?: EggeoStyle;
  webStyle?: CSSProperties;
}) {
  if (Platform.OS === 'web') {
    return (
      <button
        aria-expanded={expanded}
        aria-label="Open navigation"
        className={className}
        onClick={onPress}
        style={webStyle ?? (StyleSheet.flatten(style) as CSSProperties | undefined)}
        type="button"
      >
        <MenuGlyph />
      </button>
    );
  }

  return (
    <Pressable accessibilityLabel="Open navigation" accessibilityRole="button" onPress={onPress} style={[styles.nativeButton, style]}>
      <MenuGlyph />
    </Pressable>
  );
}

function MenuGlyph() {
  if (Platform.OS === 'web') {
    return (
      <svg aria-hidden="true" fill="none" height="26" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" width="26">
        <path d="M4 12h16" />
        <path d="M4 18h16" />
        <path d="M4 6h16" />
      </svg>
    );
  }

  return (
    <Svg fill="none" height={26} stroke={eggeoColors.ink} strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} viewBox="0 0 24 24" width={26}>
      <Path d="M4 12h16" />
      <Path d="M4 18h16" />
      <Path d="M4 6h16" />
    </Svg>
  );
}
