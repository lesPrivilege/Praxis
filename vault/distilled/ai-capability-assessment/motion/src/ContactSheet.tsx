import { AbsoluteFill } from 'remotion';
import { META } from './timeline';
import { Frame } from './Film';

export const SHEET = { step: 0.5, cols: 12, tw: 320 };
const th = (SHEET.tw * META.height) / META.width;
export const sheetSize = () => {
  const n = Math.floor(META.duration / SHEET.step);
  return { width: SHEET.cols * SHEET.tw, height: Math.ceil(n / SHEET.cols) * (th + 22) };
};

/** Director review: the film sampled every SHEET.step seconds on one still. */
export function ContactSheet() {
  const n = Math.floor(META.duration / SHEET.step), s = SHEET.tw / META.width;
  return (
    <AbsoluteFill style={{ backgroundColor: '#fff' }}>
      {Array.from({ length: n }, (_, i) => {
        const t = i * SHEET.step, x = (i % SHEET.cols) * SHEET.tw, y = Math.floor(i / SHEET.cols) * (th + 22);
        return (
          <div key={i} style={{ position: 'absolute', left: x, top: y, width: SHEET.tw, height: th + 22 }}>
            <div style={{ width: META.width, height: META.height, transform: `scale(${s})`, transformOrigin: '0 0' }}>
              <Frame t={t} />
            </div>
            <div style={{ position: 'absolute', top: th + 3, left: 4, font: '12px ui-monospace, Menlo', color: '#3c4650' }}>{t.toFixed(1)}s</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
}
