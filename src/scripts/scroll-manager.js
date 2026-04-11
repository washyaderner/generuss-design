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
function setupHero(isMobile) {
  const heroSection = document.querySelector("#hero");
  if (!heroSection) return;

  const tl = gsap.timeline({ delay: 0 });

  // Lava lamp fade-in - separate so text fires immediately
  const lavaContainer = heroSection.querySelector("#lava-lamp");
  if (lavaContainer) {
    gsap.set(lavaContainer, { opacity: 0 });
    gsap.to(lavaContainer, {
      opacity: isMobile ? 0.04 : 0.05,
      duration: 1.2,
      ease: "power2.out",
    });
    try {
      initLavaLamp(
        "#lava-lamp",
        isMobile ? { mobile: true, count: 5 } : { count: 12 },
      );
    } catch (e) {
      console.warn("Lava lamp init failed:", e);
    }
  }

  // Split-text character animation for headlines
  const headlines = heroSection.querySelectorAll(".hero-headline");
  if (headlines.length) {
    const allChars = [];
    headlines.forEach((hl) => {
      hl.classList.remove("gsap-hidden");
      const chars = splitChars(hl);
      allChars.push(chars);
    });

    // Line 1: "YOUR BUSINESS OUTGREW" - character cascade
    if (allChars[0]) {
      tl.from(allChars[0], {
        y: 60,
        opacity: 0,
        rotateX: -90,
        filter: "blur(4px)",
        stagger: 0.02,
        duration: 0.8,
        ease: "power4.out",
      });
    }

    // Line 2: "YOUR WEBSITE" - character cascade with slight delay
    if (allChars[1]) {
      tl.from(
        allChars[1],
        {
          y: 60,
          opacity: 0,
          rotateX: -90,
          filter: "blur(4px)",
          stagger: 0.02,
          duration: 0.8,
          ease: "power4.out",
        },
        "-=0.5",
      );
    }

    // Line 3: "I BUILD WHAT'S NEXT." - clip-path reveal
    if (allChars[2]) {
      const line3 = headlines[2];
      tl.fromTo(
        line3,
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 0.8,
          ease: "power3.inOut",
        },
        "-=0.3",
      );
    }
  }

  const sub = heroSection.querySelector(".hero-sub");
  if (sub) {
    tl.from(
      sub,
      { opacity: 0, y: 30, duration: 0.7, ease: "power4.out" },
      "-=0.3",
    );
  }

  const cta = heroSection.querySelector(".hero-cta");
  if (cta) {
    tl.from(
      cta,
      { opacity: 0, y: 20, duration: 0.6, ease: "power4.out" },
      "-=0.3",
    );
  }

  // Scroll indicator - auto-hide after 3s or on first scroll
  const indicator = heroSection.querySelector(".scroll-indicator");
  if (indicator) {
    tl.from(
      indicator,
      { opacity: 0, y: 10, duration: 0.5, ease: "power2.out" },
      "-=0.2",
    );

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

  // Staggered card reveals with shadow bloom
  document.querySelectorAll(".portfolio-card").forEach((card, i) => {
    card.classList.remove("gsap-hidden");

    gsap.from(card, {
      y: isMobile ? 30 : 50,
      opacity: 0,
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
function setupProblemSolution(isMobile) {
  const section = document.querySelector("#problem-solution");
  if (!section) return;

  // Cool entrance for real heading
  const real = section.querySelector(".ps-real");
  if (real) {
    real.classList.remove("gsap-hidden");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".ps-intro",
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });

    // Scale up from slightly smaller
    tl.from(real, {
      scale: 0.85,
      opacity: 0,
      duration: 1.2,
      ease: "power4.out",
    });

    // Accent glow pulse after entrance settles
    const accents = real.querySelectorAll(".text-accent");
    if (accents.length) {
      tl.fromTo(
        accents,
        { textShadow: "0 0 0px rgba(0,255,239,0)" },
        {
          textShadow:
            "0 0 20px rgba(0,255,239,0.6), 0 0 40px rgba(0,255,239,0.3)",
          duration: 0.5,
          ease: "power2.in",
        },
        "-=0.3",
      );
      tl.to(accents, {
        textShadow: "0 0 0px rgba(0,255,239,0)",
        duration: 0.8,
        ease: "power2.out",
      });
    }
  }

  // Pin the grid
  const pinSection = section.querySelector(".ps-pin");
  if (pinSection) {
    const solutions = section.querySelectorAll(".ps-solution");
    const problems = section.querySelectorAll(".ps-problem");

    if (isMobile) {
      // Mobile: no pin - reveal each solution as its row scrolls into view
      solutions.forEach((sol, i) => {
        sol.classList.remove("gsap-hidden");
        sol.style.clipPath = "inset(0 100% 0 0)";
        sol.style.opacity = "0";

        const row = sol.closest(".ps-row");
        ScrollTrigger.create({
          trigger: row,
          start: "top 75%",
          end: "top 35%",
          scrub: 0.5,
          onUpdate: (self) => {
            const p = self.progress;
            if (p >= 1) {
              sol.style.clipPath = "none";
              sol.style.boxShadow = "";
            } else {
              const clipRight = 100 - p * 100;
              sol.style.clipPath = `inset(0 ${clipRight}% 0 0 round 1rem)`;
              if (p >= 0.5) {
                sol.style.boxShadow = "";
              } else {
                const s = p / 0.5;
                sol.style.boxShadow = `${s * 4}px ${s * 4}px ${s * 12}px rgba(0,0,0,${s * 0.8}), ${s * -2}px ${s * -2}px ${s * 8}px rgba(255,255,255,${s * 0.05})`;
              }
            }
            sol.style.opacity = p > 0.3 ? "1" : `${p / 0.3}`;

            if (problems[i]) {
              problems[i].style.opacity = 0.85 + p * 0.15;
            }
          },
        });
      });
    } else {
      // Desktop/tablet: pinned curtain wipe
      // Cards animate during 0-0.6, hold 0.6-0.88, fade 0.88-1.0
      const cardEnd = 0.6;
      const fadeStart = 0.92;

      ScrollTrigger.create({
        trigger: ".ps-pin",
        start: "top 5%",
        end: "+=350%",
        pin: true,
        scrub: 0.3,
        onUpdate: (self) => {
          const progress = self.progress;
          const count = solutions.length;

          solutions.forEach((sol, i) => {
            // Map card animations into 0 - cardEnd range
            const start = (i / count) * cardEnd;
            const end = ((i + 1) / count) * cardEnd;
            const localProgress = Math.max(
              0,
              Math.min(1, (progress - start) / (end - start)),
            );

            if (localProgress > 0) {
              sol.classList.remove("gsap-hidden");
              if (localProgress >= 1) {
                sol.style.clipPath = "none";
                sol.style.boxShadow = "";
              } else {
                const clipRight = 100 - localProgress * 100;
                sol.style.clipPath = `inset(0 ${clipRight}% 0 0 round 1rem)`;
                if (localProgress >= 0.5) {
                  sol.style.boxShadow = "";
                } else {
                  const s = localProgress / 0.5;
                  sol.style.boxShadow = `${s * 8}px ${s * 8}px ${s * 20}px rgba(0,0,0,${s * 0.8}), ${s * -4}px ${s * -4}px ${s * 12}px rgba(255,255,255,${s * 0.06})`;
                }
              }
              sol.style.opacity =
                localProgress > 0.3 ? "1" : `${localProgress / 0.3}`;

              if (problems[i]) {
                problems[i].style.opacity = 0.85 + localProgress * 0.15;
              }
            }
          });

          // Fade out entire pinned section during last 8%
          if (progress > fadeStart) {
            const fadeProgress = (progress - fadeStart) / (1 - fadeStart);
            pinSection.style.opacity = String(1 - fadeProgress);
          } else {
            pinSection.style.opacity = "1";
          }
        },
        onLeave: () => {
          // Force all cards to fully-revealed state
          solutions.forEach((sol) => {
            sol.classList.remove("gsap-hidden");
            sol.style.clipPath = "none";
            sol.style.boxShadow = "";
            sol.style.opacity = "1";
          });
          problems.forEach((prob) => {
            prob.style.opacity = "1";
          });
        },
        onLeaveBack: () => {
          // Reset all cards to hidden state
          solutions.forEach((sol) => {
            sol.classList.add("gsap-hidden");
            sol.style.clipPath = "inset(0 100% 0 0 round 1rem)";
            sol.style.boxShadow = "none";
            sol.style.opacity = "0";
          });
          problems.forEach((prob) => {
            prob.style.opacity = "0.85";
          });
        },
      });
    }
  }
}

// ── S6: About ──
function setupAbout() {
  fadeUp(".about-photo", {
    scrollTrigger: { trigger: ".about-photo", start: "top 80%" },
  });

  fadeUp(".about-heading", {
    scrollTrigger: { trigger: ".about-heading", start: "top 80%" },
    delay: 0.1,
  });

  fadeUp(".about-bio", {
    scrollTrigger: { trigger: ".about-bio", start: "top 80%" },
    delay: 0.2,
  });

  fadeUp(".about-stats", {
    scrollTrigger: { trigger: ".about-stats", start: "top 90%" },
    delay: 0.3,
  });

  fadeUp(".about-cta", {
    scrollTrigger: { trigger: ".about-cta", start: "top 90%" },
    delay: 0.4,
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
