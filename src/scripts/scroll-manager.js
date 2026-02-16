/**
 * scroll-manager.js — ScrollTrigger orchestrator.
 * Imports animation functions and wires them to correct selectors.
 * Uses matchMedia for responsive breakpoints.
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

import {
  fadeUp,
  floatShapes,
  magneticAssemble,
  glowPulse,
} from "./animations.js";

/**
 * Split an element's text content into individually animated character spans.
 * Spaces become non-breaking so inline-blocks stay visible.
 */
function splitTextToChars(el) {
  const text = el.textContent;
  el.textContent = "";
  const chars = [];
  for (const char of text) {
    const span = document.createElement("span");
    span.className = "shatter-char";
    span.textContent = char === " " ? "\u00A0" : char;
    el.appendChild(span);
    chars.push(span);
  }
  return chars;
}

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
  const isTablet = breakpoint === "tablet";

  setupHero(isMobile);
  setupProblemSolution(isMobile);
  setupPrinciples(isMobile, isTablet);
  setupServices();
  setupPortfolio(isMobile);
  setupAbout();
  setupWhyMe();
  setupReviews();
  setupContact();
}

// ── S1: Hero ──
function setupHero(isMobile) {
  const heroSection = document.querySelector("#hero");
  if (!heroSection) return;

  const tl = gsap.timeline({ delay: 0.3 });

  const shapes = heroSection.querySelectorAll(".hero-shape");
  if (shapes.length) {
    shapes.forEach((s) => s.classList.remove("gsap-hidden"));
    tl.from(shapes, {
      opacity: 0,
      scale: 0.8,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out",
    });
  }

  const headlines = heroSection.querySelectorAll(".hero-headline");
  if (headlines.length) {
    headlines.forEach((h) => h.classList.remove("gsap-hidden"));
    tl.from(
      headlines,
      { y: 40, opacity: 0, duration: 1, stagger: 0.15, ease: "power4.out" },
      "-=0.4",
    );
  }

  const sub = heroSection.querySelector(".hero-sub");
  if (sub) {
    sub.classList.remove("gsap-hidden");
    tl.from(
      sub,
      { y: 30, opacity: 0, duration: 0.8, ease: "power4.out" },
      "-=0.5",
    );
  }

  const cta = heroSection.querySelector(".hero-cta");
  if (cta) {
    cta.classList.remove("gsap-hidden");
    tl.from(
      cta,
      { y: 20, opacity: 0, duration: 0.8, ease: "power4.out" },
      "-=0.4",
    );
  }

  const indicator = heroSection.querySelector(".scroll-indicator");
  if (indicator) {
    indicator.classList.remove("gsap-hidden");
    tl.from(
      indicator,
      { opacity: 0, duration: 0.6, ease: "power2.out" },
      "-=0.2",
    );
  }

  if (!isMobile) {
    floatShapes(".hero-shape");
  }
}

