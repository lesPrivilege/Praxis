import { BEAT, E } from '../timeline';
import { C, Draw, Ln, Rc, T, W, easeInOut, prog, win } from '../draw';
import { SceneFrame } from './frame';

const X0 = 360, U = 20; // 20 px per yuan, one scale 0–60

/** A 2-yuan call grows into the cost of an accepted result; unknown rework eats the saving. */
export function Q2({ t }: { t: number }) {
  const tx = BEAT.q2.text;
  const call = E('q2.call'), rev = E('q2.review'), man = E('q2.manual'), sav = E('q2.saved'), rw = E('q2.rework'), f = E('q2.formula');
  const yA = 430, yM = 610, h = 60;
  const d = prog(t, sav, 0.7), k = prog(t, rw, 1.2, easeInOut);
  const x27 = X0 + 27 * U, x60 = X0 + 60 * U, yb = yA + h + 40;
  return (
    <SceneFrame t={t} id="q2" idx={1}>
      <Rc x={X0} y={yA} w={2 * U * prog(t, call, 0.6)} h={h} fill={C.ink2} rx={2} />
      <T x={X0} y={yA - 18} size={28} weight={600} op={win(t, call + 0.1, rev, 0.4, 0.3)}>{tx.call}</T>
      <T x={X0 + 70} y={yA + 42} size={28} fill={C.mist} op={win(t, call + 0.5, rev, 0.4, 0.3)}>{tx.callNote}</T>
      <Rc x={X0 + 2 * U} y={yA} w={25 * U * prog(t, rev, 0.9, easeInOut)} h={h} fill={C.bar} rx={2} />
      <T x={X0 + 2 * U + 12} y={yA + 40} size={26} weight={600} fill={C.paper} op={win(t, rev + 0.7)}>{tx.review}</T>
      <T x={X0} y={yA - 18} size={28} weight={600} op={win(t, rev + 0.5)}>{tx.aiTotal}</T>
      <Rc x={X0} y={yM} w={60 * U * prog(t, man, 1.0, easeInOut)} h={h} fill={C.line2} rx={2} />
      <T x={X0} y={yM + h + 40} size={28} weight={600} fill={C.ink2} op={win(t, man + 0.6)}>{tx.manual}</T>
      <Ln x1={x27} y1={yA + h + 6} x2={x27} y2={yM - 6} w={2} dash="3 6" stroke={C.mist} op={d} />
      <Ln x1={x60} y1={yA + h + 6} x2={x60} y2={yM - 6} w={2} dash="3 6" stroke={C.mist} op={d} />
      <Draw x1={x27} y1={yb} x2={x60} y2={yb} k={d} w={2} stroke={C.ink2} />
      <T x={(x27 + x60) / 2} y={yb - 12} size={30} weight={600} anchor="middle" op={win(t, sav + 0.3)}>{tx.saved}</T>
      <Rc x={x27} y={yA} w={190 * k} h={h} stroke={C.ink2} sw={2.5} dash="8 7" rx={2} />
      <T x={x27 + 206} y={yA + 40} size={34} weight={600} font="mono" op={win(t, rw + 0.9)}>?</T>
      <T x={x27 + 12} y={yA - 18} size={26} fill={C.ink2} op={win(t, rw + 0.6)}>{tx.rework}</T>
      <T x={(x27 + x60) / 2} y={yb + 34} size={26} fill={C.mist} anchor="middle" op={win(t, rw + 1.0)}>{tx.notNet}</T>
      <T x={W / 2} y={860 + 10 * (1 - prog(t, f))} size={46} weight={600} anchor="middle" op={win(t, f)}>{tx.formula}</T>
      <T x={W / 2} y={910} size={24} fill={C.mist} anchor="middle" op={win(t, f + 0.5)}>{tx.note}</T>
    </SceneFrame>
  );
}
