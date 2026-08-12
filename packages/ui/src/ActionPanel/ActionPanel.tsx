'use client';

import { Fragment } from 'react';
import { Platform } from 'react-native';
import { EggeoPanel } from '../Panel';
import { EggeoButton, EggeoText } from '../primitives';
import { styles, webStyles } from './ActionPanel.styles';
import type { ButtonIntent } from '../tokens';
import type { EggeoStyle } from '../types';

export type EggeoActionPanelItem = {
  disabled?: boolean;
  href?: string;
  intent?: ButtonIntent;
  isLoading?: boolean;
  key: string;
  label: string;
};

export function EggeoActionPanel({
  items,
  label,
  onSelect,
  style,
}: {
  items: EggeoActionPanelItem[];
  label?: string;
  onSelect?: (key: string) => void;
  style?: EggeoStyle;
}) {
  return (
    <EggeoPanel style={[styles.panel, style]}>
      {label && <EggeoText style={styles.label}>{label}</EggeoText>}
      {items.map((item) => {
        const button = (
          <EggeoButton
            disabled={item.disabled}
            intent={item.intent ?? 'secondary'}
            isLoading={item.isLoading}
            onPress={() => onSelect?.(item.key)}
            style={styles.button}
          >
            {item.label}
          </EggeoButton>
        );

        if (Platform.OS === 'web' && item.href) {
          return (
            <a href={item.href} key={item.key} style={webStyles.link}>
              {button}
            </a>
          );
        }

        return <Fragment key={item.key}>{button}</Fragment>;
      })}
    </EggeoPanel>
  );
}
