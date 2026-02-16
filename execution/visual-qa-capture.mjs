#!/usr/bin/env node

/**
 * visual-qa-capture.mjs — Playwright screenshot capture for Visual QA
 *
 * Takes full-page screenshots at 3 viewports and captures console output.
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

async function capture() {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const consoleMessages = [];
  const browser = await chromium.launch();

  for (const vp of VIEWPORTS) {
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

    // Wait a beat for any animations to settle into initial state
    await page.waitForTimeout(1500);

    const outPath = join(OUTPUT_DIR, `${vp.name}.png`);
    await page.screenshot({ path: outPath, fullPage: true });
    console.log(`Captured ${vp.name} (${vp.width}px) → ${outPath}`);

    await context.close();
  }

  // Write console log
  const logPath = join(OUTPUT_DIR, "console.log");
  writeFileSync(logPath, consoleMessages.join("\n") + "\n");
  console.log(
    `Console output → ${logPath} (${consoleMessages.length} messages)`,
  );

  await browser.close();
}

capture().catch((err) => {
  console.error("Capture failed:", err.message);
  process.exit(1);
});
