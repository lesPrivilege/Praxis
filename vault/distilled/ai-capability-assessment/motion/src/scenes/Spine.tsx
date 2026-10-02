import { BEAT, E } from '../timeline';
import { C, Dot, Ln, NODES, SPINE_Y, T, back, clamp, easeInOut, lerp, prog, win } from '../draw';

const QS = ['q1', 'q2', 'q3', 'q4', 'q5'];

/** The persistent line: five nodes, a solid/dashed mark per answered question, rises to centre at the end. */
export function Spine({ t }: { t: number }) {
  const sink = E('open.sink'), rise = E('end.rise'), fade = E('end.fade');
  if (t < sink) return null;
  const y = lerp(SPINE_Y, 560, prog(t, rise, 1.6, easeInOut));
  const lineOp = clamp((t - sink) / 0.4) * (1 - clamp((t - fade) / 1.4));
  return (
    <g>
      <Ln x1={NODES[0] - 120} y1={y} x2={NODES[4] + 120} y2={y} stroke={C.line2} w={2} op={lineOp} />
      {QS.map((q, i) => {
        const x = NODES[i], b = BEAT[q], col = E(q + '.collapse');
        const active = t >= b.start && t < col + 0.5, done = t >= col + 0.5;
        const pop = back((t - E('open.n' + (i + 1))) / 0.45);
        const m = prog(t, col + 0.5, 0.5);
        const a = t >= rise ? E('end.l' + (i + 1)) : 0;
        const endOp = t >= rise ? win(t, a, fade + 1.4, 0.5, 1.4) : 0;
        return (
          <g key={q}>
            <Dot cx={x} cy={y} r={7 * pop * (active ? 1.35 : 1)} fill={active || done ? C.ink : C.paper} stroke={active || done ? C.ink : C.mist2} op={lineOp} />
            {t > sink + 0.8 && (
              <T x={x} y={y + 44} size={20} font="mono" anchor="middle" fill={active ? C.ink : C.mist2} op={lineOp * (1 - prog(t, rise, 0.6))}>{`Q${i + 1}`}</T>
            )}
            {m > 0 && (
              <g opacity={m * lineOp}>
                <Ln x1={x - 14} y1={y - 26} x2={x + 14} y2={y - 26} />
                <Ln x1={x - 14} y1={y - 38} x2={x + 14} y2={y - 38} dash="4 5" stroke={C.mist} />
              </g>
            )}
            <T x={x} y={y + 58 + 8 * (1 - prog(t, a, 0.5))} size={28} weight={600} anchor="middle" op={endOp}>{b.text.mark}</T>
            <T x={x} y={y - 64} size={20} font="mono" anchor="middle" fill={C.mist} op={endOp}>{`Q${i + 1}`}</T>
          </g>
        );
      })}
    </g>
  );
}