// ── S2: Problem/Solution ──
function setupProblemSolution(isMobile) {
  const section = document.querySelector("#problem-solution");
  if (!section) return;

  // Joke shatter + real heading reveal
  const joke = section.querySelector(".ps-joke");
  const real = section.querySelector(".ps-real");
  if (joke && real) {
    const chars = splitTextToChars(joke);
    joke.classList.remove("gsap-hidden");
    real.classList.remove("gsap-hidden");

    const isSmall = window.innerWidth < 640;
    const rangeX = isSmall ? 300 : 600;
    const rangeY = isSmall ? 200 : 400;

    const tl = gsap.timeline({
      scrollTrigger: { trigger: ".ps-intro", start: "top 80%", once: true },
    });

    // 1. Joke fades in
    tl.from(joke, { y: 30, opacity: 0, duration: 0.8, ease: "power4.out" });
    // 2. Pause for reading
    tl.to({}, { duration: 0.6 });
    // 3. Shatter chars outward from center
    tl.to(chars, {
      x: () => gsap.utils.random(-rangeX, rangeX),
      y: () => gsap.utils.random(-rangeY, rangeY),
      rotation: () => gsap.utils.random(-180, 180),
      scale: () => gsap.utils.random(0.2, 1.5),
      opacity: 0,
      duration: 0.7,
      stagger: { amount: 0.3, from: "center" },
      ease: "power3.in",
    });
    // 4. Real heading fades in (overlaps shatter by 0.15s)
    tl.from(
      real,
      { y: 20, opacity: 0, duration: 0.8, ease: "power4.out" },
      "-=0.15",
    );
    // 5. Clean up joke element
    tl.call(() => joke.remove());
  }

  // Pin the grid
  const pinSection = section.querySelector(".ps-pin");
  if (pinSection) {
    const solutions = section.querySelectorAll(".ps-solution");
    const problems = section.querySelectorAll(".ps-problem");

    if (isMobile) {
      // Mobile: no pin — reveal each solution as its row scrolls into view
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
            } else {
              const clipRight = 100 - p * 100;
              sol.style.clipPath = `inset(0 ${clipRight}% 0 0)`;
            }
            sol.style.opacity = p > 0.3 ? "1" : `${p / 0.3}`;

            if (problems[i]) {
              problems[i].style.opacity = 0.5 + p * 0.5;
            }
          },
        });
      });
    } else {
      // Desktop/tablet: pinned curtain wipe
      ScrollTrigger.create({
        trigger: ".ps-pin",
        start: "top 5%",
        end: "+=300%",
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const count = solutions.length;

          solutions.forEach((sol, i) => {
            const start = i / count;
            const end = (i + 1) / count;
            const localProgress = Math.max(
              0,
              Math.min(1, (progress - start) / (end - start)),
            );

            if (localProgress > 0) {
              sol.classList.remove("gsap-hidden");
              if (localProgress >= 1) {
                // Fully revealed — remove clip-path so box-shadow renders
                sol.style.clipPath = "none";
              } else {
                const clipRight = 100 - localProgress * 100;
                sol.style.clipPath = `inset(0 ${clipRight}% 0 0)`;
              }
              sol.style.opacity =
                localProgress > 0.3 ? "1" : `${localProgress / 0.3}`;

              // Brighten paired problem
              if (problems[i]) {
                problems[i].style.opacity = 0.5 + localProgress * 0.5;
              }
            }
          });

          // Fade out entire pinned section during last 15%
          if (progress > 0.85) {
            const fadeProgress = (progress - 0.85) / 0.15;
            pinSection.style.opacity = String(1 - fadeProgress);
          } else {
            pinSection.style.opacity = "1";
          }
        },
      });
    }
  }

  // Bg transition during last 15%
  ScrollTrigger.create({
    trigger: "#problem-solution",
    start: "bottom-=15% bottom",
    end: "bottom bottom",
    scrub: true,
    onUpdate: (self) => {
      const bg = gsap.utils.interpolate("#1A1A1E", "#1E1E22", self.progress);
      document.body.style.backgroundColor = bg;
    },
  });
}

// ── S3: Design Principles ──
function setupPrinciples(isMobile, isTablet) {
  // Section header fade-in (fires before pin locks)
  const heading = document.querySelector(".principles-heading");
  if (heading) {
    heading.classList.remove("gsap-hidden");
    gsap.from(heading, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power4.out",
      scrollTrigger: {
        trigger: ".principles-pin",
        start: "top 80%",
      },
    });
  }

  // Subheading slides from right (completes before pin locks)
  const subheading = document.querySelector(".principles-subheading");
  if (subheading) {
    subheading.classList.remove("gsap-hidden");
    gsap.from(subheading, {
      x: () => window.innerWidth,
      ease: "power4.out",
      scrollTrigger: {
        trigger: ".principles-pin",
        start: "top bottom",
        end: "top 20%",
        scrub: 0.5,
      },
    });
  }

  // Pin .principles-pin for +=100% scroll distance
  const pinWrap = document.querySelector(".principles-pin");
  if (pinWrap) {
    ScrollTrigger.create({
      trigger: ".principles-pin",
      start: "top top",
      end: "+=100%",
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        // Fade out during last 30% of pin (progress 0.7 -> 1.0)
        if (self.progress > 0.7) {
          const fadeProgress = (self.progress - 0.7) / 0.3;
          pinWrap.style.opacity = String(1 - fadeProgress);
        } else {
          pinWrap.style.opacity = "1";
        }
      },
    });
  }

  // Magnetic assemble for principle cards
  const spreadMultiplier = isMobile ? 0.3 : isTablet ? 0.6 : 1;
  magneticAssemble(".principle-card", {
    spread: spreadMultiplier,
    scrollTrigger: {
      trigger: ".principle-card",
      start: "top 85%",
      toggleActions: "play none none none",
    },
  });
}

