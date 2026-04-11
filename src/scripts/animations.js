/**
 * animations.js - Pure, reusable GSAP animation functions.
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
 * Lava lamp effect - blobs rise from bottom pool, merge/separate via SVG goo filter
 */
export function initLavaLamp(containerSelector, options = {}) {
  const {
    mobile = false,
    count = mobile ? 8 : 18,
    sizeRange = mobile ? [40, 120] : [50, 180],
    hue = 176,
    satRange = [85, 100],
    lightRange = [30, 60],
    riseDuration = [8, 18],
    fallDuration = [5, 10],
    wobbleX = 80,
    scaleRange = [0.8, 1.2],
  } = options;

  const container = document.querySelector(containerSelector);
  if (!container) return null;

  const h = container.offsetHeight;
  if (h === 0) return null;

  const allEls = [];

  // Pool blob at bottom - blobs merge into/out of this
  const poolHeight = mobile ? 140 : 80;
  const pool = document.createElement("div");
  pool.style.cssText = `
    position: absolute;
    width: 120%;
    height: ${poolHeight}px;
    border-radius: 50%;
    background: hsl(176, 100%, 47%);
    bottom: -${poolHeight / 2}px;
    left: -10%;
    will-change: transform;
  `;
  container.appendChild(pool);
  allEls.push(pool);

  gsap.to(pool, {
    scaleX: 1.05,
    scaleY: 0.9,
    duration: 4,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
  });

  // Create rising blobs anchored at bottom
  const blobs = [];
  for (let i = 0; i < count; i++) {
    const blob = document.createElement("div");
    const size = gsap.utils.random(sizeRange[0], sizeRange[1]);
    const sat = gsap.utils.random(satRange[0], satRange[1]);
    const light = gsap.utils.random(lightRange[0], lightRange[1]);

    blob.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: hsl(${hue}, ${sat}%, ${light}%);
      bottom: ${gsap.utils.random(-5, mobile ? 3 : 10)}%;
      left: ${gsap.utils.random(10, 90)}%;
      ${mobile ? "" : "will-change: transform;"}
    `;

    // Inner highlight for spherical look - survives the goo filter
    const hlSize = size * 0.45;
    const hl = document.createElement("div");
    hl.style.cssText = `
      position: absolute;
      width: ${hlSize}px;
      height: ${hlSize}px;
      border-radius: 50%;
      background: hsl(${hue}, 100%, 55%);
      top: 15%;
      left: 18%;
    `;
    blob.appendChild(hl);
    allEls.push(hl);

    container.appendChild(blob);
    blobs.push(blob);
    allEls.push(blob);

    // Spread initial positions so some blobs are already floating on load
    gsap.set(blob, { y: gsap.utils.random(0, -h * 0.6) });
  }

  function animateBlob(blob) {
    // Rise phase - move upward
    gsap.to(blob, {
      y: gsap.utils.random(-h * 0.5, -h * 0.85),
      x: gsap.utils.random(-wobbleX, wobbleX),
      scale: gsap.utils.random(scaleRange[0], scaleRange[1]),
      duration: gsap.utils.random(riseDuration[0], riseDuration[1]),
      ease: "sine.inOut",
      onComplete: () => {
        // Fall phase - return to bottom pool
        gsap.to(blob, {
          y: gsap.utils.random(mobile ? 20 : 0, mobile ? 50 : 20),
          x: gsap.utils.random(-wobbleX * 0.3, wobbleX * 0.3),
          scale: gsap.utils.random(scaleRange[0], scaleRange[1]),
          duration: gsap.utils.random(fallDuration[0], fallDuration[1]),
          ease: "sine.inOut",
          onComplete: () => animateBlob(blob),
        });
      },
    });
  }

  blobs.forEach((blob) => animateBlob(blob));

  // A few extra blobs sit in the pool, then detach and rise after 1-4s
  const delayedCount = mobile ? 2 : 5;
  for (let i = 0; i < delayedCount; i++) {
    const blob = document.createElement("div");
    const size = gsap.utils.random(sizeRange[0], sizeRange[1]);
    const sat = gsap.utils.random(satRange[0], satRange[1]);
    const light = gsap.utils.random(lightRange[0], lightRange[1]);

    blob.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: hsl(${hue}, ${sat}%, ${light}%);
      bottom: ${gsap.utils.random(-5, mobile ? 3 : 10)}%;
      left: ${gsap.utils.random(15, 85)}%;
      ${mobile ? "" : "will-change: transform;"}
    `;

    const hlSize = size * 0.45;
    const hl = document.createElement("div");
    hl.style.cssText = `
      position: absolute;
      width: ${hlSize}px;
      height: ${hlSize}px;
      border-radius: 50%;
      background: hsl(${hue}, 100%, 55%);
      top: 15%;
      left: 18%;
    `;
    blob.appendChild(hl);
    allEls.push(hl);

    container.appendChild(blob);
    allEls.push(blob);

    gsap.delayedCall(gsap.utils.random(1, 4), () => animateBlob(blob));
  }

  return function cleanup() {
    allEls.forEach((el) => {
      gsap.killTweensOf(el);
      el.remove();
    });
  };
}

/**
 * Glow pulse - subtle accent glow cycle
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
