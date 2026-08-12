import type { ApiEgg } from '@eggeo/api-client';
import { appText } from '@eggeo/domain';
import { EggeoButton, eggeoColors } from '@eggeo/ui';
import * as Print from 'expo-print';
import QRCode from 'qrcode';
import { useState } from 'react';
import { Alert, View } from 'react-native';
import { parseLinkFromEgg } from '../../lib/egg';
import { styles } from './PrintAction.styles';

function escapeHtml(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

function printableColor(color?: string | null) {
  return color && /^#[0-9a-f]{3,8}$/i.test(color) ? color : eggeoColors.paper;
}

function buildQrSvg(value: string) {
  const qr = QRCode.create(value, { errorCorrectionLevel: 'M' });
  const quietZone = 1;
  const size = qr.modules.size;
  const viewBoxSize = size + quietZone * 2;
  const rects: string[] = [];

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (qr.modules.data[row * size + col]) {
        rects.push(`<rect x="${col + quietZone}" y="${row + quietZone}" width="1" height="1" />`);
      }
    }
  }

  return `
    <svg class="qr" viewBox="0 0 ${viewBoxSize} ${viewBoxSize}" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
      <rect width="${viewBoxSize}" height="${viewBoxSize}" fill="${eggeoColors.paper}" />
      <g fill="${eggeoColors.border}">${rects.join('')}</g>
    </svg>
  `;
}

async function buildPrintableEggSheet(eggs: ApiEgg[]) {
  const cards = eggs.map((egg) => {
      return `
        <article class="card" style="background-color: ${printableColor(egg.color)}">
          <h2>${escapeHtml(egg.title || appText.eggs.labels.untitled)}</h2>
          <div class="frame">
            ${buildQrSvg(parseLinkFromEgg(egg.id))}
          </div>
        </article>
      `;
    });

  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          @page {
            size: letter;
            margin: 0.35in;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            background: #fff;
            color: ${eggeoColors.ink};
            font-family: "Comic Sans MS", "Comic Sans", Arial, sans-serif;
          }

          .sheet {
            display: flex;
            flex-wrap: wrap;
            gap: 0.16in;
            justify-content: center;
            width: 100%;
          }

          .card {
            display: grid;
            align-content: start;
            justify-items: center;
            gap: 0.06in;
            flex: 0 0 2.05in;
            width: 2.05in;
            max-width: 2.05in;
            overflow: hidden;
            padding: 0.08in 0.08in 0.18in;
            text-align: center;
            border: 2px solid ${eggeoColors.border};
            print-color-adjust: exact;
          }

          h2 {
            min-height: 0.24in;
            margin: 0;
            font-size: 9pt;
            line-height: 1.12;
          }

          .frame {
            display: grid;
            place-items: center;
            max-width: 100%;
            overflow: hidden;
            padding: 0.05in;
            background: #fff;
            border: 2px solid ${eggeoColors.border};
          }

          .qr {
            display: block;
            width: 1.18in;
            height: 1.18in;
            max-width: 100%;
          }
        </style>
      </head>
      <body>
        <section class="sheet">${cards.join('')}</section>
      </body>
    </html>
  `;
}

export function PrintAction({ eggs }: { eggs: ApiEgg[] }) {
  const [isPrinting, setIsPrinting] = useState(false);

  async function handlePrint() {
    if (eggs.length === 0) return;

    setIsPrinting(true);
    try {
      await Print.printAsync({ html: await buildPrintableEggSheet(eggs) });
    } catch (error) {
      Alert.alert(appText.eggs.messages.unableToPrint, error instanceof Error ? error.message : undefined);
    } finally {
      setIsPrinting(false);
    }
  }

  return (
    <View style={styles.wrap}>
      <EggeoButton disabled={eggs.length === 0} intent="secondary" isLoading={isPrinting} onPress={handlePrint} style={styles.button}>
        {appText.nav.print}
      </EggeoButton>
    </View>
  );
}
