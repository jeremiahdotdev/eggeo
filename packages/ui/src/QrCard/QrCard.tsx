'use client';

import type { CSSProperties, ReactNode } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { eggeoColors } from '../tokens';
import type { EggeoStyle } from '../types';
import { styles, webStyles } from './QrCard.styles';

type QrCardWebClasses = {
  actions?: string;
  frame?: string;
  qrBox?: string;
  root?: string;
  title?: string;
};

type EggeoQrCardProps = {
  action?: ReactNode;
  color?: string | null;
  qr: ReactNode;
  style?: EggeoStyle;
  title: string;
  webClasses?: QrCardWebClasses;
  webStyle?: CSSProperties;
};

export function EggeoQrCard({ action, color, qr, style, title, webClasses, webStyle }: EggeoQrCardProps) {
  const backgroundColor = color ?? eggeoColors.paper;

  if (Platform.OS === 'web') {
    const flattenedStyle = StyleSheet.flatten(style) as CSSProperties | undefined;

    return (
      <article className={webClasses?.root} style={{ ...webStyles.card, backgroundColor, ...flattenedStyle, ...webStyle }}>
        <h2 className={webClasses?.title} style={webStyles.title}>
          {title}
        </h2>
        <div className={webClasses?.frame} style={webStyles.frame}>
          <div className={webClasses?.qrBox} style={webStyles.qrBox}>
            {qr}
          </div>
        </div>
        {action && (
          <div className={webClasses?.actions} style={webStyles.actions}>
            {action}
          </div>
        )}
      </article>
    );
  }

  return (
    <View style={[styles.card, { backgroundColor }, style]}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.frame}>
        <View style={styles.qrBox}>{qr}</View>
      </View>
      {action && <View style={styles.actions}>{action}</View>}
    </View>
  );
}
