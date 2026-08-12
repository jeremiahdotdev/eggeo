import { Platform } from 'react-native';
import { eggeoColors, eggeoFonts } from './tokens';

const comicFontFamily =
  Platform.OS === 'web'
    ? '"Comic Sans MS", "Comic Sans", "Comic Neue", "Trebuchet MS", Verdana, Arial, sans-serif'
    : eggeoFonts.comic;

const textBorder = {
  ...(Platform.OS === 'web'
    ? {
        textShadowColor: eggeoColors.border,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 0,
        textShadow:
          `1.5px 0 0 ${eggeoColors.border}, -1.5px 0 0 ${eggeoColors.border}, 0 1.5px 0 ${eggeoColors.border}, 0 -1.5px 0 ${eggeoColors.border}, ` +
          `1.1px 1.1px 0 ${eggeoColors.border}, -1.1px 1.1px 0 ${eggeoColors.border}, 1.1px -1.1px 0 ${eggeoColors.border}, -1.1px -1.1px 0 ${eggeoColors.border}`,
      }
    : {
        textShadowColor: eggeoColors.border,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 2,
      }),
};

export const styles = {
  authHeader: {
    alignItems: 'center',
    marginBottom: 22,
    zIndex: 2,
  },
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
  darkButtonText: {
    color: eggeoColors.ink,
  },
  caption: {
    fontSize: 12,
    opacity: 0.68,
  },
  cloud: {
    backgroundColor: eggeoColors.paper,
    borderRadius: 999,
    height: 48,
    opacity: 0.7,
    position: 'absolute',
    width: 150,
    zIndex: 0,
  },
  cloudFour: {
    bottom: 78,
    right: -38,
    opacity: 0.52,
    transform: [{ scale: 0.85 }],
  },
  cloudOne: {
    left: -22,
    top: 58,
    transform: [{ scale: 0.9 }],
  },
  cloudPuffLeft: {
    backgroundColor: eggeoColors.paper,
    borderRadius: 999,
    height: 62,
    left: 24,
    position: 'absolute',
    top: -25,
    width: 62,
  },
  cloudPuffRight: {
    backgroundColor: eggeoColors.paper,
    borderRadius: 999,
    height: 74,
    position: 'absolute',
    right: 24,
    top: -34,
    width: 74,
  },
  cloudThree: {
    bottom: 176,
    left: 32,
    opacity: 0.5,
    transform: [{ scale: 0.72 }],
  },
  cloudTwo: {
    right: -18,
    top: 132,
    transform: [{ scale: 1.05 }],
  },
  colorText: {
    fontFamily: comicFontFamily,
    fontWeight: '900',
    letterSpacing: 0,
    textAlign: 'center',
    ...textBorder,
  },
  colorTextLetter: {
    fontFamily: comicFontFamily,
    fontWeight: '900',
    ...textBorder,
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
  ghostButton: {
    backgroundColor: eggeoColors.paper,
  },
  field: {
    gap: 6,
    width: '100%',
  },
  hill: {
    backgroundColor: eggeoColors.grass,
    borderColor: eggeoColors.border,
    borderRadius: 310,
    borderWidth: 3,
    height: 1000,
    width: 620,
  },
  hillWrap: {
    alignItems: 'center',
    bottom: -880,
    height: 1000,
    left: 0,
    overflow: 'visible',
    position: 'absolute',
    right: 0,
    zIndex: 1,
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
  message: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  nativeTextOutlineOffsets: [
    { left: -2, top: 0 },
    { left: 2, top: 0 },
    { left: 0, top: -2 },
    { left: 0, top: 2 },
    { left: -1.5, top: -1.5 },
    { left: 1.5, top: -1.5 },
    { left: -1.5, top: 1.5 },
    { left: 1.5, top: 1.5 },
  ],
  panel: {
    backgroundColor: eggeoColors.paper,
    borderColor: eggeoColors.border,
    borderRadius: 8,
    borderWidth: 2,
    gap: 12,
    maxWidth: 420,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 0,
    width: '100%',
    zIndex: 2,
  },
  panelTitle: {
    fontSize: 34,
    lineHeight: 40,
    marginBottom: 4,
    textAlign: 'center',
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
  skyScene: {
    alignItems: 'center',
    backgroundColor: eggeoColors.sky,
    flex: 1,
    justifyContent: 'center',
    minHeight: '100%',
    overflow: 'hidden',
    paddingHorizontal: 22,
    paddingVertical: 18,
    position: 'relative',
    width: '100%',
  },
  text: {
    color: eggeoColors.ink,
    fontFamily: comicFontFamily,
    fontWeight: '800',
  },
  span: {
    fontSize: 16,
    fontWeight: '900',
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
