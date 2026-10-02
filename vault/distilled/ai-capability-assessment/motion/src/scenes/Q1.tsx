import { BEAT, E } from '../timeline';
import { C, Draw, Ln, Rc, T, easeInOut, lerp, prog, win } from '../draw';
import { Claim, SceneFrame } from './frame';

/** The constraint drops out of the request at compression, then lives in the task-state rail. */
export function Q1({ t }: { t: number }) {
  const tx = BEAT.q1.text;
  const cnt = E('q1.count'), cmp = E('q1.compress'), st = E('q1.state');
  const appear = win(t, cnt - 0.4, 1e9, 0.6);
  const bw = lerp(760, 520, prog(t, cmp, 0.6, easeInOut)), bx = 960 - bw / 2, by = 470;
  const round = Math.round(lerp(1, 40, prog(t, cnt, 2.8, easeInOut)));
  const cw = 170, gap = 36;
  const fall = prog(t, cmp + 0.1, 0.8, easeInOut), toRail = prog(t, st, 1.0, easeInOut);
  const inside = [0, 1, 2].map((i) => bx + (bw - (3 * cw + 2 * gap)) / 2 + i * (cw + gap));
  const packed = [0, bx + (bw - (2 * cw + gap)) / 2, bx + (bw - (2 * cw + gap)) / 2 + cw + gap];
  const chips = [0, 1, 2].map((i) => {
    let x = inside[i], y = by + 40, dash: string | undefined, op = appear, col = C.ink;
    if (i > 0) x = lerp(inside[i], packed[i], fall);
    else {
      x = lerp(inside[0], 620, fall); y = lerp(by + 40, 700, fall);
      if (fall > 0.3 && toRail === 0) { dash = '7 7'; col = C.mist; op = appear * lerp(1, 0.75, fall); }
      if (toRail > 0) { x = lerp(620, 380, toRail); y = lerp(700, 300, toRail); dash = toRail > 0.5 ? undefined : '7 7'; col = toRail > 0.5 ? C.ink : C.mist; }
    }
    return (
      <g key={i}>
        <Rc x={x} y={y} w={cw} h={60} rx={30} stroke={col} sw={2.5} dash={dash} fill={C.paper} op={op} />
        <T x={x + cw / 2} y={y + 41} size={28} weight={600} anchor="middle" fill={col} op={op}>{tx.chips[i]}</T>
      </g>
    );
  });
  const rail = prog(t, st + 0.3, 1.0, easeInOut);
  const ticks = Array.from({ length: 12 }, (_, i) => 600 + i * 90 - (((t - st) * 40) % 90)).filter((x) => x > 580 && x < 1620);
  return (
    <SceneFrame t={t} id="q1" idx={0}>
      <T x={bx} y={440} size={26} fill={C.mist} op={appear}>{tx.box}</T>
      <T x={bx + bw} y={440} size={30} font="mono" anchor="end" op={appear}>{`${tx.round} ${round} ${tx.roundUnit}`}</T>
      <Rc x={bx} y={by} w={bw} h={140} fill={C.paper} stroke={C.line2} op={appear} />
      <T x={960} y={by + 95} size={26} anchor="middle" fill={C.mist} op={win(t, cmp, cmp + 1.2, 0.2, 0.5)}>{tx.compress}</T>
      <T x={810} y={742} size={36} weight={600} op={win(t, E('q1.missing'), st - 0.3, 0.5, 0.4)}>{tx.missing}</T>
      <T x={810} y={792} size={28} fill={C.mist} op={win(t, E('q1.alts'), st - 0.3, 0.5, 0.4)}>{tx.alts}</T>
      {/* task state: solid, carried at every step; files dashed, read when needed */}
      <Draw x1={300} y1={330} x2={1620} y2={330} k={rail} />
      {ticks.map((x) => <Ln key={x} x1={x} y1={322} x2={x} y2={338} w={2} op={rail * 0.6} />)}
      <T x={300} y={290} size={26} fill={C.ink2} op={win(t, st + 0.6)}>{tx.rail}</T>
      <Draw x1={300} y1={700} x2={1620} y2={700} k={prog(t, st + 0.8, 1.0, easeInOut)} w={2.5} dash="8 10" stroke={C.mist} />
      <T x={300} y={670} size={26} fill={C.mist} op={win(t, st + 1.0)}>{tx.files}</T>
      <Ln x1={960} y1={330} x2={960} y2={by} w={2} stroke={C.ink2} op={rail * appear} />
      <Ln x1={1180} y1={700} x2={1180} y2={by + 140} w={2} dash="5 7" stroke={C.mist} op={win(t, st + 1.2)} />
      {chips}
      <Claim t={t} id="q1" />
    </SceneFrame>
  );
}
