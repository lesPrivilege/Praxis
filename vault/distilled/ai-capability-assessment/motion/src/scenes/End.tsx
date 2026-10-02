import { BEAT, E } from '../timeline';
import { C, Ln, T, W, clamp, prog, win } from '../draw';

/** The opening pair returns as an inequality; the thesis resolves it. */
export function End({ t }: { t: number }) {
  const b = BEAT.end, tx = b.text;
  if (t < b.start) return null;
  const echo = E('end.echo'), th = E('end.thesis');
  const out = 1 - clamp((t - E('end.fade')) / 1.4), e = win(t, echo, 1e9, 0.6) * out, x = W / 2;
  return (
    <>
      <T x={x - 30} y={300} size={40} weight={600} anchor="end" op={e}>{tx.signal}</T>
      <Ln x1={x - 250} y1={322} x2={x - 30} y2={322} op={e} />
      <T x={x} y={300} size={40} anchor="middle" fill={C.mist} op={e}>≠</T>
      <T x={x + 30} y={300} size={40} weight={600} fill={C.mist} op={e}>{tx.state}</T>
      <Ln x1={x + 30} y1={322} x2={x + 290} y2={322} dash="8 9" stroke={C.mist} op={e} />
      <T x={x} y={830 + 10 * (1 - prog(t, th, 0.7))} size={58} font="serif" anchor="middle" op={win(t, th, 1e9, 0.8) * out}>{tx.thesis}</T>
    </>
  );
}
