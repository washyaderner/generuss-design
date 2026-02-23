#!/usr/bin/env node
/**
 * generate-lava-thumbs.mjs
 *
 * Deterministic lava lamp SVG thumbnail generator for blog posts.
 * Runs before build/dev via npm lifecycle hooks.
 *
 * - Scans src/content/blog/*.md for posts
 * - Skips posts with explicit featuredImage (not placeholder)
 * - Skips slugs where public/images/blog/{slug}-og.svg already exists
 * - Generates unique SVGs using slug-seeded PRNG (same slug = same SVG)
 *
 * Zero dependencies - pure Node.js.
 */

import {
  readFileSync,
  writeFileSync,
  existsSync,
  readdirSync,
  mkdirSync,
} from "node:fs";
import { join, basename } from "node:path";

const BLOG_DIR = "src/content/blog";
const OUTPUT_DIR = "public/images/blog";
const ACCENT = "#00FFEF";
const BG = "#1a1a1e";
const VIGNETTE_EDGE = "#0a0a0c";

// --- Seeded PRNG ---

function fnv1a(str) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function mulberry32(seed) {
  let s = seed | 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randRange(rng, min, max) {
  return min + rng() * (max - min);
}

function randInt(rng, min, max) {
  return Math.floor(randRange(rng, min, max + 1));
}

// --- Collision avoidance ---

function overlaps(blob, existing, minGap) {
  for (const b of existing) {
    const dx = blob.cx - b.cx;
    const dy = blob.cy - b.cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < blob.r + b.r + minGap) return true;
  }
  return false;
}

function placeBlob(
  rng,
  cxMin,
  cxMax,
  cyMin,
  cyMax,
  rMin,
  rMax,
  existing,
  maxAttempts = 30,
) {
  for (let i = 0; i < maxAttempts; i++) {
    const cx = Math.round(randRange(rng, cxMin, cxMax));
    const cy = Math.round(randRange(rng, cyMin, cyMax));
    const r = Math.round(randRange(rng, rMin, rMax));
    const blob = { cx, cy, r };
    if (!overlaps(blob, existing, 8)) {
      return blob;
    }
  }
  // Fallback: place anyway (some overlap is fine with goo filter)
  return {
    cx: Math.round(randRange(rng, cxMin, cxMax)),
    cy: Math.round(randRange(rng, cyMin, cyMax)),
    r: Math.round(randRange(rng, rMin, rMax)),
  };
}

// --- SVG generation ---

function generateRisingBlob(rng, blob, sizeLabel) {
  const opacityMap = {
    large: [0.6, 0.75],
    medium: [0.45, 0.6],
    small: [0.35, 0.5],
    tiny: [0.25, 0.4],
  };
  const [opMin, opMax] = opacityMap[sizeLabel];
  const opacity = +randRange(rng, opMin, opMax).toFixed(2);
  const dur = randInt(rng, 11, 24);

  // 4-point translate path with lateral drift and vertical rise
  const h1 = randInt(rng, -35, 35);
  const v1 = randInt(rng, -90, -170);
  const h2 = randInt(rng, -35, 35);
  const v2 = randInt(rng, -170, -260);
  const h3 = randInt(rng, -25, 25);
  const v3 = randInt(rng, -45, -110);

  return `    <circle cx="${blob.cx}" cy="${blob.cy}" r="${blob.r}" fill="${ACCENT}" opacity="${opacity}">
      <animateTransform attributeName="transform" type="translate" values="0,0; ${h1},${v1}; ${h2},${v2}; ${h3},${v3}; 0,0" dur="${dur}s" repeatCount="indefinite"/>
    </circle>`;
}

function generateDetachingBlob(rng, blob) {
  const opacity = +randRange(rng, 0.65, 0.85).toFixed(2);
  const dur = randInt(rng, 7, 12);
  const h1 = randInt(rng, -18, 18);
  const v1 = randInt(rng, -70, -100);
  const h2 = randInt(rng, -15, 15);
  const v2 = randInt(rng, -30, -55);

  return `    <circle cx="${blob.cx}" cy="${blob.cy}" r="${blob.r}" fill="${ACCENT}" opacity="${opacity}">
      <animateTransform attributeName="transform" type="translate" values="0,0; ${h1},${v1}; ${h2},${v2}; 0,0" dur="${dur}s" repeatCount="indefinite"/>
    </circle>`;
}

