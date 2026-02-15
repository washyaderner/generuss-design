/**
 * animations.js — Pure, reusable GSAP animation functions.
 * Each accepts a CSS selector and options object.
 * Each removes .gsap-hidden from targets before animating.
 */

import { gsap } from "gsap";

/**
 * Fade up from y offset to 0
 */
export function fadeUp(selector, options = {}) {
  const {
    y = 40,
    duration = 1,
    stagger = 0.1,
    ease = "power4.out",
    delay = 0,
    scrollTrigger = null,
  } = options;

  const elements = document.querySelectorAll(selector);
  if (!elements.length) return null;

  elements.forEach((el) => el.classList.remove("gsap-hidden"));

  return gsap.from(selector, {
    y,
    opacity: 0,
    duration,
    stagger,
    ease,
    delay,
    scrollTrigger,
  });
}

/**
 * Text reveal — clip-path or split text effect
 */
export function textReveal(selector, options = {}) {
  const {
    duration = 1.2,
    ease = "power4.out",
    delay = 0,
    scrollTrigger = null,
  } = options;

  const elements = document.querySelectorAll(selector);
  if (!elements.length) return null;

  elements.forEach((el) => el.classList.remove("gsap-hidden"));

  return gsap.from(selector, {
    y: 60,
    opacity: 0,
    duration,
    ease,
    delay,
    scrollTrigger,
  });
}

/**
 * Float geometric shapes with continuous yoyo animation
 */
export function floatShapes(selector, options = {}) {
  const {
    yRange = 20,
    xRange = 10,
    rotationRange = 15,
    duration = 4,
    stagger = 0.5,
  } = options;

  const elements = document.querySelectorAll(selector);
  if (!elements.length) return null;

  elements.forEach((el, i) => {
    gsap.to(el, {
      y: `random(-${yRange}, ${yRange})`,
      x: `random(-${xRange}, ${xRange})`,
      rotation: `random(-${rotationRange}, ${rotationRange})`,
      duration: duration + i * 0.5,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
  });
}

/**
 * Horizontal curtain wipe reveal via clip-path
 */
export function curtainWipe(selector, options = {}) {
  const {
    direction = "left-to-right",
    duration = 1,
    ease = "power3.inOut",
    scrollTrigger = null,
  } = options;

  const elements = document.querySelectorAll(selector);
  if (!elements.length) return null;

  elements.forEach((el) => el.classList.remove("gsap-hidden"));

  const from =
    direction === "left-to-right" ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)";
  const to = "inset(0 0% 0 0)";

  return gsap.fromTo(
    selector,
    { clipPath: from },
    {
      clipPath: to,
      duration,
      ease,
      scrollTrigger,
    },
  );
}

/**
 * Slide in text from off-screen (for oversized headers)
 */
export function slideInText(selector, options = {}) {
  const {
    from = "left",
    duration = 0.5,
    ease = "power4.out",
    scrollTrigger = null,
  } = options;

  const elements = document.querySelectorAll(selector);
  if (!elements.length) return null;

  elements.forEach((el) => el.classList.remove("gsap-hidden"));

  const xFrom = from === "left" ? -window.innerWidth : window.innerWidth;

  return gsap.from(selector, {
    x: xFrom,
    duration,
    ease,
    force3D: true,
    scrollTrigger,
  });
}

/**
 * Magnetic assemble — cards fly from scattered positions to grid
 */
export function magneticAssemble(selector, options = {}) {
  const {
    spread = 1,
    duration = 1.4,
    stagger = 0.07,
    ease = "elastic.out(1, 0.55)",
    scrollTrigger = null,
  } = options;

  const elements = document.querySelectorAll(selector);
  if (!elements.length) return null;

  elements.forEach((el) => el.classList.remove("gsap-hidden"));

  return gsap.from(selector, {
    x: () => `random(${-300 * spread}, ${300 * spread})`,
    y: () => `random(${-400 * spread}, ${400 * spread})`,
    rotation: () => `random(-45, 45)`,
    scale: () => 0.3 + Math.random() * 0.15,
    opacity: 0,
    duration,
    stagger,
    ease,
    scrollTrigger,
  });
}

/**
 * Glow pulse — subtle accent glow cycle
 */
export function glowPulse(selector, options = {}) {
  const { duration = 2.5 } = options;

  const elements = document.querySelectorAll(selector);
  if (!elements.length) return null;

  return gsap.to(selector, {
    textShadow:
      "0 0 10px var(--color-accent-glow), 0 0 40px var(--color-accent-mid), 0 0 80px var(--color-accent-dim)",
    duration: duration / 2,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
  });
}
