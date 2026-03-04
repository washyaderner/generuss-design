#!/usr/bin/env node
/**
 * Portfolio Screenshot Processor
 * Crops browser/phone chrome from raw screenshots, resizes, and converts to webp.
 *
 * Usage:
 *   node execution/process-portfolio-screenshots.cjs --test    # 1 desktop + 1 mobile to .tmp/
 *   node execution/process-portfolio-screenshots.cjs           # Full batch to public/images/portfolio/slides/
 */

const path = require("path");
const fs = require("fs");
const sharp = require(path.join(__dirname, "..", "card", "source", "node_modules", "sharp"));

const ROOT = path.resolve(__dirname, "..");
const SRC_DIR = path.join(ROOT, "public/images/portfolio/social_proof");
const OUT_DIR = path.join(ROOT, "public/images/portfolio/slides");
const TMP_DIR = path.join(ROOT, ".tmp");

// --- Crop configs ---
// Arc browser on 5K retina: menu bar + tab bar + toolbar + bookmarks at top, sidebar left, scrollbar right
const DESKTOP_CROP = {
  top: 290,
  left: 100,
  right: 34,
  bottom: 0,
};

// iPhone Safari: status bar + URL bar at top, nav bar at bottom
const MOBILE_CROP = {
  top: 260,
  left: 0,
  right: 0,
  bottom: 140,
};

const DESKTOP_WIDTH = 1920;
const MOBILE_WIDTH = 660;
const WEBP_QUALITY = 82;

// --- File mappings ---
const DESKTOP_MAP = [
  // [source filename (no ext), project dir, output name]
  ["crystal_hero", "crystal", "01"],
  ["crystal_blog", "crystal", "02"],
  ["crystal_events", "crystal", "03"],
  ["crystal_reviews", "crystal", "04"],
  ["vibe_hero", "vibe", "01"],
  ["vibe_gif", "vibe", "02"],
  ["vibe_info", "vibe", "03"],
  ["vibe_pricing", "vibe", "04"],
  ["generuss_hero", "generuss", "01"],
  ["generuss_blog", "generuss", "02"],
  ["generuss_book", "generuss", "03"],
];

const MOBILE_MAP = [
  // [source filename (no ext), project dir, output name]
  ["crystal_mobile_hero", "crystal", "mobile-01"],
  ["crystal_mobile_reviews", "crystal", "mobile-02"],
  ["crystal_mobile_blog", "crystal", "mobile-03"],
  ["crystal_mobile_events", "crystal", "mobile-04"],
  ["crystal_mobile_menu", "crystal", "mobile-05"],
  ["vibe_mobile_hero", "vibe", "mobile-01"],
  ["vibe_mobile_info", "vibe", "mobile-02"],
  ["vibe_mobile_price", "vibe", "mobile-03"],
  ["vibe_mobile_gif-and-list", "vibe", "mobile-04"],
  ["vibe_mobile_menu", "vibe", "mobile-05"],
  ["generuss_mobile_hero", "generuss", "mobile-01"],
  ["generuss_mobile_blog", "generuss", "mobile-02"],
  ["generuss_mobile_book", "generuss", "mobile-03"],
  ["generuss_mobile_chat", "generuss", "mobile-04"],
  ["generuss_mobile_reviews", "generuss", "mobile-05"],
  ["generuss_mobile_social_proof", "generuss", "mobile-06"],
];

async function processImage(srcPath, outPath, crop, targetWidth) {
  const meta = await sharp(srcPath).metadata();
  const w = meta.width;
  const h = meta.height;

  const extractLeft = crop.left;
  const extractTop = crop.top;
  const extractWidth = w - crop.left - crop.right;
  const extractHeight = h - crop.top - crop.bottom;

  await sharp(srcPath)
    .extract({
      left: extractLeft,
      top: extractTop,
      width: extractWidth,
      height: extractHeight,
    })
    .resize(targetWidth)
    .webp({ quality: WEBP_QUALITY })
    .toFile(outPath);

  const outMeta = await sharp(outPath).metadata();
  return { src: path.basename(srcPath), out: path.basename(outPath), w: outMeta.width, h: outMeta.height };
}

function findSource(baseName, subdir) {
  // Try common extensions
  for (const ext of [".png", ".PNG", ".jpg", ".jpeg", ".webp"]) {
    const p = path.join(SRC_DIR, subdir, baseName + ext);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function run() {
  const args = process.argv.slice(2);
  const testMode = args.includes("--test");

  if (testMode) {
    console.log("=== TEST MODE: processing 1 desktop + 1 mobile to .tmp/ ===\n");
    ensureDir(TMP_DIR);

    // Test desktop
    const dSrc = findSource(DESKTOP_MAP[0][0], "Desktop");
    if (dSrc) {
      const result = await processImage(dSrc, path.join(TMP_DIR, "test-desktop.webp"), DESKTOP_CROP, DESKTOP_WIDTH);
      console.log(`Desktop: ${result.src} -> ${result.out} (${result.w}x${result.h})`);
    } else {
      console.error(`Missing: Desktop/${DESKTOP_MAP[0][0]}`);
    }

    // Test mobile
    const mSrc = findSource(MOBILE_MAP[0][0], "Mobile");
    if (mSrc) {
      const result = await processImage(mSrc, path.join(TMP_DIR, "test-mobile.webp"), MOBILE_CROP, MOBILE_WIDTH);
      console.log(`Mobile: ${result.src} -> ${result.out} (${result.w}x${result.h})`);
    } else {
      console.error(`Missing: Mobile/${MOBILE_MAP[0][0]}`);
    }

    console.log(`\nTest files in: ${TMP_DIR}/`);
    return;
  }

  // Full batch
  console.log("=== FULL BATCH: processing all portfolio screenshots ===\n");

  let desktopCount = 0;
  let mobileCount = 0;
  let errors = [];

  // Desktop
  for (const [srcName, project, outName] of DESKTOP_MAP) {
    const srcPath = findSource(srcName, "Desktop");
    const outDir = path.join(OUT_DIR, project);
    ensureDir(outDir);
    const outPath = path.join(outDir, outName + ".webp");

    if (!srcPath) {
      errors.push(`Missing: Desktop/${srcName}`);
      continue;
    }

    try {
      const result = await processImage(srcPath, outPath, DESKTOP_CROP, DESKTOP_WIDTH);
      console.log(`  ${result.src} -> ${project}/${result.out} (${result.w}x${result.h})`);
      desktopCount++;
    } catch (e) {
      errors.push(`Error processing ${srcName}: ${e.message}`);
    }
  }

  console.log();

  // Mobile
  for (const [srcName, project, outName] of MOBILE_MAP) {
    const srcPath = findSource(srcName, "Mobile");
    const outDir = path.join(OUT_DIR, project);
    ensureDir(outDir);
    const outPath = path.join(outDir, outName + ".webp");

    if (!srcPath) {
      errors.push(`Missing: Mobile/${srcName}`);
      continue;
    }

    try {
      const result = await processImage(srcPath, outPath, MOBILE_CROP, MOBILE_WIDTH);
      console.log(`  ${result.src} -> ${project}/${result.out} (${result.w}x${result.h})`);
      mobileCount++;
    } catch (e) {
      errors.push(`Error processing ${srcName}: ${e.message}`);
    }
  }

  console.log(`\n=== Done: ${desktopCount} desktop + ${mobileCount} mobile = ${desktopCount + mobileCount} files ===`);

  if (errors.length) {
    console.log("\nErrors:");
    errors.forEach((e) => console.log(`  - ${e}`));
  }
}

run().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
