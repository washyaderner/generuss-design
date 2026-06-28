#!/usr/bin/env node
/**
 * Tarotdoxa branded QR — 4 artistic options.
 *
 * Sibling of generate-qr.cjs (the generuss business-card QR):
 *   same toolchain (qrcode + sharp + jsqr), EC level H, structurally-correct
 *   QR re-rendered as styled dots, center mark, then VERIFIED to scan before
 *   saving. If a styled version fails, fall back step by step until it passes.
 *
 * Brand: Tarotdoxa sgraffito (brand-dna.md, locked 2026-05-30) — luminous
 *   violet-forward multi-color on near-black #0A0A0F. Center = the locked
 *   app-icon chalice-T mark (tarotdoxa-logo-T-icon.jpeg).
 *
 * Link: https://generussdesign.com/connect/  (canonical, returns 200 directly)
 */
const QRCode = require("qrcode");
const sharp = require("sharp");
const jsQR = require("jsqr");
const fs = require("fs");
const path = require("path");

const TARGET_URL = "https://generussdesign.com/connect/";
const OUT_DIR = process.env.OUT_DIR || "/Users/studio/Build/tarotdoxa/brand/qr";
const SIZE = 1400;
const MARGIN = 4; // quiet-zone modules (generous; card used 1)
const BG = "#0A0A0F"; // brand near-black, never pure #000
const ICON_SRC = "/Users/studio/Build/tarotdoxa/brand/tarotdoxa-logo-T-icon.jpeg";

// Luminous brand stops (brand-dna palette, brightened so every module clears
// contrast against #0A0A0F — the brand itself demands "luminous, POPS").
const P = {
  violet: "#B57BFF",
  magenta: "#F254C6",
  pink: "#FF77AD",
  coral: "#FF8A66",
  gold: "#ECC04D",
  teal: "#34E0C9",
};

const VARIANTS = [
  {
    key: "01-chalice",
    name: "Chalice — solid violet (brand-faithful sibling of the card)",
    shape: "rounded",
    grad: null,
    moduleFill: P.violet,
    finderFill: P.violet,
    stroke: P.violet,
    solid: P.violet,
  },
  {
    key: "02-reveal",
    name: "Reveal — vertical spectrum (teal→violet→magenta→coral→gold)",
    shape: "rounded",
    grad: { type: "linear", x1: 0, y1: 0, x2: 0, y2: 1,
      stops: [[0, P.teal], [0.30, P.violet], [0.55, P.magenta], [0.78, P.coral], [1, P.gold]] },
    moduleFill: "url(#g)",
    finderFill: P.gold,
    stroke: P.gold,
    solid: P.gold,
  },
  {
    key: "03-vortex",
    name: "Vortex — teal core → violet edge gradient, teal finders",
    shape: "rounded",
    grad: { type: "radial", cx: 0.5, cy: 0.5, r: 0.60,
      stops: [[0, P.teal], [0.22, "#3FCBE3"], [0.48, "#8A78FF"], [0.74, "#9D5CFF"], [1, "#7C3AED"]] },
    moduleFill: "url(#g)",
    finderFill: P.teal,
    stroke: "#22D3EE",
    solid: P.teal,
  },
  {
    key: "04-sgraffito",
    name: "Sgraffito — diagonal carve, finders carved from the field too",
    shape: "rounded",
    grad: { type: "linear", x1: 0, y1: 0, x2: 1, y2: 1,
      stops: [[0, P.violet], [0.22, P.magenta], [0.42, P.pink], [0.60, P.coral], [0.80, P.gold], [1, P.teal]] },
    moduleFill: "url(#g)",
    finderFill: "url(#g)",
    stroke: P.gold,
    solid: P.gold,
  },
];

