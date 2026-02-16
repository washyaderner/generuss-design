#!/usr/bin/env node

/**
 * visual-qa-capture.mjs — Playwright screenshot capture for Visual QA
 *
 * Takes per-section screenshots at 3 viewports by scrolling through the page.
 * Also captures a full-page shot and console output.
 * Called by visual-qa.sh, not meant to be run standalone.
 *
 * Usage: node execution/visual-qa-capture.mjs [url] [output_dir]
 *   url        — defaults to http://localhost:4321
 *   output_dir — defaults to .tmp/qa
 */

import { chromium } from "@playwright/test";
import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";

const BASE_URL = process.argv[2] || "http://localhost:4321";
const OUTPUT_DIR = process.argv[3] || ".tmp/qa";

const VIEWPORTS = [
  { name: "desktop", width: 1920, height: 1080 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 375, height: 812 },
];

// Sections to scroll to and capture individually
const SECTIONS = [
  { id: "hero", label: "hero" },
  { id: "problem-solution", label: "problem-solution" },
  { id: "principles", label: "principles" },
  { id: "services", label: "services" },
  { id: "portfolio", label: "portfolio" },
  { id: "about", label: "about" },
  { id: "why-me", label: "why-me" },
  { id: "reviews", label: "reviews" },
  { id: "contact", label: "contact" },
];

async function capture() {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const consoleMessages = [];
  const browser = await chromium.launch();

  for (const vp of VIEWPORTS) {
    const vpDir = join(OUTPUT_DIR, vp.name);
    mkdirSync(vpDir, { recursive: true });

    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    // Capture console output (only on first viewport to avoid duplicates)
    if (vp.name === "desktop") {
      page.on("console", (msg) => {
        consoleMessages.push(`[${msg.type()}] ${msg.text()}`);
      });
      page.on("pageerror", (err) => {
        consoleMessages.push(`[pageerror] ${err.message}`);
      });
    }

    await page.goto(BASE_URL, { waitUntil: "networkidle", timeout: 30000 });

    // Wait for hero entrance animation to complete (0.3s delay + ~2s timeline)
    await page.waitForTimeout(3000);

    // Capture hero (visible after entrance animation)
    await page.screenshot({
      path: join(vpDir, "hero.png"),
      clip: { x: 0, y: 0, width: vp.width, height: vp.height },
    });
    console.log(`  ${vp.name}/hero.png`);

    // Scroll through each section to trigger ScrollTrigger animations
    for (const section of SECTIONS.slice(1)) {
      // Scroll to section
      const found = await page.evaluate((sectionId) => {
        const el = document.getElementById(sectionId);
        if (!el) return false;
        el.scrollIntoView({ behavior: "instant", block: "start" });
        return true;
      }, section.id);

      if (!found) {
        console.log(
          `  ${vp.name}/${section.label}.png — section not found, skipping`,
        );
        continue;
      }

      // Wait for scroll-triggered animations to fire and settle
      await page.waitForTimeout(1500);

      // Capture the current viewport (what the user sees)
      await page.screenshot({
        path: join(vpDir, `${section.label}.png`),
      });
      console.log(`  ${vp.name}/${section.label}.png`);
    }

    // Full-page capture at the end (all animations have been triggered)
    await page.screenshot({
      path: join(vpDir, "full-page.png"),
      fullPage: true,
    });
    console.log(`  ${vp.name}/full-page.png`);

    await context.close();
  }

  // Write console log
  const logPath = join(OUTPUT_DIR, "console.log");
  writeFileSync(logPath, consoleMessages.join("\n") + "\n");
  console.log(
    `\nConsole output → ${logPath} (${consoleMessages.length} messages)`,
  );

  await browser.close();
}

capture().catch((err) => {
  console.error("Capture failed:", err.message);
  process.exit(1);
});
