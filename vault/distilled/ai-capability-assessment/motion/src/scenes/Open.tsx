import { BEAT, E } from '../timeline';
import { C, Dot, Draw, SPINE_Y, T, W, back, clamp, easeInOut, lerp, prog, win } from '../draw';

/** One line: the signal continues solid, the real state leaves the node dashed; the line sinks into the spine. */
export function Open({ t }: { t: number }) {
  const b = BEAT.open, tx = b.text;
  if (t > b.end) return null;
  const node = E('open.node'), split = E('open.split'), sink = E('open.sink');
  const dy = lerp(0, SPINE_Y - 540, prog(t, sink, 0.9, easeInOut));
  const off = 100 * (1 - prog(t, sink, 0.6, easeInOut));
  const k = prog(t, split, 1.4, easeInOut);
  const txtOp = 1 - clamp((t - sink) / 0.4);
  const ti = E('open.n1') + 0.2;
  return (
    <>
      <g transform={`translate(0 ${dy})`} opacity={1 - clamp((t - sink - 0.5) / 0.4)}>
        <Draw x1={360} y1={540} x2={960} y2={540} k={prog(t, 0.3, node - 0.3, easeInOut)} />
        <Draw x1={960} y1={540} x2={1560} y2={540} k={k} />
        {k > 0 && (
          <path d={`M960 540 C 1040 540, 1060 ${540 + off}, 1160 ${540 + off} L ${lerp(1160, 1560, k)} ${540 + off}`}
            fill="none" stroke={C.mist} strokeWidth={3} strokeDasharray="8 9" opacity={k} />
        )}
        <Dot cx={960} cy={540} r={9 * back((t - node) / 0.4)} />
        <T x={960} y={500 - 8 * (1 - prog(t, node + 0.1))} size={44} weight={600} anchor="middle" op={win(t, node + 0.1) * txtOp}>{tx.signal}</T>
        <T x={1180} y={700 - 8 * (1 - prog(t, split + 0.6))} size={44} weight={600} fill={C.mist} op={win(t, split + 0.6) * txtOp}>{tx.state}</T>
      </g>
      <g opacity={win(t, ti, b.end - 0.1, 0.7, 0.7)} transform={`translate(0 ${14 * (1 - prog(t, ti, 0.9))})`}>
        <T x={W / 2} y={500} size={96} font="serif" anchor="middle">{tx.title}</T>
        <T x={W / 2} y={580} size={38} anchor="middle" fill={C.mist}>{tx.sub}</T>
      </g>
    </>
  );
}
