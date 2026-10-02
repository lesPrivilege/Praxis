import { BEAT, E } from '../timeline';
import { C, Dot, Draw, Rc, T, back, easeInOut, lerp, prog, win } from '../draw';
import { Claim, SceneFrame } from './frame';

const Envelope = ({ x, y, w, op, stroke = C.ink }: { x: number; y: number; w: number; op: number; stroke?: string }) =>
  op <= 0 ? null : (
    <g opacity={op}>
      <rect x={x} y={y} width={w} height={w * 0.66} rx={4} fill={C.paper} stroke={stroke} strokeWidth={2.5} />
      <path d={`M${x} ${y} L${x + w / 2} ${y + w * 0.36} L${x + w} ${y}`} fill="none" stroke={stroke} strokeWidth={2.5} />
    </g>
  );

/** Timeout makes the state unknown; resending duplicates, checking the record branches into three outcomes. */
export function Q3({ t }: { t: number }) {
  const tx = BEAT.q3.text;
  const snd = E('q3.send'), to = E('q3.timeout'), rs = E('q3.resend'), ck = E('q3.check');
  const y = 540, mv = prog(t, snd, 1.4, easeInOut);
  return (
    <SceneFrame t={t} id="q3" idx={2}>
      <Draw x1={260} y1={y} x2={760} y2={y} k={prog(t, snd - 0.6, 0.6, easeInOut)} />
      <Rc x={760} y={y - 36} w={150} h={72} stroke={C.ink} fill={C.paper} op={win(t, snd - 0.4)} />
      <T x={835} y={y + 11} size={30} weight={600} anchor="middle" op={win(t, snd - 0.4)}>{tx.send}</T>
      <Envelope x={lerp(250, 660, mv)} y={y - 27} w={82} op={win(t, snd, to + 0.3, 0.3, 0.3)} />
      <T x={250} y={y - 50} size={26} fill={C.mist} op={win(t, snd, snd + 1.2, 0.3, 0.3)}>{tx.mail}</T>
      {/* after the timeout: unconfirmed, dashed */}
      <Draw x1={910} y1={y} x2={1060} y2={y} k={prog(t, to, 0.8, easeInOut)} dash="8 9" stroke={C.mist} />
      <Dot cx={1080} cy={y} r={18 * back((t - to - 0.5) / 0.4)} fill={C.paper} stroke={C.ink} sw={3} dash="5 5" />
      <T x={935} y={y - 60} size={26} fill={C.mist} op={win(t, to + 0.2)}>{tx.timeout}</T>
      <T x={1050} y={y + 84} size={40} font="mono" weight={600} anchor="end" op={win(t, to + 0.5)}>{tx.unknown}</T>
      {/* wrong branch: resend */}
      <Draw x1={1098} y1={y - 10} x2={1300} y2={360} k={prog(t, rs, 0.8, easeInOut)} w={2.5} stroke={C.mist2} />
      <T x={1180} y={400} size={28} fill={C.mist} anchor="end" op={win(t, rs + 0.3)}>{tx.resend}</T>
      <Envelope x={1330} y={330} w={64} op={win(t, rs + 0.6)} stroke={C.mist2} />
      <Envelope x={1356} y={346} w={64} op={win(t, rs + 0.9)} stroke={C.mist2} />
      <T x={1330} y={440} size={26} fill={C.mist} op={win(t, rs + 1.0)}>{tx.dup}</T>
      {/* decision branch (cobalt): check the authoritative record */}
      <Draw x1={1098} y1={y + 10} x2={1300} y2={720} k={prog(t, ck, 0.8, easeInOut)} w={3.5} stroke={C.cobalt} />
      <Dot cx={1300} cy={720} r={10 * back((t - ck - 0.6) / 0.4)} fill={C.cobalt} />
      <T x={1270} y={800} size={30} weight={600} anchor="end" fill={C.cobalt} op={win(t, ck + 0.3)}>{tx.check}</T>
      {['q3.o1', 'q3.o2', 'q3.o3'].map((id, i) => {
        const e = E(id), yy = 650 + i * 70;
        return (
          <g key={id}>
            <Draw x1={1310} y1={720} x2={1390} y2={yy} k={prog(t, e, 0.4, easeInOut)} w={2} stroke={C.cobalt} />
            <T x={1404} y={yy + 10} size={28} weight={i === 1 ? 600 : 400} op={win(t, e + 0.2, 1e9, 0.35)}>{tx.outcomes[i]}</T>
          </g>
        );
      })}
      <Claim t={t} id="q3" y={930} />
    </SceneFrame>
  );
}
