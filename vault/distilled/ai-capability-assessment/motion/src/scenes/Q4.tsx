import { BEAT, E } from '../timeline';
import { C, Dot, Draw, Ln, Rc, T, W, back, clamp, easeInOut, lerp, prog, scaleAt, win } from '../draw';
import { Claim, SceneFrame } from './frame';

const XS = [560, 790, 1020, 1250], BASE = 720, H = 330, BW = 130;
const A0 = 360, A1 = 1560, AY = 600, LO = 0.2, HI = 0.6; // illustrative thresholds, not constants
const zx = (p: number) => lerp(A0, A1, p);

/** The score unfolds into distribution A, morphs into B, and lands on the probability rule. */
export function Q4({ t }: { t: number }) {
  const tx = BEAT.q4.text;
  const num = E('q4.number'), gate = E('q4.gate'), rev = E('q4.reveal'), mB = E('q4.morphB'), ax = E('q4.axis');
  const unfold = prog(t, rev, 1.1, easeInOut), toAxis = prog(t, ax - 0.5, 0.6, easeInOut);
  const push = 1 + 0.035 * prog(t, rev, 3.5, easeInOut) * (1 - toAxis); // camera: push in on the reveal
  const kb = prog(t, mB, 1.2, easeInOut), meanVal = lerp(1.99, 1.5, kb);
  const g = win(t, gate, rev + 0.4, 0.4, 0.4), barsOp = unfold * (1 - toAxis);
  const axk = prog(t, ax, 0.8, easeInOut), z = prog(t, E('q4.zones'), 0.7, easeInOut), dots = E('q4.dots');
  const zones = [[0, LO, C.line, undefined], [LO, HI, C.ice, C.cobalt], [HI, 1, C.line2, undefined]] as const;
  return (
    <SceneFrame t={t} id="q4" idx={3}>
      <g transform={scaleAt(960, 540, push)}>
        <T x={lerp(820, 560, unfold)} y={lerp(600, 330, unfold)} size={lerp(210, 40, unfold)} font="mono" weight={600}
          anchor={unfold > 0.5 ? 'start' : 'middle'} op={win(t, num, 1e9, 0.5) * (1 - toAxis)}>
          {unfold > 0.5 ? `均值 ${meanVal.toFixed(2)}` : tx.score}
        </T>
        <Ln x1={1240} y1={360} x2={1240} y2={640} op={g} />
        <T x={1240} y={336} size={30} font="mono" anchor="middle" op={g}>{tx.gate}</T>
        <T x={1240} y={700} size={30} fill={C.mist} anchor="middle" op={g}>{tx.pass}</T>
        {barsOp > 0 && (
          <g opacity={barsOp}>
            <Ln x1={520} y1={BASE} x2={1420} y2={BASE} w={2} stroke={C.line2} />
            {XS.map((x, i) => {
              const p = lerp(tx.A[i], tx.B[i], kb), hh = H * p * prog(t, rev + 0.3 + i * 0.08, 0.9, easeInOut), tail = i >= 2;
              return (
                <g key={i}>
                  <Rc x={x} y={BASE - hh} w={BW} h={hh} fill={tail ? C.ink : C.mist2} rx={2} />
                  <T x={x + BW / 2} y={BASE - hh - 14} size={28} font="mono" anchor="middle" op={clamp((t - rev - 0.6) / 0.4)}>{`${Math.round(p * 100)}%`}</T>
                  <T x={x + BW / 2} y={BASE + 40} size={26} anchor="middle" fill={tail ? C.ink : C.mist} weight={tail ? 600 : 400}>{tx.levels[i]}</T>
                </g>
              );
            })}
            <T x={1420} y={330} size={22} fill={C.mist} anchor="end">构造示例</T>
          </g>
        )}
        <T x={W / 2} y={860} size={34} weight={600} anchor="middle" op={win(t, E('q4.readA'), mB - 0.2, 0.5, 0.4)}>{tx.readA}</T>
        <T x={W / 2} y={860} size={34} weight={600} anchor="middle" op={win(t, mB + 0.5, E('q4.tail') - 0.1, 0.5, 0.3)}>{tx.readB}</T>
        <T x={W / 2} y={866} size={46} weight={600} anchor="middle" op={win(t, E('q4.tail'), E('q4.claim') - 0.2, 0.5, 0.4)}>{tx.tail}</T>
        {axk > 0 && (
          <g>
            {zones.map(([a, b, fill, stroke], i) => (
              <g key={i}>
                <Rc x={zx(a)} y={AY - 70} w={(zx(b) - zx(a)) * z} h={70} rx={0} fill={fill} stroke={stroke} />
                <T x={(zx(a) + zx(b)) / 2} y={AY - 26} size={30} weight={600} anchor="middle" fill={i === 1 ? C.cobalt : C.ink} op={z}>{tx.zones[i]}</T>
              </g>
            ))}
            <Draw x1={A0} y1={AY} x2={A1} y2={AY} k={axk} />
            <T x={A0} y={AY + 44} size={24} font="mono" fill={C.mist} op={axk}>0%</T>
            <T x={A1} y={AY + 44} size={24} font="mono" anchor="end" fill={C.mist} op={axk}>100%</T>
            <T x={A0} y={AY - 110} size={32} font="mono" weight={600} op={axk}>{tx.axis}</T>
            <Ln x1={zx(LO)} y1={AY - 90} x2={zx(LO)} y2={AY + 16} w={2} dash="5 6" stroke={C.ink2} op={z} />
            <Ln x1={zx(HI)} y1={AY - 90} x2={zx(HI)} y2={AY + 16} w={2} dash="5 6" stroke={C.ink2} op={z} />
            <T x={zx(LO)} y={AY + 76} size={24} anchor="middle" fill={C.ink2} op={z}>{tx.limits[0]}</T>
            <T x={zx(HI)} y={AY + 76} size={24} anchor="middle" fill={C.ink2} op={z}>{tx.limits[1]}</T>
            <T x={A1} y={AY + 76} size={22} anchor="end" fill={C.mist} op={z}>{tx.sample}</T>
            {([['A', 0.99], ['B', 0.5]] as const).map(([n, p], i) => {
              const s = t - dots - i * 0.35, x = zx(p), o = clamp(s / 0.3);
              return (
                <g key={n}>
                  <Dot cx={x} cy={AY} r={12 * back(s / 0.45)} />
                  <T x={x} y={AY - 92} size={30} font="mono" weight={600} anchor="middle" op={o}>{n}</T>
                  <Ln x1={x} y1={AY - 14} x2={x} y2={AY - 82} w={1.5} stroke={C.ink2} op={o} />
                </g>
              );
            })}
          </g>
        )}
        <Claim t={t} id="q4" />
      </g>
    </SceneFrame>
  );
}
