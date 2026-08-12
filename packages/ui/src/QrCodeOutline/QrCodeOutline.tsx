import { Platform } from 'react-native';
import Svg, { G, Rect } from 'react-native-svg';
import type { EggeoStyle } from '../types';

export function QrCodeOutline({ className, style }: { className?: string; style?: EggeoStyle }) {
  if (Platform.OS !== 'web') {
    return (
      <Svg style={style} viewBox="0 0 450 450">
        <G transform="translate(25 25)">
          <Rect width="400" height="400" rx="0" ry="0" fill="none" stroke="#00000066" strokeWidth="4" />
          <G transform="translate(29.999983 30.000003)">
            <Rect width="51.668486" height="47.142873" rx="0" ry="0" transform="matrix(1.354791 0 0 1.484848 4.086398 4.086398)" fill="none" stroke="#00000066" strokeWidth="6" />
            <Rect width="22.143637" height="20.204088" rx="0" ry="0" transform="matrix(1.354791 0 0 1.484848 24.086398 24.086399)" fill="#00000066" strokeWidth="6" />
          </G>
          <G transform="translate(29.999974 295.546496)">
            <Rect width="51.668486" height="47.142873" rx="0" ry="0" transform="matrix(1.354791 0 0 1.484848 4.086398 4.086398)" fill="none" stroke="#00000066" strokeWidth="6" />
            <Rect width="22.143637" height="20.204088" rx="0" ry="0" transform="matrix(1.354791 0 0 1.484848 24.086398 24.086399)" fill="#00000066" strokeWidth="6" />
          </G>
          <G transform="translate(293.033536 30.000004)">
            <Rect width="51.668486" height="47.142873" rx="0" ry="0" transform="matrix(1.354791 0 0 1.484848 4.086398 4.086398)" fill="none" stroke="#00000066" strokeWidth="6" />
            <Rect width="22.143637" height="20.204088" rx="0" ry="0" transform="matrix(1.354791 0 0 1.484848 24.086398 24.086399)" fill="#00000066" strokeWidth="6" />
          </G>
        </G>
      </Svg>
    );
  }

  return (
    <svg
      className={className}
      id="en8vaLVY3J11"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
      viewBox="0 0 450 450"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(25 25)">
        <rect width="400" height="400" rx="0" ry="0" fill="none" stroke="#00000066" strokeWidth="4" />
        <g transform="translate(29.999983 30.000003)">
          <rect width="51.668486" height="47.142873" rx="0" ry="0" transform="matrix(1.354791 0 0 1.484848 4.086398 4.086398)" fill="none" stroke="#00000066" strokeWidth="6" />
          <rect width="22.143637" height="20.204088" rx="0" ry="0" transform="matrix(1.354791 0 0 1.484848 24.086398 24.086399)" fill="#00000066" strokeWidth="6" />
        </g>
        <g transform="translate(29.999974 295.546496)">
          <rect width="51.668486" height="47.142873" rx="0" ry="0" transform="matrix(1.354791 0 0 1.484848 4.086398 4.086398)" fill="none" stroke="#00000066" strokeWidth="6" />
          <rect width="22.143637" height="20.204088" rx="0" ry="0" transform="matrix(1.354791 0 0 1.484848 24.086398 24.086399)" fill="#00000066" strokeWidth="6" />
        </g>
        <g transform="translate(293.033536 30.000004)">
          <rect width="51.668486" height="47.142873" rx="0" ry="0" transform="matrix(1.354791 0 0 1.484848 4.086398 4.086398)" fill="none" stroke="#00000066" strokeWidth="6" />
          <rect width="22.143637" height="20.204088" rx="0" ry="0" transform="matrix(1.354791 0 0 1.484848 24.086398 24.086399)" fill="#00000066" strokeWidth="6" />
        </g>
      </g>
    </svg>
  );
}
