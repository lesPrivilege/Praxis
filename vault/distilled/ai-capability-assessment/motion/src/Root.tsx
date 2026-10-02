import { Composition, Still } from 'remotion';
import { META } from './timeline';
import { Film } from './Film';
import { ContactSheet, sheetSize } from './ContactSheet';

export function Root() {
  return (
    <>
      <Composition id="Film" component={Film} durationInFrames={META.duration * META.fps} fps={META.fps} width={META.width} height={META.height} />
      <Still id="ContactSheet" component={ContactSheet} {...sheetSize()} />
    </>
  );
}
