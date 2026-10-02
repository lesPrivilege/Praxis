import React from 'react';
import { BEAT, E } from '../timeline';
import { C, NODES, SPINE_Y, T, W, clamp, easeInOut, prog, scaleAt, win } from '../draw';

/** Question label and title; the body collapses into its spine node at `<id>.collapse`. */
export function SceneFrame({ t, id, idx, children }: { t: number; id: string; idx: number; children: React.ReactNode }) {
  const b = BEAT[id], c = E(id + '.collapse');
  if (t < b.start || t > b.end) return null;
  const rise = 16 * (1 - prog(t, E(id + '.title'), 0.8));
  const k = prog(t, c, 0.7, easeInOut), nx = NODES[idx];
  return (
    <>
      <g opacity={win(t, E(id + '.title'), c, 0.6, 0.4)} transform={`translate(0 ${rise})`}>
        <T x={160} y={132} size={26} font="mono" fill={C.mist}>{b.text.q}</T>
        <T x={160} y={196} size={54} font="serif">{b.text.title}</T>
      </g>
      <g opacity={1 - clamp((t - c - 0.15) / 0.5)} transform={scaleAt(nx, SPINE_Y, 1 - 0.96 * k)}>{children}</g>
    </>
  );
}

export function Claim({ t, id, y = 890 }: { t: number; id: string; y?: number }) {
  const a = E(id + '.claim');
  return <T x={W / 2} y={y + 10 * (1 - prog(t, a, 0.6))} size={44} weight={600} anchor="middle" op={win(t, a)}>{BEAT[id].text.claim}</T>;
}
