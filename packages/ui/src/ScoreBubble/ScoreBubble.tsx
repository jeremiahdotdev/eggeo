'use client';

import type { CSSProperties, ReactNode } from 'react';
import { Platform, View } from 'react-native';
import { EggeoText } from '../primitives';
import { styles, webStyles } from './ScoreBubble.styles';
import type { EggeoStyle } from '../types';

export function ScoreBubble({
  children,
  className,
  size = 120,
  style,
  textStyle,
  webStyle,
}: {
  children: ReactNode;
  className?: string;
  size?: number | string;
  style?: EggeoStyle;
  textStyle?: EggeoStyle;
  webStyle?: CSSProperties;
}) {
  if (Platform.OS === 'web') {
    const webSize = typeof size === 'number' ? `${size}px` : size;

    return (
      <div
        className={className}
        style={{
          ...webStyles.bubble,
          height: webSize,
          width: webSize,
          ...webStyle,
        }}
      >
        <EggeoText colorized style={textStyle} variant="title">
          {children}
        </EggeoText>
      </div>
    );
  }

  const nativeSize = typeof size === 'number' ? size : 120;

  return (
    <View style={[styles.bubble, { height: nativeSize, width: nativeSize }, style]}>
      <EggeoText colorized style={[styles.text, textStyle]} variant="title">
        {children}
      </EggeoText>
    </View>
  );
}
