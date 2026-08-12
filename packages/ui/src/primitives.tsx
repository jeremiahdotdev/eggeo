'use client';

import type { CSSProperties, ReactNode } from 'react';
import { Button, ButtonSpinner, ButtonText } from '@gluestack-ui/themed/build/components/Button';
import { Box } from '@gluestack-ui/themed/build/components/Box';
import { Input, InputField } from '@gluestack-ui/themed/build/components/Input';
import { Text } from '@gluestack-ui/themed/build/components/Text';
import { Platform, StyleSheet, type TextInputProps, type TextStyle } from 'react-native';
import { easterColors, eggeoColors, type ButtonIntent } from './tokens';
import type { EggeoStyle } from './types';
import { styles } from './styles';

export function EggeoText({
  children,
  colorized = false,
  style,
  variant = 'body',
}: {
  children: ReactNode;
  colorized?: boolean;
  style?: EggeoStyle;
  variant?: 'body' | 'caption' | 'label' | 'pageTitle' | 'title';
}) {
  if (colorized && typeof children === 'string') {
    return <EggeoColorText style={[styles[variant], style]}>{children}</EggeoColorText>;
  }

  return <Text style={[styles.text, styles[variant], style]}>{children}</Text>;
}

export function EggeoColorText({ children, style }: { children: string; style?: EggeoStyle }) {
  if (Platform.OS !== 'web') {
    const flattenedStyle = (StyleSheet.flatten(style) ?? {}) as TextStyle;
    const nativeLetterTextStyle = {
      fontSize: flattenedStyle.fontSize,
      lineHeight: flattenedStyle.lineHeight,
    };

    return (
      <Box accessibilityRole="header" style={[styles.colorTextNative, style]}>
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
            <Box key={`${letter}-${index}`} style={styles.colorTextNativeLetterWrap}>
              {styles.nativeTextOutlineOffsets.map((offset, offsetIndex) => (
                <Text key={`${letter}-${index}-${offsetIndex}`} style={[styles.colorTextNativeLetterOutline, nativeLetterTextStyle, offset]}>
                  {letter}
                </Text>
              ))}
              <Text style={[styles.colorTextNativeLetter, nativeLetterTextStyle, { color }]}>{letter}</Text>
            </Box>
          );
        })}
      </Box>
    );
  }

  const flattenedWebStyle = StyleSheet.flatten(style) as CSSProperties | undefined;
  const webStyle =
    typeof flattenedWebStyle?.lineHeight === 'number'
      ? { ...flattenedWebStyle, lineHeight: `${flattenedWebStyle.lineHeight}px` }
      : flattenedWebStyle;

  return (
    <span className="color-text" role="heading" style={webStyle}>
      {children.split('').map((letter, index) => (
        <span className="color-text-letter" key={`${letter}-${index}`} style={{ color: easterColors[index % easterColors.length] }}>
          {letter}
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
  return (
    <Button disabled={disabled || isLoading} onPress={onPress} style={[styles.button, styles[`${intent}Button`], style]}>
      {isLoading && <ButtonSpinner color={intent === 'ghost' || intent === 'secondary' ? eggeoColors.ink : eggeoColors.paper} />}
      <ButtonText style={[styles.buttonText, intent === 'ghost' || intent === 'secondary' ? styles.darkButtonText : undefined]}>{children}</ButtonText>
    </Button>
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
      <span className="eggeo-span" style={StyleSheet.flatten(style) as CSSProperties | undefined}>
        {children}
      </span>
    );
  }

  return <Text style={[styles.text, styles.span, style]}>{children}</Text>;
}

export function EggeoField({ label, style, ...inputProps }: EggeoInputProps & { label: ReactNode; style?: EggeoStyle }) {
  if (Platform.OS === 'web') {
    return (
      <label className="eggeo-field" style={StyleSheet.flatten(style) as CSSProperties | undefined}>
        <EggeoSpan>{label}</EggeoSpan>
        <EggeoInput {...inputProps} />
      </label>
    );
  }

  return (
    <Box style={[styles.field, style]}>
      <EggeoSpan>{label}</EggeoSpan>
      <EggeoInput {...inputProps} />
    </Box>
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
    const webStyle = StyleSheet.flatten([styles.inputField, multiline ? styles.textAreaField : undefined]) as CSSProperties | undefined;

    if (multiline) {
      return (
        <textarea
          autoComplete={autoComplete}
          className="eggeo-input eggeo-textarea"
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
        className="eggeo-input"
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
    <Input style={styles.inputShell}>
      <InputField
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        keyboardType={keyboardType}
        multiline={multiline}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#5f6f6a"
        secureTextEntry={secureTextEntry}
        style={[styles.inputField, multiline ? styles.textAreaField : undefined]}
        value={String(value)}
      />
    </Input>
  );
}
