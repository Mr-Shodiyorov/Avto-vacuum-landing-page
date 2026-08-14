import { getTranslations } from 'next-intl/server';

import './marquee.css';

/**
 * How many times the keyword list is repeated across the track.
 *
 * The animation scrolls by exactly one copy and then restarts, so at the end of
 * a cycle the remaining `COPIES - 1` copies have to cover the whole viewport —
 * otherwise the strip runs out of words and leaves a blank stretch of blue.
 * One copy is roughly 1400px, so three of them cover ~4200px: comfortably wider
 * than any screen this will meet.
 */
const COPIES = 4;

export default async function Marquee() {
  const t = await getTranslations();
  // Decorative keyword strip. Marked aria-hidden — every term here is already
  // announced in the Services section.
  const keywords = t.raw('marquee') as string[];

  return (
    <div className="marquee" aria-hidden="true">
      <div
        className="marquee__track"
        // Handed to the keyframes so the scroll distance is always exactly one
        // copy. Changing COPIES alone can never desynchronise the two again.
        style={{ '--marquee-copies': COPIES } as React.CSSProperties}
      >
        {Array.from({ length: COPIES }, (_, group) => (
          <div className="marquee__group" key={group}>
            {keywords.map((word) => (
              <span className="marquee__item" key={word}>
                {word}
                <span className="marquee__sep">·</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