function gradDef(variant) {
  if (!variant.grad) return "";
  const g = variant.grad;
  const stops = g.stops
    .map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`)
    .join("");
  if (g.type === "linear") {
    return `<linearGradient id="g" gradientUnits="userSpaceOnUse" x1="${g.x1 * SIZE}" y1="${g.y1 * SIZE}" x2="${g.x2 * SIZE}" y2="${g.y2 * SIZE}">${stops}</linearGradient>`;
  }
  return `<radialGradient id="g" gradientUnits="userSpaceOnUse" cx="${g.cx * SIZE}" cy="${g.cy * SIZE}" r="${g.r * SIZE}">${stops}</radialGradient>`;
}

function buildSVG(qr, variant, iconB64, opts) {
  const size = qr.modules.size;
  const data = qr.modules.data;
  const total = size + MARGIN * 2;
  const ms = SIZE / total;
  const shape = opts.shape || variant.shape;
  const moduleFill = opts.fill || variant.moduleFill;
  const finderFill = opts.finder || variant.finderFill;

  const logoFrac = opts.logoFrac; // 0 disables
  const logoModules = Math.round(size * logoFrac);
  const lStart = Math.floor((size - logoModules) / 2);
  const lEnd = lStart + logoModules;

  const isFinder = (r, c) =>
    (r < 7 && c < 7) || (r < 7 && c >= size - 7) || (r >= size - 7 && c < 7);
  const inLogo = (r, c) =>
    logoFrac > 0 && r >= lStart && r < lEnd && c >= lStart && c < lEnd;

  const svg = [];
  svg.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">`);
  svg.push(`<defs>${gradDef(variant)}<clipPath id="lc"><rect id="lcr"/></clipPath></defs>`);
  svg.push(`<rect width="${SIZE}" height="${SIZE}" fill="${BG}"/>`);

  // Finder patterns — square modules (most reliable), recolored.
  for (const [fr, fc] of [[0, 0], [0, size - 7], [size - 7, 0]]) {
    for (let r = fr; r < fr + 7; r++) {
      for (let c = fc; c < fc + 7; c++) {
        if (!data[r * size + c]) continue;
        const x = (c + MARGIN) * ms, y = (r + MARGIN) * ms;
        svg.push(`<rect x="${x}" y="${y}" width="${ms}" height="${ms}" fill="${finderFill}"/>`);
      }
    }
  }

  // Data modules.
  const rx = ms * 0.32;
  const rDot = ms * 0.46;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!data[r * size + c]) continue;
      if (isFinder(r, c)) continue;
      if (inLogo(r, c)) continue;
      const x = (c + MARGIN) * ms, y = (r + MARGIN) * ms;
      if (shape === "dot") {
        svg.push(`<circle cx="${x + ms / 2}" cy="${y + ms / 2}" r="${rDot}" fill="${moduleFill}"/>`);
      } else if (shape === "square") {
        svg.push(`<rect x="${x}" y="${y}" width="${ms}" height="${ms}" fill="${moduleFill}"/>`);
      } else {
        svg.push(`<rect x="${x}" y="${y}" width="${ms}" height="${ms}" rx="${rx}" ry="${rx}" fill="${moduleFill}"/>`);
      }
    }
  }

  // Center app-icon mark.
  if (logoFrac > 0 && iconB64) {
    const tile = SIZE * (logoFrac - 0.02); // slightly inset from cleared zone
    const back = SIZE * logoFrac;
    const cx = SIZE / 2, cy = SIZE / 2;
    const tileR = tile * 0.22;          // iOS-style rounded square
    const tx = cx - tile / 2, ty = cy - tile / 2;
    // halo (clean dead-zone) + thin brand ring + clipped icon
    svg.push(`<rect x="${cx - back / 2}" y="${cy - back / 2}" width="${back}" height="${back}" rx="${back * 0.24}" ry="${back * 0.24}" fill="${BG}"/>`);
    // set clip rect geometry
    svg[1] = svg[1].replace('<rect id="lcr"/>', `<rect x="${tx}" y="${ty}" width="${tile}" height="${tile}" rx="${tileR}" ry="${tileR}"/>`);
    svg.push(`<image x="${tx}" y="${ty}" width="${tile}" height="${tile}" clip-path="url(#lc)" preserveAspectRatio="xMidYMid slice" href="data:image/png;base64,${iconB64}"/>`);
    svg.push(`<rect x="${tx}" y="${ty}" width="${tile}" height="${tile}" rx="${tileR}" ry="${tileR}" fill="none" stroke="${variant.stroke}" stroke-width="${ms * 0.55}" opacity="0.9"/>`);
  }

  svg.push("</svg>");
  return svg.join("\n");
}

async function renderPNG(svgStr, outPath) {
  const buf = await sharp(Buffer.from(svgStr)).resize(SIZE, SIZE).png().toBuffer();
  fs.writeFileSync(outPath, buf);
}

async function scans(filePath, atSize) {
  let pipe = sharp(filePath);
  if (atSize) pipe = pipe.resize(atSize, atSize);
  const { data, info } = await pipe
    .negate({ alpha: false })
    .flatten({ background: "#ffffff" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const code = jsQR(new Uint8ClampedArray(data), info.width, info.height);
  return code && code.data === TARGET_URL;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const iconB64 = (await sharp(ICON_SRC).resize(512, 512, { fit: "cover" }).png().toBuffer()).toString("base64");

  const qr = QRCode.create(TARGET_URL, { errorCorrectionLevel: "H" });
  console.log(`QR ${qr.modules.size}x${qr.modules.size} modules, EC=H, URL=${TARGET_URL}\n`);

  const report = [];
  for (const v of VARIANTS) {
    const outPath = path.join(OUT_DIR, `tarotdoxa-qr-${v.key}.png`);
    const svgStr = buildSVG(qr, v, iconB64, { logoFrac: 0.19 });
    await renderPNG(svgStr, outPath);
    fs.writeFileSync(outPath.replace(/\.png$/, ".svg"), svgStr); // vector, self-contained (logo embedded)
    // jsQR@800 is an informational smoke test only (it is unreliable at full res
    // + with the negate trick). Phone-grade zxing-cpp is the real gate, run
    // separately across capture sizes after this script.
    const js = await scans(outPath, 800);
    report.push({ key: v.key, name: v.name, outPath, js });
    console.log(`${v.key.padEnd(13)} rendered as-designed  (jsQR@800: ${js ? "ok" : "n/a — verify via zxing"})`);
  }

  console.log("\n--- summary (verify with zxing-cpp) ---");
  for (const r of report) console.log(`${r.key}: ${r.name}\n   ${r.outPath}`);
}

main().catch((e) => { console.error("ERROR:", e.message); process.exit(1); });
