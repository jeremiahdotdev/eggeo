'use client';

import type { CSSProperties } from 'react';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { EggIcon } from '../EggIcon';
import { EggeoText } from '../primitives';
import type { EggeoStyle } from '../types';
import { EggeoNavMenuButton } from '../NavMenuButton';
import { styles, webStyles } from './NavBar.styles';

export type EggeoNavItem = {
  href?: string;
  key: string;
  label: string;
};

export function EggeoNavBar({
  activeKey,
  brandHref,
  brandLabel,
  className,
  items,
  onBrandPress,
  onSelect,
  style,
}: {
  activeKey?: string;
  brandHref?: string;
  brandLabel: string;
  className?: string;
  items: EggeoNavItem[];
  onBrandPress?: () => void;
  onSelect?: (key: string) => void;
  style?: EggeoStyle;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (item: EggeoNavItem) => {
    onSelect?.(item.key);
    setIsOpen(false);
  };

  if (Platform.OS === 'web') {
    const flattenedStyle = StyleSheet.flatten(style) as CSSProperties | undefined;

    return (
      <div className={className ?? 'nav-inner'} style={flattenedStyle}>
        <a href={brandHref ?? '#'} style={webStyles.brand}>
          <EggIcon size={34} seed="header-eggeo" strokeWidth={7} />
          <EggeoText colorized style={webStyles.brandText as EggeoStyle}>
            {brandLabel}
          </EggeoText>
        </a>
        {items.length > 0 && (
          <>
            <nav aria-label="Primary" className="eggeo-nav-links" style={webStyles.links}>
              {items.map((item) => (
                <a
                  href={item.href ?? '#'}
                  key={item.key}
                  onClick={() => handleSelect(item)}
                  style={{
                    ...webStyles.linkItem,
                    ...(activeKey === item.key ? webStyles.linkItemActive : undefined),
                  }}
                >
                  <EggeoText colorized style={webStyles.linkItemText as EggeoStyle}>
                    {item.label}
                  </EggeoText>
                </a>
              ))}
            </nav>
            <div className="eggeo-nav-menu" style={webStyles.menu}>
              <EggeoNavMenuButton
                className="eggeo-nav-toggle"
                expanded={isOpen}
                onPress={() => setIsOpen((value) => !value)}
                webStyle={webStyles.toggle}
              />
              <nav aria-label="Primary" className={`eggeo-nav-dropdown${isOpen ? ' is-open' : ''}`} style={webStyles.dropdown}>
                {items.map((item) => (
                  <a
                    href={item.href ?? '#'}
                    key={item.key}
                    onClick={() => handleSelect(item)}
                    style={{
                      ...webStyles.item,
                      ...(activeKey === item.key ? webStyles.itemActive : undefined),
                    }}
                  >
                    <EggeoText colorized style={webStyles.itemText as EggeoStyle}>
                      {item.label}
                    </EggeoText>
                  </a>
                ))}
              </nav>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <View style={[styles.nativeShell, style]}>
      <Pressable accessibilityRole="button" onPress={onBrandPress} style={styles.nativeBrand}>
        <EggIcon seed="header-eggeo" size={38} strokeWidth={6} />
        <EggeoText colorized style={styles.nativeBrandText}>
          {brandLabel}
        </EggeoText>
      </Pressable>
      {items.length > 0 && <EggeoNavMenuButton expanded={isOpen} onPress={() => setIsOpen((value) => !value)} />}
      {isOpen && (
        <View style={styles.nativeMenu}>
          {items.map((item) => (
            <Pressable
              key={item.key}
              onPress={() => handleSelect(item)}
              style={[styles.nativeMenuItem, activeKey === item.key ? styles.nativeMenuItemActive : undefined]}
            >
              <EggeoText colorized>{item.label}</EggeoText>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}
