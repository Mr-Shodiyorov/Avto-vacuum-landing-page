'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import './preloader.css';

/**
 * Cinematic first-load overlay. See preloader.css for the concept.
 *
 * The sequence itself is entirely CSS, and finishes on its own with no client
 * JS — important, because this overlay covers the whole page and must never be
 * able to strand a visitor whose JS failed. This component only refines it:
 *
 *   1. holds the exit while the document is genuinely still loading,
 *   2. locks scrolling for the duration,
 *   3. unmounts the overlay once it is done, so nothing is left in the DOM.
 *
 * Deliberately no "fake progress" bar: the timeline is a fixed piece of
 * choreography, and pretending to measure something would be dishonest about
 * a page that is prerendered and usually ready almost immediately.
 */

/** Longest we will hold the exit waiting for `load` before going anyway. */
const MAX_HOLD_MS = 3500;

/** Backstop unmount, in case no animationend ever arrives. */
const HARD_STOP_MS = 8000;

const LOCK_CLASS = 'is-preloading';

export default function Preloader() {
  const pathname = usePathname();
  // The admin panel is a workday tool for the site owner, not a visitor's
  // first impression — a 2.5s cinematic intro every time you check on a
  // booking would be friction, not delight. It also already sets its own
  // `force-dynamic` rendering, which this component has no bearing on.
  const isAdmin = pathname?.startsWith('/admin') ?? false;

  const [done, setDone] = useState(isAdmin);

  useEffect(() => {
    if (isAdmin) return;

    const root = document.documentElement;
    const overlay = document.querySelector<HTMLElement>('.preloader');
    const timers: number[] = [];

    // Scroll lock. Paired with `scrollbar-gutter: stable` in global.css so
    // removing the scrollbar cannot shift the layout sideways.
    root.classList.add(LOCK_CLASS);

    const finish = () => {
      root.classList.remove(LOCK_CLASS);
      setDone(true);
    };

    // Hold the exit only if the page really is still loading. A prerendered
    // page is normally complete well before the 2s mark, in which case this
    // never runs and nobody is made to wait for the sake of it.
    if (overlay && document.readyState !== 'complete') {
      overlay.classList.add('is-holding');

      const release = () => overlay.classList.remove('is-holding');
      window.addEventListener('load', release, { once: true });
      timers.push(window.setTimeout(release, MAX_HOLD_MS));
    }

    // The iris animation ending is the real signal that the overlay has
    // finished; `preloaderFadeOut` is its reduced-motion counterpart.
    const onEnd = (event: AnimationEvent) => {
      if (event.animationName === 'preloaderIris' || event.animationName === 'preloaderFadeOut') {
        finish();
      }
    };
    overlay?.addEventListener('animationend', onEnd);

    /**
     * The backstop only starts counting once the tab is actually on screen.
     *
     * Chrome freezes CSS animations and rAF in a background tab — verified
     * here: `document.timeline.currentTime` sits at 0 and never advances. A
     * plain timer would therefore expire while the sequence was still frozen at
     * frame one, and someone who opened the site in a background tab would
     * switch to it and find the intro already thrown away. Deferring the
     * countdown lets the animation start when they actually look.
     */
    let armed = false;
    const armHardStop = () => {
      if (armed) return;
      armed = true;
      timers.push(window.setTimeout(finish, HARD_STOP_MS));
    };

    const onVisibility = () => {
      if (document.visibilityState === 'visible') armHardStop();
    };

    if (document.visibilityState === 'visible') {
      armHardStop();
    } else {
      document.addEventListener('visibilitychange', onVisibility);
    }

    return () => {
      overlay?.removeEventListener('animationend', onEnd);
      document.removeEventListener('visibilitychange', onVisibility);
      timers.forEach((id) => window.clearTimeout(id));
      root.classList.remove(LOCK_CLASS);
    };
    // `isAdmin` in the deps: if a client-side <Link> ever crosses between an
    // admin route and a public one, this re-runs cleanup and either skips or
    // starts the sequence correctly instead of running stale.
  }, [isAdmin]);

  if (done) return null;

  return (
    // aria-hidden with nothing focusable inside: a screen reader gets the real
    // page rather than an announcement about a decorative overlay, and there is
    // nothing here for the keyboard to get caught on.
    <div className="preloader" aria-hidden="true">
      <div className="preloader__stage">
        <span className="preloader__glow" />
        <span className="preloader__mark">
          <span className="preloader__ring" />
          <span className="preloader__core">AV</span>
        </span>
        <span className="preloader__brand">
          <span className="preloader__name">Avto Vakum</span>
          <span className="preloader__meta">Qarshi · 24/7</span>
        </span>
      </div>
    </div>
  );
}
