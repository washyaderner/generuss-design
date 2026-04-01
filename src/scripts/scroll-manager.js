/**
 * scroll-manager.js - ScrollTrigger orchestrator.
 * Imports animation functions and wires them to correct selectors.
 * Uses matchMedia for responsive breakpoints.
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
  setupServices(isMobile);
  setupReviews();
  setupProblemSolution(isMobile);
  setupAbout();
  setupBooking(isMobile);

  // Recalculate all trigger positions after pins shift the layout
  ScrollTrigger.refresh();
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
      opacity: isMobile ? 0.05 : 0.07,
      duration: 1.2,
      ease: "power2.out",
    });
    try {
      initLavaLamp("#lava-lamp", isMobile ? { mobile: true } : {});
    } catch (e) {
      console.warn("Lava lamp init failed:", e);
    }
  }

  const headlines = heroSection.querySelectorAll(".hero-headline");
  if (headlines.length) {
    tl.from(headlines, { opacity: 0.01, duration: 0.1, stagger: 0.05 });
    tl.from(
      headlines,
      { y: 40, duration: 0.8, stagger: 0.05, ease: "power4.out" },
      "<",
    );
  }

  const sub = heroSection.querySelector(".hero-sub");
  if (sub) {
    tl.from(sub, { opacity: 0.01, duration: 0.1 }, "-=0.5");
    tl.from(sub, { y: 30, duration: 0.7, ease: "power4.out" }, "<");
  }

  const cta = heroSection.querySelector(".hero-cta");
  if (cta) {
    tl.from(cta, { opacity: 0.01, duration: 0.1 }, "-=0.4");
    tl.from(cta, { y: 20, duration: 0.6, ease: "power4.out" }, "<");
  }

  const indicator = heroSection.querySelector(".scroll-indicator");
  if (indicator) {
    tl.from(indicator, { opacity: 0.01, duration: 0.1 }, "-=0.2");
    tl.from(indicator, { y: 10, duration: 0.5, ease: "power2.out" }, "<");
  }
}

// ── S3: Services ──
// No GSAP animations - section is fully static. All content visible on load.
// Previous pin + fadeUp approach consistently left the Pharallax card invisible.
function setupServices(isMobile) {}

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

  // Light pin on booking section so the calendar sticks briefly
  if (!isMobile) {
    ScrollTrigger.create({
      trigger: "#booking",
      start: "top top",
      end: "+=60%",
      pin: true,
    });
  }

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

  // Each card fades up from a subtle offset with a soft shadow bloom
  document.querySelectorAll(".portfolio-card").forEach((card) => {
    card.classList.remove("gsap-hidden");

    gsap.from(card, {
      y: 30,
      opacity: 0,
      scale: 0.97,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: card,
        start: "top 90%",
        end: "top 60%",
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

  fadeUp(".about-cta", {
    scrollTrigger: { trigger: ".about-cta", start: "top 90%" },
    delay: 0.3,
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

  // Stagger reviews, stars 0.05s ahead
  document.querySelectorAll(".review-item").forEach((item) => {
    item.classList.remove("gsap-hidden");

    const stars = item.querySelector(".review-stars");
    const rest = [
      item.querySelector("blockquote"),
      item.querySelector("p:last-child"),
    ].filter(Boolean);

    if (stars) {
      gsap.from(stars, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power4.out",
        scrollTrigger: { trigger: item, start: "top 85%" },
      });
    }

    if (rest.length) {
      gsap.from(rest, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power4.out",
        delay: 0.05,
        scrollTrigger: { trigger: item, start: "top 85%" },
      });
    }
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
