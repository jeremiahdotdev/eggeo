import type { CSSProperties } from 'react';
import { Platform } from 'react-native';
import { eggeoColors, eggeoFonts } from '../tokens';

const comicFontFamily =
  Platform.OS === 'web'
    ? '"Comic Sans MS", "Comic Sans", "Comic Neue", "Trebuchet MS", Verdana, Arial, sans-serif'
    : eggeoFonts.comic;

export const nativeTextOutlineOffsets = [
  { left: -2, top: 0 },
  { left: 2, top: 0 },
  { left: 0, top: -2 },
  { left: 0, top: 2 },
  { left: -1.5, top: -1.5 },
  { left: 1.5, top: -1.5 },
  { left: -1.5, top: 1.5 },
  { left: 1.5, top: 1.5 },
];

export const styles = {
  body: {
    fontSize: 16,
  },
  button: {
    alignItems: 'center',
    borderColor: eggeoColors.border,
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: 'center',
    minHeight: 48,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 0,
  },
  buttonText: {
    color: eggeoColors.paper,
    fontFamily: comicFontFamily,
    fontSize: 17,
    fontWeight: '900',
  },
  caption: {
    fontSize: 12,
    opacity: 0.68,
  },
  colorTextNative: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    textAlign: 'center',
  },
  colorTextNativeLetter: {
    fontFamily: comicFontFamily,
    fontWeight: '900',
  },
  colorTextNativeLetterOutline: {
    color: eggeoColors.border,
    fontFamily: comicFontFamily,
    fontWeight: '900',
    position: 'absolute',
  },
  colorTextNativeLetterWrap: {
    position: 'relative',
  },
  colorTextNativeSpace: {
    fontFamily: comicFontFamily,
    fontWeight: '900',
    width: 10,
  },
  dangerButton: {
    backgroundColor: '#c93333',
  },
  darkButtonText: {
    color: eggeoColors.ink,
  },
  field: {
    gap: 6,
    width: '100%',
  },
  ghostButton: {
    backgroundColor: eggeoColors.paper,
  },
  inputField: {
    color: eggeoColors.ink,
    fontFamily: comicFontFamily,
    fontSize: 16,
    fontWeight: '800',
    minHeight: 48,
    paddingHorizontal: 12,
  },
  inputShell: {
    backgroundColor: eggeoColors.paper,
    borderColor: eggeoColors.border,
    borderRadius: 8,
    borderWidth: 2,
    minHeight: 48,
  },
  label: {
    fontSize: 16,
    fontWeight: '900',
  },
  pageTitle: {
    fontSize: 48,
    lineHeight: 56,
    marginBottom: 18,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#60A5FA',
  },
  secondaryButton: {
    backgroundColor: '#FBBF24',
  },
  span: {
    fontSize: 16,
    fontWeight: '900',
  },
  text: {
    color: eggeoColors.ink,
    fontFamily: comicFontFamily,
    fontWeight: '800',
  },
  textAreaField: {
    minHeight: 110,
    paddingVertical: 12,
    textAlignVertical: 'top',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
  },
  titleText: {
    fontSize: 58,
    lineHeight: 66,
  },
} as const;

export const webStyles = {
  colorText: {
    alignItems: 'baseline',
    display: 'inline-flex',
    flexWrap: 'wrap',
    fontFamily: comicFontFamily,
    fontWeight: 900,
    columnGap: '0.32em',
    rowGap: '0.02em',
    justifyContent: 'center',
    letterSpacing: '0.015em',
    lineHeight: 1,
    maxWidth: '100%',
    textAlign: 'center',
    whiteSpace: 'normal',
  },
  colorTextLetter: {
    display: 'inline-block',
    fontFamily: comicFontFamily,
    fontWeight: 900,
    paintOrder: 'stroke fill',
    textShadow:
      `1.7px 0 0 ${eggeoColors.border}, -1.7px 0 0 ${eggeoColors.border}, 0 1.7px 0 ${eggeoColors.border}, 0 -1.7px 0 ${eggeoColors.border}, ` +
      `1.2px 1.2px 0 ${eggeoColors.border}, -1.2px 1.2px 0 ${eggeoColors.border}, 1.2px -1.2px 0 ${eggeoColors.border}, -1.2px -1.2px 0 ${eggeoColors.border}`,
    WebkitTextStroke: `1.25px ${eggeoColors.border}`,
  },
  colorTextWord: {
    display: 'inline-flex',
    flexShrink: 0,
    gap: '0.035em',
  },
  field: {
    display: 'grid',
    gap: 6,
    width: '100%',
  },
  input: {
    background: '#fff',
    border: `2px solid ${eggeoColors.border}`,
    borderRadius: 6,
    padding: 12,
    width: '100%',
  },
  span: {
    fontWeight: 800,
  },
  textArea: {
    minHeight: 110,
    resize: 'vertical',
  },
} satisfies Record<string, CSSProperties>;
