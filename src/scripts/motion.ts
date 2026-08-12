/**
 * Scroll-reveal + stat count-up.
 *
 * Both effects are one-shot (observer disconnects after firing) and both fall
 * back to the finished state instantly when the visitor prefers reduced motion.
 */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const REVEALED = 'is-revealed';
const SETTLED = 'is-settled';

/** Longest possible reveal: max stagger delay + transition duration. */
const SETTLE_AFTER = 1500;

function initReveals() {
  const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!targets.length) return;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add(REVEALED, SETTLED));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        el.classList.add(REVEALED);
        // Release the element from the reveal rules once it has landed, so its
        // own hover transform is free to apply.
        window.setTimeout(() => el.classList.add(SETTLED), SETTLE_AFTER);
        observer.unobserve(el);
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
  );

  targets.forEach((el) => observer.observe(el));
}

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

function initCounters() {
  const counters = document.querySelectorAll<HTMLElement>('[data-count-to]');
  if (!counters.length) return;

  // Markup ships the final value, so reduced-motion (and no-JS) already shows
  // the right number — nothing to do.
  if (prefersReducedMotion || !('IntersectionObserver' in window)) return;

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
}

function init() {
  initReveals();
  initCounters();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
