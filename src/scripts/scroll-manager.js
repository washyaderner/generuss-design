/**
 * scroll-manager.js - ScrollTrigger orchestrator.
 * Imports animation functions and wires them to correct selectors.
 * Uses matchMedia for responsive breakpoints.
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ ease: "power3.out", duration: 0.8 });

import { fadeUp, initLavaLamp, glowPulse } from "./animations.js";

function init() {
  ScrollTrigger.matchMedia({
    "(min-width: 1024px)": () => setupAnimations("desktop"),
    "(min-width: 640px) and (max-width: 1023px)": () =>
      setupAnimations("tablet"),
    "(max-width: 639px)": () => setupAnimations("mobile"),
  });
}

function setupAnimations(breakpoint) {
  const isMobile = breakpoint === "mobile";

  setupHero(isMobile);
  setupPortfolio(isMobile);
  setupProblemSolution(isMobile);
  setupServices(isMobile);
  setupReviews();
  setupAbout();
  setupBooking(isMobile);

  // Recalculate all trigger positions after pins shift the layout
  ScrollTrigger.refresh();

  // Secondary refresh after Lenis settles - pinned sections can skew
  // trigger positions on the first calculation pass
  setTimeout(() => ScrollTrigger.refresh(true), 200);
}

// ── Text splitting utility ──
// Splits into characters grouped by words so word-wrap still works on mobile
function splitChars(el) {
  const text = el.textContent;
  el.textContent = "";
  el.setAttribute("aria-label", text);
  const chars = [];
  const words = text.split(/(\s+)/);

  words.forEach((segment) => {
    if (/^\s+$/.test(segment)) {
      // Preserve regular spaces for natural word wrapping
      el.appendChild(document.createTextNode(" "));
      return;
    }
    // Wrap each word in an inline-block container so characters stay together
    const wordWrap = document.createElement("span");
    wordWrap.style.display = "inline-block";
    wordWrap.style.whiteSpace = "nowrap";
    wordWrap.setAttribute("aria-hidden", "true");

    for (const char of segment) {
      const span = document.createElement("span");
      span.textContent = char;
      span.style.display = "inline-block";
      span.style.willChange = "transform, opacity, filter";
      wordWrap.appendChild(span);
      chars.push(span);
    }
    el.appendChild(wordWrap);
  });

  return chars;
}

// ── S1: Hero ──
// Hero text + image are visible from first paint via CSS .hero-enter classes (no JS gating).
// This function only initializes the ambient lava lamp + scroll indicator hide-on-scroll.
function setupHero(isMobile) {
  const heroSection = document.querySelector("#hero");
  if (!heroSection) return;

  // Lava lamp - now strictly ambient texture (lower opacity, slower fade-in)
  const lavaContainer = heroSection.querySelector("#lava-lamp");
  if (lavaContainer) {
    gsap.set(lavaContainer, { opacity: 0 });
    gsap.to(lavaContainer, {
      opacity: isMobile ? 0.025 : 0.035,
      duration: 1.5,
      ease: "power2.out",
    });
    try {
      initLavaLamp(
        "#lava-lamp",
        isMobile ? { mobile: true, count: 4 } : { count: 8 },
      );
    } catch (e) {
      console.warn("Lava lamp init failed:", e);
    }
  }

  // Scroll indicator - auto-hide after 3s or on first scroll
  const indicator = heroSection.querySelector(".scroll-indicator");
  if (indicator) {
    const hideIndicator = () => {
      gsap.to(indicator, { opacity: 0, duration: 0.5, ease: "power2.inOut" });
      window.removeEventListener("scroll", hideIndicator);
    };
    window.addEventListener("scroll", hideIndicator, { once: true });
    gsap.delayedCall(3, hideIndicator);
  }
}

// ── S3: Services ──
function setupServices(isMobile) {
  const cards = document.querySelectorAll("#services .neu-raised");
  if (!cards.length) return;

  cards.forEach((card) => {
    fadeUp(card, {
      y: 30,
      scrollTrigger: { trigger: card, start: "top 85%" },
    });
  });

  // Pharallax card link
  const pharallaxCard = document.querySelector(".pharallax-card");
  if (pharallaxCard) {
    fadeUp(pharallaxCard, {
      y: 30,
      scrollTrigger: { trigger: pharallaxCard, start: "top 85%" },
    });
  }
}

// ── S7: Booking + Contact ──
function setupBooking(isMobile) {
  fadeUp(".booking-heading", {
    scrollTrigger: { trigger: ".booking-heading", start: "top 80%" },
  });

  fadeUp(".booking-sub", {
    scrollTrigger: { trigger: ".booking-sub", start: "top 80%" },
    delay: 0.1,
  });

  // Calendar embed fades in
  fadeUp(".cal-embed-wrapper", {
    scrollTrigger: { trigger: ".cal-embed-wrapper", start: "top 85%" },
    delay: 0.2,
  });

  // Form fades in
  const form = document.querySelector(".contact-form");
  if (form) {
    form.classList.remove("gsap-hidden");
    gsap.from(form, {
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      delay: 0.3,
      scrollTrigger: { trigger: form, start: "top 85%" },
    });
  }

  // Glow pulse on accent word
  glowPulse(".glow-pulse-target");
}

// ── S2: Portfolio ──
function setupPortfolio(isMobile) {
  fadeUp(".portfolio-heading", {
    y: 20,
    scrollTrigger: { trigger: ".portfolio-heading", start: "top 85%" },
  });

  // Staggered card reveals: slide up + slight scale, NO opacity gating.
  // (opacity:0 from gsap.from would hide cards from screenshot/QA tools before scroll.)
  document.querySelectorAll(".portfolio-card").forEach((card, i) => {
    card.classList.remove("gsap-hidden");

    gsap.from(card, {
      y: isMobile ? 30 : 50,
      scale: 0.96,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: card,
        start: isMobile ? "top 92%" : "top 85%",
        end: "top 50%",
        toggleActions: "play none none reverse",
      },
    });
  });
}

// ── S5: Problem/Solution ──
// Problem/Solution: section is now a static grid (was previously a pinned scroll experience).
// Cards reveal via the global IntersectionObserver fallback. No GSAP needed.
function setupProblemSolution(isMobile) {
  void isMobile;
  return;
}

// About: rebuilt to inline layout (headshot + bio + stats in one card).
// Only photo + stats classes remain; bio/heading/cta now use IO-driven reveals.
function setupAbout() {
  fadeUp(".about-photo", {
    scrollTrigger: { trigger: ".about-photo", start: "top 80%" },
  });
  fadeUp(".about-stats", {
    scrollTrigger: { trigger: ".about-stats", start: "top 90%" },
    delay: 0.2,
  });
}

// ── S4: Reviews ──
function setupReviews() {
  fadeUp(".reviews-heading", {
    scrollTrigger: { trigger: ".reviews-heading", start: "top 80%" },
  });

  // Scribble-out X on "filler" - draw paths after heading fades in
  const scribblePaths = document.querySelectorAll(
    ".scribble-out .scribble-x path",
  );
  if (scribblePaths.length) {
    scribblePaths.forEach((path) => {
      const len = path.getTotalLength();
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    });

    gsap.to(scribblePaths, {
      strokeDashoffset: 0,
      duration: 0.4,
      stagger: 0.08,
      ease: "power2.inOut",
      delay: 1.2,
      scrollTrigger: { trigger: ".reviews-heading", start: "top 80%" },
    });
  }

  // Stagger reviews with alternating horizontal slides
  document.querySelectorAll(".review-item").forEach((item, i) => {
    item.classList.remove("gsap-hidden");

    const xOffset = i % 2 === 0 ? -30 : 30;

    gsap.from(item, {
      x: xOffset,
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: { trigger: item, start: "top 85%" },
    });
  });

  fadeUp(".reviews-cta", {
    scrollTrigger: { trigger: ".reviews-cta", start: "top 90%" },
  });
}

// Initialize - respect prefers-reduced-motion
function start() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (prefersReducedMotion) {
    // Show all hidden elements without animation
    document.querySelectorAll(".gsap-hidden").forEach((el) => {
      el.classList.remove("gsap-hidden");
    });
    return;
  }
  init();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start);
} else {
  start();
}

// ── Fallback: IntersectionObserver reveal ──
// ScrollTrigger can miscalculate positions when Lenis + pinned sections
// are combined. This ensures no element stays permanently invisible.
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.classList.remove("gsap-hidden");
        el.style.opacity = "1";
        el.style.visibility = "visible";
        revealObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.05, rootMargin: "50px 0px" },
);

// Observe all gsap-hidden elements after a brief delay
// to let ScrollTrigger handle them first when it can
setTimeout(() => {
  document.querySelectorAll(".gsap-hidden").forEach((el) => {
    revealObserver.observe(el);
  });
}, 500);