function generateBottomPool(rng) {
  // Randomize the bezier control points for the pool's top edge
  const leftY = randInt(rng, 580, 600);
  const midCtrlY = randInt(rng, 540, 570);
  const midY = randInt(rng, 565, 585);
  const rightCtrlY = randInt(rng, 530, 560);
  const rightY = randInt(rng, 580, 600);

  return `    <path d="M 0,630 L 0,${leftY} Q 300,${midCtrlY} 600,${midY} Q 900,${rightCtrlY} 1200,${rightY} L 1200,630 Z" fill="${ACCENT}" opacity="0.7"/>`;
}

function generateSvg(slug) {
  const seed = fnv1a(slug);
  const rng = mulberry32(seed);

  const blobs = [];
  const blobSvgs = [];

  // Size tiers: counts and radius ranges
  const tiers = [
    { label: "large", count: randInt(rng, 3, 4), rMin: 45, rMax: 60 },
    { label: "medium", count: randInt(rng, 3, 4), rMin: 30, rMax: 40 },
    { label: "small", count: randInt(rng, 3, 4), rMin: 20, rMax: 28 },
    { label: "tiny", count: randInt(rng, 3, 4), rMin: 14, rMax: 20 },
  ];

  for (const tier of tiers) {
    // cy ranges differ by tier - larger blobs start lower
    const cyMin =
      tier.label === "large"
        ? 350
        : tier.label === "medium"
          ? 260
          : tier.label === "small"
            ? 220
            : 180;
    const cyMax =
      tier.label === "large"
        ? 480
        : tier.label === "medium"
          ? 460
          : tier.label === "small"
            ? 400
            : 340;

    for (let i = 0; i < tier.count; i++) {
      const blob = placeBlob(
        rng,
        120,
        1080,
        cyMin,
        cyMax,
        tier.rMin,
        tier.rMax,
        blobs,
      );
      blobs.push(blob);
      blobSvgs.push(generateRisingBlob(rng, blob, tier.label));
    }
  }

  // Detaching blobs (near the pool surface)
  const detachCount = 4;
  const detachBlobs = [];
  for (let i = 0; i < detachCount; i++) {
    const blob = placeBlob(rng, 180, 1020, 540, 560, 25, 40, detachBlobs);
    detachBlobs.push(blob);
    blobSvgs.push(generateDetachingBlob(rng, blob));
  }

  const pool = generateBottomPool(rng);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <filter id="goo" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="blur"/>
      <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 28 -9" result="goo"/>
      <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
    </filter>

    <radialGradient id="glow1" cx="50%" cy="80%" r="50%">
      <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="${ACCENT}" stop-opacity="0"/>
    </radialGradient>

    <radialGradient id="vignette" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="transparent"/>
      <stop offset="100%" stop-color="${VIGNETTE_EDGE}"/>
    </radialGradient>
  </defs>

  <rect width="1200" height="630" fill="${BG}"/>
  <rect width="1200" height="630" fill="url(#glow1)"/>

  <g filter="url(#goo)">
${pool}

${blobSvgs.join("\n\n")}
  </g>

  <rect width="1200" height="630" fill="url(#vignette)" opacity="0.3"/>
</svg>
`;
}

// --- Frontmatter parsing (minimal, no deps) ---

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const fm = {};
  for (const line of match[1].split("\n")) {
    const kv = line.match(/^(\w+):\s*"?([^"]*)"?\s*$/);
    if (kv) fm[kv[1]] = kv[2];
  }
  return fm;
}

// --- Main ---

function main() {
  if (!existsSync(BLOG_DIR)) {
    console.log("[lava-thumbs] No blog directory found, skipping.");
    return;
  }

  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const files = readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));
  let generated = 0;
  let skipped = 0;

  for (const file of files) {
    const slug = basename(file, ".md");
    const outPath = join(OUTPUT_DIR, `${slug}-og.svg`);

    // Skip if SVG already exists on disk
    if (existsSync(outPath)) {
      skipped++;
      continue;
    }

    // Skip if post has explicit (non-placeholder) featuredImage
    const content = readFileSync(join(BLOG_DIR, file), "utf-8");
    const fm = parseFrontmatter(content);
    if (fm.featuredImage && fm.featuredImage !== "/images/placeholder.svg") {
      skipped++;
      continue;
    }

    // Generate
    const svg = generateSvg(slug);
    writeFileSync(outPath, svg);
    console.log(`[lava-thumbs] Generated ${outPath}`);
    generated++;
  }

  console.log(
    `[lava-thumbs] Done. Generated: ${generated}, Skipped: ${skipped}`,
  );
}

main();
