// Tokens from ../rendered/style.css. Solid = happened or determined; dashed = not yet or unconfirmed;
// cobalt only where a person decides.
import React from 'react';

export const W = 1920;
export const SPINE_Y = 1000;
export const NODES = [480, 720, 960, 1200, 1440];
export const C = {
  ink: '#101a24', ink2: '#3a4756', mist: '#647282', mist2: '#97a4b2', line: '#e2e8ee', line2: '#c5d0da',
  bar: '#66788b', ice: '#e9f4fc', ice2: '#a8d1f0', cobalt: '#1f6fd6', paper: '#ffffff', canvas: '#f3f7fa',
};
const FONT = {
  sans: '-apple-system, "PingFang SC", "Hiragino Sans GB", sans-serif',
  serif: '"Songti SC", "STSong", serif',
  mono: '"SF Mono", ui-monospace, Menlo, monospace',
};

export const clamp = (x: number) => Math.max(0, Math.min(1, x));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const easeOut = (x: number) => 1 - Math.pow(1 - clamp(x), 3);
export const easeInOut = (x: number) => { x = clamp(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
export const back = (x: number) => { x = clamp(x); const c = 1.4; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
export const prog = (t: number, a: number, d = 0.6, f = easeOut) => f((t - a) / d);
/** Opacity window: fade in at a, fade out at b. */
export const win = (t: number, a: number, b = 1e9, fi = 0.5, fo = 0.5) => Math.min(clamp((t - a) / fi), clamp((b - t) / fo));

type TextProps = {
  x: number; y: number; children: React.ReactNode; size?: number; weight?: number;
  font?: keyof typeof FONT; anchor?: 'start' | 'middle' | 'end'; fill?: string; op?: number;
};
export const T = ({ x, y, children, size = 32, weight = 400, font = 'sans', anchor = 'start', fill = C.ink, op = 1 }: TextProps) =>
  op <= 0 ? null : (
    <text x={x} y={y} fontSize={size} fontWeight={font === 'serif' ? 600 : weight} fontFamily={FONT[font]} textAnchor={anchor} fill={fill} opacity={op}>
      {children}
    </text>
  );

type LineProps = { x1: number; y1: number; x2: number; y2: number; stroke?: string; w?: number; dash?: string; op?: number };
export const Ln = ({ x1, y1, x2, y2, stroke = C.ink, w = 3, dash, op = 1 }: LineProps) =>
  op <= 0 ? null : <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth={w} strokeDasharray={dash} strokeLinecap="round" opacity={op} />;

/** Draw fraction k of a segment. */
export const Draw = ({ k, ...p }: LineProps & { k: number }) =>
  k <= 0 ? null : <Ln {...p} x2={lerp(p.x1, p.x2, k)} y2={lerp(p.y1, p.y2, k)} />;

type RectProps = { x: number; y: number; w: number; h: number; rx?: number; fill?: string; stroke?: string; sw?: number; dash?: string; op?: number };
export const Rc = ({ x, y, w, h, rx = 6, fill = 'none', stroke = 'none', sw = 2, dash, op = 1 }: RectProps) =>
  op <= 0 || w <= 0 || h <= 0 ? null : (
    <rect x={x} y={y} width={w} height={h} rx={rx} fill={fill} stroke={stroke} strokeWidth={sw} strokeDasharray={dash} opacity={op} />
  );

export const Dot = ({ cx, cy, r, fill = C.ink, stroke, sw = 2, dash, op = 1 }: { cx: number; cy: number; r: number; fill?: string; stroke?: string; sw?: number; dash?: string; op?: number }) =>
  r <= 0 || op <= 0 ? null : <circle cx={cx} cy={cy} r={r} fill={fill} stroke={stroke} strokeWidth={sw} strokeDasharray={dash} opacity={op} />;

/** Scale around a point. */
export const scaleAt = (x: number, y: number, s: number) => `translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})`;
