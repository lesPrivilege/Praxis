import { AbsoluteFill, Html5Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { BEAT, E, META, TL } from './timeline';
import { C, T, win } from './draw';
import { Open } from './scenes/Open';
import { Q1 } from './scenes/Q1';
import { Q2 } from './scenes/Q2';
import { Q3 } from './scenes/Q3';
import { Q4 } from './scenes/Q4';
import { Q5 } from './scenes/Q5';
import { End } from './scenes/End';
import { Spine } from './scenes/Spine';

/** Everything on screen is a pure function of t (seconds on the timeline.json clock). */
export function Frame({ t }: { t: number }) {
  return (
    <svg width={META.width} height={META.height} viewBox={`0 0 ${META.width} ${META.height}`} style={{ display: 'block' }}>
      <rect width={META.width} height={META.height} fill={C.canvas} />
      <T x={1760} y={132} size={22} anchor="end" fill={C.mist} op={win(t, BEAT.q1.start, E('end.rise'), 0.6, 0.8)}>{BEAT.open.text.title}</T>
      <Open t={t} />
      <Q1 t={t} />
      <Q2 t={t} />
      <Q3 t={t} />
      <Q4 t={t} />
      <Q5 t={t} />
      <End t={t} />
      <Spine t={t} />
    </svg>
  );
}

export function Film() {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: C.canvas }}>
      <Frame t={frame / META.fps} />
      {/* beat markers for the Studio timeline; drawing reads absolute time above */}
      {TL.beats.map((b) => (
        <Sequence key={b.id} name={b.id} from={Math.round(b.start * META.fps)} durationInFrames={Math.round((b.end - b.start) * META.fps)} layout="none">
          {null}
        </Sequence>
      ))}
      <Html5Audio src={staticFile('score.wav')} />
    </AbsoluteFill>
  );
}
