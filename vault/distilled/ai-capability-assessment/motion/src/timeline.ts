// timeline.json is the single clock: scene timing, on-screen text and sound events.
import data from '../timeline.json';

export type Event = { id: string; t: number; sound?: string };
export type Beat = {
  id: string; start: number; end: number; claim: string; evidence: string; viewer_read: string;
  visual_object: string; state_before: string; transformation: string; state_after: string; camera: string;
  text: Record<string, any>; transition: string; music_section: string; events: Event[];
};

export const TL = data as unknown as { meta: { width: number; height: number; fps: number; duration: number }; beats: Beat[] };
export const META = TL.meta;
export const BEAT: Record<string, Beat> = Object.fromEntries(TL.beats.map((b) => [b.id, b]));
const EV: Record<string, number> = Object.fromEntries(TL.beats.flatMap((b) => b.events.map((e) => [e.id, e.t])));

export function E(id: string): number {
  if (!(id in EV)) throw new Error('unknown event ' + id);
  return EV[id];
}
