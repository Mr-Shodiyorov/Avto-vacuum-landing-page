'use client';

/**
 * Scroll-reveal, stat count-up, and the auto-hide header.
 *
 * The reveal/count-up effects are one-shot (each element is unobserved after
 * firing) and, along with the header hide/show, fall back to the finished/
 * static state instantly when the visitor prefers reduced motion. Renders
 * nothing — it only drives classes/text on markup the server already sent,
 * so the page is complete without it.
 */

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const REVEALED = 'is-revealed';
const SETTLED = 'is-settled';
const HEADER_HIDDEN = 'is-header-hidden';

/** Ignore scroll jitter under this many px (mobile momentum scroll, bounce). */
const HEADER_SCROLL_THRESHOLD = 10;

/** Longest possible reveal: max stagger delay + transition duration. */
const SETTLE_AFTER = 1500;

/** 5000 -> "5 000" (thin-space grouping matching the design). */
function group(value: number) {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function runCount(el: HTMLElement, target: number, separated: boolean) {
  const duration = 1400;
  const start = performance.now();

  const tick = (now: number) => {
    const progress = Math.min((now - start) / duration, 1);
    // easeOutCubic — fast start, gentle landing on the final number.
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(target * eased);
    el.textContent = separated ? group(value) : String(value);
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

export default function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const observers: IntersectionObserver[] = [];
    const timeouts: number[] = [];

    const reveals = document.querySelectorAll<HTMLElement>('[data-reveal]');
    if (reveals.length) {
      if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        reveals.forEach((el) => el.classList.add(REVEALED, SETTLED));
      } else {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              const el = entry.target as HTMLElement;
              el.classList.add(REVEALED);
              // Release the element from the reveal rules once it has landed, so
              // its own hover transform is free to apply.
              timeouts.push(window.setTimeout(() => el.classList.add(SETTLED), SETTLE_AFTER));
              observer.unobserve(el);
            });
          },
          { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
        );
        reveals.forEach((el) => observer.observe(el));
        observers.push(observer);
      }
    }

    // Auto-hide header: slides up out of view on scroll-down, slides back on
    // scroll-up, and is always shown at the very top. Skipped entirely under
    // reduced motion — a nav bar disappearing/reappearing is itself the kind
    // of motion that setting asks to avoid, so it just stays put (sticky).
    const header = document.querySelector<HTMLElement>('.site-header');
    let removeScrollListener: (() => void) | undefined;
    if (header && !prefersReducedMotion) {
      let lastY = window.scrollY;
      let ticking = false;

      const applyScroll = () => {
        const currentY = window.scrollY;
        if (currentY <= 0) {
          header.classList.remove(HEADER_HIDDEN);
          lastY = currentY;
        } else if (currentY > lastY + HEADER_SCROLL_THRESHOLD) {
          header.classList.add(HEADER_HIDDEN);
          lastY = currentY;
        } else if (currentY < lastY - HEADER_SCROLL_THRESHOLD) {
          header.classList.remove(HEADER_HIDDEN);
          lastY = currentY;
        }
        ticking = false;
      };

      const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(applyScroll);
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      removeScrollListener = () => window.removeEventListener('scroll', onScroll);
    }

    const counters = document.querySelectorAll<HTMLElement>('[data-count-to]');
    // Markup ships the final value, so reduced-motion (and no-JS) already shows
    // the right number — nothing to do.
    if (counters.length && !prefersReducedMotion && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target as HTMLElement;
            const target = Number(el.dataset.countTo);
            if (Number.isFinite(target)) {
              runCount(el, target, el.dataset.countSep === 'true');
            }
            observer.unobserve(el);
          });
        },
        { threshold: 0.4 },
      );
      counters.forEach((el) => {
        el.textContent = '0';
        observer.observe(el);
      });
      observers.push(observer);
    }

    return () => {
      observers.forEach((observer) => observer.disconnect());
      timeouts.forEach((id) => window.clearTimeout(id));
      removeScrollListener?.();
    };
  }, [pathname]);

  return null;
}
