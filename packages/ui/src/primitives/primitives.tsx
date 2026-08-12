'use client';

import type { CSSProperties, ReactNode } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, TextInput, View, type TextInputProps, type TextStyle } from 'react-native';
import { nativeTextOutlineOffsets, styles, webStyles } from './primitives.styles';
import { easterColors, eggeoColors, type ButtonIntent } from '../tokens';
import type { EggeoStyle } from '../types';

export function EggeoText({
  children,
  className,
  colorized = false,
  style,
  variant = 'body',
}: {
  children: ReactNode;
  className?: string;
  colorized?: boolean;
  style?: EggeoStyle;
  variant?: 'body' | 'caption' | 'label' | 'pageTitle' | 'title';
}) {
  if (colorized && typeof children === 'string') {
    return <EggeoColorText className={className} style={[styles[variant], style]}>{children}</EggeoColorText>;
  }

  return <Text style={[styles.text, styles[variant], style]}>{children}</Text>;
}

export function EggeoColorText({ children, className, style }: { children: string; className?: string; style?: EggeoStyle }) {
  if (Platform.OS !== 'web') {
    const flattenedStyle = (StyleSheet.flatten(style) ?? {}) as TextStyle;
    const nativeLetterTextStyle = {
      fontSize: flattenedStyle.fontSize,
      lineHeight: flattenedStyle.lineHeight,
    };

    return (
      <View accessibilityRole="header" style={[styles.colorTextNative, style]}>
        {children.split('').map((letter, index) => {
          if (letter === ' ') {
            return (
              <Text key={`space-${index}`} style={styles.colorTextNativeSpace}>
                {' '}
              </Text>
            );
          }

          const color = easterColors[index % easterColors.length];

          return (
            <View key={`${letter}-${index}`} style={styles.colorTextNativeLetterWrap}>
              {nativeTextOutlineOffsets.map((offset, offsetIndex) => (
                <Text key={`${letter}-${index}-${offsetIndex}`} style={[styles.colorTextNativeLetterOutline, nativeLetterTextStyle, offset]}>
                  {letter}
                </Text>
              ))}
              <Text style={[styles.colorTextNativeLetter, nativeLetterTextStyle, { color }]}>{letter}</Text>
            </View>
          );
        })}
      </View>
    );
  }

  const flattenedWebStyle = StyleSheet.flatten(style) as CSSProperties | undefined;
  const webStyle =
    typeof flattenedWebStyle?.lineHeight === 'number'
      ? { ...webStyles.colorText, ...flattenedWebStyle, lineHeight: `${flattenedWebStyle.lineHeight}px` }
      : { ...webStyles.colorText, ...flattenedWebStyle };

  let webColorIndex = 0;

  return (
    <span className={className} role="heading" style={webStyle}>
      {children.split(/\s+/).map((word, wordIndex) => (
        <span key={`${word}-${wordIndex}`} style={webStyles.colorTextWord}>
          {word.split('').map((letter, letterIndex) => {
            const colorIndex = webColorIndex;
            webColorIndex += 1;

            return (
              <span key={`${letter}-${letterIndex}`} style={{ ...webStyles.colorTextLetter, color: easterColors[colorIndex % easterColors.length] }}>
                {letter}
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
}

export function EggeoTitle({ children, style }: { children: string; style?: EggeoStyle }) {
  return <EggeoColorText style={[styles.titleText, style]}>{children}</EggeoColorText>;
}

export function EggeoButton({
  children,
  disabled = false,
  intent = 'primary',
  isLoading = false,
  onPress,
  style,
}: {
  children: ReactNode;
  disabled?: boolean;
  intent?: ButtonIntent;
  isLoading?: boolean;
  onPress?: () => void;
  style?: EggeoStyle;
}) {
  if (Platform.OS === 'web') {
    return (
      <button
        disabled={disabled || isLoading}
        onClick={onPress}
        style={StyleSheet.flatten([styles.button, styles[`${intent}Button`], style]) as CSSProperties | undefined}
        type="button"
      >
        <span style={StyleSheet.flatten([styles.buttonText, intent === 'ghost' || intent === 'secondary' ? styles.darkButtonText : undefined]) as CSSProperties | undefined}>
          {children}
        </span>
      </button>
    );
  }

  return (
    <Pressable disabled={disabled || isLoading} onPress={onPress} style={[styles.button, styles[`${intent}Button`], style]}>
      {isLoading && <ActivityIndicator color={intent === 'ghost' || intent === 'secondary' ? eggeoColors.ink : eggeoColors.paper} />}
      <Text style={[styles.buttonText, intent === 'ghost' || intent === 'secondary' ? styles.darkButtonText : undefined]}>{children}</Text>
    </Pressable>
  );
}

type EggeoInputProps = {
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: TextInputProps['autoComplete'];
  keyboardType?: 'default' | 'email-address';
  min?: number;
  multiline?: boolean;
  onChangeText: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  secureTextEntry?: boolean;
  type?: 'color' | 'email' | 'number' | 'password' | 'text';
  value: number | string;
};

function EggeoSpan({ children, style }: { children: ReactNode; style?: EggeoStyle }) {
  if (Platform.OS === 'web') {
    return (
      <span style={{ ...webStyles.span, ...(StyleSheet.flatten(style) as CSSProperties | undefined) }}>
        {children}
      </span>
    );
  }

  return <Text style={[styles.text, styles.span, style]}>{children}</Text>;
}

export function EggeoField({ label, style, ...inputProps }: EggeoInputProps & { label: ReactNode; style?: EggeoStyle }) {
  if (Platform.OS === 'web') {
    return (
      <label style={{ ...webStyles.field, ...(StyleSheet.flatten(style) as CSSProperties | undefined) }}>
        <EggeoSpan>{label}</EggeoSpan>
        <EggeoInput {...inputProps} />
      </label>
    );
  }

  return (
    <View style={[styles.field, style]}>
      <EggeoSpan>{label}</EggeoSpan>
      <EggeoInput {...inputProps} />
    </View>
  );
}

export function EggeoInput({
  autoCapitalize,
  autoComplete,
  keyboardType,
  min,
  multiline = false,
  onChangeText,
  placeholder,
  required,
  secureTextEntry,
  type = 'text',
  value,
}: EggeoInputProps) {
  if (Platform.OS === 'web') {
    const webStyle = {
      ...webStyles.input,
      ...(StyleSheet.flatten([styles.inputField, multiline ? styles.textAreaField : undefined]) as CSSProperties | undefined),
      ...(multiline ? webStyles.textArea : undefined),
    };

    if (multiline) {
      return (
        <textarea
          autoComplete={autoComplete}
          onChange={(event) => onChangeText(event.currentTarget.value)}
          placeholder={placeholder}
          required={required}
          style={webStyle}
          value={String(value)}
        />
      );
    }

    return (
      <input
        autoComplete={autoComplete}
        min={min}
        onChange={(event) => onChangeText(event.currentTarget.value)}
        placeholder={placeholder}
        required={required}
        style={webStyle}
        type={secureTextEntry ? 'password' : type}
        value={String(value)}
      />
    );
  }

  return (
    <TextInput
      autoCapitalize={autoCapitalize}
      autoComplete={autoComplete}
      keyboardType={keyboardType}
      multiline={multiline}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#5f6f6a"
      secureTextEntry={secureTextEntry}
      style={[styles.inputShell, styles.inputField, multiline ? styles.textAreaField : undefined]}
      value={String(value)}
    />
  );
}
