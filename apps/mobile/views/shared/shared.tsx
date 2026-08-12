import { EggeoText } from '@eggeo/ui';
import QRCode from 'qrcode';
import Svg, { G, Rect } from 'react-native-svg';
import { viewStyles } from './shared.styles';

export function ScreenTitle({ children }: { children: string }) {
  return (
    <EggeoText colorized style={viewStyles.screenTitle} variant="pageTitle">
      {children}
    </EggeoText>
  );
}

export function ScreenMessage({ children }: { children?: string }) {
  return children && <EggeoText style={viewStyles.message}>{children}</EggeoText>;
}

export function ScreenQrCode({ size = 168, value }: { size?: number; value: string }) {
  const qr = QRCode.create(value, { errorCorrectionLevel: 'M' });
  const quietZone = 1;
  const moduleCount = qr.modules.size;
  const viewBoxSize = moduleCount + quietZone * 2;
  const rects = [];

  for (let row = 0; row < moduleCount; row += 1) {
    for (let col = 0; col < moduleCount; col += 1) {
      if (qr.modules.data[row * moduleCount + col]) {
        rects.push(<Rect fill="#111111" height={1} key={`${row}-${col}`} width={1} x={col + quietZone} y={row + quietZone} />);
      }
    }
  }

  return (
    <Svg height={size} viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} width={size}>
      <Rect fill="#ffffff" height={viewBoxSize} width={viewBoxSize} x={0} y={0} />
      <G>{rects}</G>
    </Svg>
  );
}

export { viewStyles };
