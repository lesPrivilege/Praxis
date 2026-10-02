import { BEAT, E } from '../timeline';
import { C, Ln, Rc, T, back, clamp, easeInOut, prog, scaleAt, win } from '../draw';
import { Claim, SceneFrame } from './frame';

const DX = 220, DY = 340, DW = 340, DH = 420, LX = 640;
const WIDTHS = [260, 230, 280, 200, 250, 270, 180, 240, 210];
const MX = 1220, MY = 400, CW = 200, CH = 110;

/** One edit splits into D1 and D2, four versions are tested apart, approval stays scoped. */
export function Q5({ t }: { t: number }) {
  const tx = BEAT.q5.text;
  const doc = E('q5.doc'), sp = E('q5.split'), why = E('q5.why'), sc = E('q5.scope'), ap = E('q5.approve');
  const d = win(t, doc, 1e9, 0.6);
  const y1 = DY + 50 + 3 * 40, y2 = DY + 50 + 6 * 40;
  const split = prog(t, sp, 0.9, easeInOut), e1y = y1 - 60 * split, e2y = y2 + 60 * split;
  const bOp = win(t, doc + 1.3, sp + 0.3, 0.5, 0.3), bx = 980;
  const mOp = win(t, E('q5.m1') - 0.4, 1e9, 0.5);
  return (
    <SceneFrame t={t} id="q5" idx={4}>
      <Rc x={DX} y={DY} w={DW} h={DH} rx={4} fill={C.paper} stroke={C.line2} op={d} />
      <T x={DX} y={DY - 22} size={26} fill={C.ink2} op={d}>{tx.doc}</T>
      {WIDTHS.map((wv, i) => {
        const yy = DY + 50 + i * 40;
        if (i === 3) return (
          <g key={i}>
            <Ln x1={DX + 30} y1={yy} x2={DX + 30 + wv} y2={yy} w={6} stroke={C.line2} op={d} />
            <Ln x1={DX + 24} y1={yy} x2={DX + 36 + wv} y2={yy} op={d * prog(t, doc + 0.6, 0.5)} />
          </g>
        );
        if (i === 6) return <Ln key={i} x1={DX + 30} y1={yy} x2={DX + 90 + wv} y2={yy} w={7} stroke={C.ink2} op={d * prog(t, doc + 0.9, 0.5)} />;
        return <Ln key={i} x1={DX + 30} y1={yy} x2={DX + 30 + wv} y2={yy} w={6} stroke={C.line2} op={d} />;
      })}
      <Ln x1={DX + DW + 10} y1={y1} x2={LX - 14} y2={e1y} w={1.5} stroke={C.mist2} op={win(t, doc + 0.6)} />
      <Ln x1={DX + DW + 10} y1={y2} x2={LX - 14} y2={e2y} w={1.5} stroke={C.mist2} op={win(t, doc + 0.9)} />
      <T x={LX} y={e1y + 10} size={30} weight={600} op={win(t, doc + 0.6)}>{'− ' + tx.d1}</T>
      <T x={LX} y={e2y + 10} size={30} weight={600} op={win(t, doc + 0.9)}>{'+ ' + tx.d2}</T>
      <T x={LX + 26} y={e1y + 50} size={24} fill={C.mist} op={win(t, why)}>{tx.why}</T>
      <T x={LX + 26} y={e2y + 50} size={24} fill={C.mist} op={win(t, why + 0.3)}>{tx.why}</T>
      {/* the brace that binds both as "one edit" breaks at the split */}
      <path d={`M${bx} ${y1 - 10} q 18 0 18 18 v ${(y2 - y1) / 2 - 26} q 0 8 12 8 q -12 0 -12 8 v ${(y2 - y1) / 2 - 26} q 0 18 -18 18`}
        fill="none" stroke={C.ink2} strokeWidth={2.5} opacity={bOp} />
      <T x={bx + 44} y={(y1 + y2) / 2 + 10} size={28} fill={C.ink2} op={bOp}>{tx.once}</T>
      {/* 2×2 counterfactual matrix: rows = deletion, cols = formula */}
      <T x={MX + CW} y={MY - 50} size={24} fill={C.mist} anchor="middle" op={mOp}>补偿公式</T>
      {tx.cols.map((c: string, j: number) => <T key={c} x={MX + j * CW + CW / 2} y={MY - 14} size={24} fill={C.ink2} anchor="middle" op={mOp}>{c}</T>)}
      <T x={MX - 90} y={MY + CH} size={24} fill={C.mist} anchor="middle" op={mOp}>风险提示</T>
      {tx.rows.map((r: string, i: number) => <T key={r} x={MX - 20} y={MY + i * CH + CH / 2 + 9} size={24} fill={C.ink2} anchor="end" op={mOp}>{r}</T>)}
      {['q5.m1', 'q5.m2', 'q5.m3', 'q5.m4'].map((id, k) => {
        const e = E(id), x = MX + (k % 2) * CW, y = MY + Math.floor(k / 2) * CH;
        return (
          <g key={id} opacity={clamp((t - e) / 0.3)} transform={scaleAt(x + CW / 2, y + CH / 2, back((t - e) / 0.4))}>
            <Rc x={x + 6} y={y + 6} w={CW - 12} h={CH - 12} rx={4} fill={C.paper} stroke={C.ink} />
            <T x={x + CW / 2} y={y + CH / 2 + 10} size={28} weight={600} anchor="middle">{tx.cells[k]}</T>
          </g>
        );
      })}
      <T x={MX + CW} y={MY + 2 * CH + 44} size={26} fill={C.ink2} anchor="middle" op={win(t, E('q5.m4') + 0.3)}>{tx.matrix}</T>
      {/* other jurisdictions: not inherited */}
      {tx.other.map((n: string, i: number) => {
        const x = MX + i * 150, o = win(t, sc + i * 0.25);
        return (
          <g key={n}>
            <Rc x={x} y={740} w={128} h={54} rx={27} stroke={C.mist} dash="6 6" fill={C.paper} op={o} />
            <T x={x + 64} y={776} size={26} anchor="middle" fill={C.mist} op={o}>{n}</T>
          </g>
        );
      })}
      <T x={MX + 310} y={776} size={26} fill={C.mist} op={win(t, sc + 0.6)}>{tx.noInherit}</T>
      {/* approval, scoped to client A and this jurisdiction: a decision someone owns */}
      <Rc x={DX - 12} y={DY - 12} w={DW + 24} h={DH + 24} rx={8} stroke={C.cobalt} sw={3} op={prog(t, ap, 0.6, easeInOut)} />
      <T x={DX - 12} y={DY + DH + 56} size={28} weight={600} fill={C.cobalt} op={win(t, ap + 0.2)}>{tx.approve}</T>
      <Claim t={t} id="q5" y={930} />
    </SceneFrame>
  );
}
