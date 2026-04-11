/**
 * smooth-scroll.js - Lenis smooth scrolling with GSAP ScrollTrigger bridge.
 * Disabled automatically on prefers-reduced-motion.
 */

import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenis = null;

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

if (!prefersReducedMotion) {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    touchMultiplier: 2,
    syncTouch: true,
  });

  // Bridge Lenis to GSAP ScrollTrigger
  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // Intercept anchor clicks and route through Lenis for smooth scroll
  // Catches both "#section" and "/#section" patterns
  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"], a[href^="/#"]');
    if (!link) return;

    const href = link.getAttribute("href");
    const hash = href.startsWith("/#") ? href.slice(1) : href;
    const target = document.querySelector(hash);
    if (!target) return;

    e.preventDefault();
    lenis.scrollTo(target, {
      duration: 1.8,
      easing: (t) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
      offset: -20,
    });
  });

  // Refresh ScrollTrigger after Lenis fully measures the page
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      ScrollTrigger.refresh(true);
    });
  });
}

export default lenis;