// ── S4: Services ──
function setupServices() {
  fadeUp(".services-heading", {
    scrollTrigger: { trigger: ".services-heading", start: "top 80%" },
  });

  fadeUp(".service-card", {
    stagger: 0.15,
    scrollTrigger: { trigger: ".service-card", start: "top 80%" },
  });

  fadeUp(".growth-partner", {
    scrollTrigger: { trigger: ".growth-partner", start: "top 80%" },
  });

  fadeUp(".services-cta", {
    scrollTrigger: { trigger: ".services-cta", start: "top 85%" },
  });
}

// ── S4→S5 Transition: bg-secondary -> bg ──
function setupServicesToPortfolioTransition() {
  const portfolio = document.querySelector("#portfolio");
  if (!portfolio) return;

  ScrollTrigger.create({
    trigger: "#portfolio",
    start: "top-=15% bottom",
    end: "top bottom",
    scrub: true,
    onUpdate: (self) => {
      const bg = gsap.utils.interpolate("#1E1E22", "#1A1A1E", self.progress);
      document.body.style.backgroundColor = bg;
    },
  });
}

// ── S5: Portfolio ──
function setupPortfolio(isMobile) {
  setupServicesToPortfolioTransition();

  fadeUp(".portfolio-heading", {
    scrollTrigger: { trigger: ".portfolio-heading", start: "top 80%" },
  });

  fadeUp(".portfolio-subline", {
    scrollTrigger: { trigger: ".portfolio-subline", start: "top 80%" },
    delay: 0.1,
  });

  fadeUp(".portfolio-card", {
    stagger: isMobile ? 0.08 : 0.15,
    scrollTrigger: { trigger: ".portfolio-card", start: "top 85%" },
  });
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
}

// ── S6.5: Why Me ──
function setupWhyMe() {
  fadeUp(".whyme-heading", {
    scrollTrigger: { trigger: ".whyme-heading", start: "top 80%" },
  });

  fadeUp(".whyme-body", {
    scrollTrigger: { trigger: ".whyme-body", start: "top 80%" },
    delay: 0.15,
  });
}

// ── S7: Reviews ──
function setupReviews() {
  fadeUp(".reviews-heading", {
    scrollTrigger: { trigger: ".reviews-heading", start: "top 80%" },
  });

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
}

// ── S8: CTA/Contact ──
function setupContact() {
  fadeUp(".contact-heading", {
    scrollTrigger: { trigger: ".contact-heading", start: "top 80%" },
  });

  fadeUp(".contact-sub", {
    scrollTrigger: { trigger: ".contact-sub", start: "top 80%" },
    delay: 0.1,
  });

  fadeUp(".contact-cta", {
    scrollTrigger: { trigger: ".contact-cta", start: "top 85%" },
    delay: 0.2,
  });

  // Form fades in after primary CTA
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

// Initialize — respect prefers-reduced-motion
function start() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (prefersReducedMotion) {
    // Show all hidden elements without animation
    document.querySelectorAll(".gsap-hidden").forEach((el) => {
      el.classList.remove("gsap-hidden");
    });
    // Remove joke element so only real heading shows
    const joke = document.querySelector(".ps-joke");
    if (joke) joke.remove();
    return;
  }
  init();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start);
} else {
  start();
}
