#!/usr/bin/env node
/**
 * generuss Business Card - Branded QR Code Generator
 *
 * Strategy: Generate a structurally-correct QR code, then restyle it.
 *   1. Render standard QR at module-level resolution
 *   2. Read the module grid to know which cells are dark
 *   3. Re-render as rounded dots in SVG at 600dpi output resolution
 *   4. Overlay centered "g" lettermark
 *   5. Verify the result scans before saving
 *
 * If styled version fails to scan, progressively reduce styling until it passes.
 */

const QRCode = require("qrcode");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const TARGET_URL = "https://generussdesign.com/connect";
const OUTPUT_SIZE = 1083;
const MODULE_COLOR = "#00e5ff";
const OUTPUT_PATH = path.resolve(__dirname, "qr-code.png");

async function generateQR() {
  console.log("\ngeneruss QR Code Generator");
  console.log("~".repeat(30));
  console.log(`URL:    ${TARGET_URL}`);
  console.log(`Size:   ${OUTPUT_SIZE}px`);
  console.log(`Output: ${OUTPUT_PATH}\n`);

  // Get the QR module data
  const qr = QRCode.create(TARGET_URL, { errorCorrectionLevel: "H" });
  const size = qr.modules.size;
  const data = qr.modules.data;
  console.log(`  QR: ${size}x${size} modules, EC level H`);

  // Attempt 1: Hybrid - standard finders + rounded data dots + logo
  console.log("  Attempt 1: Hybrid (standard finders, rounded data) + logo...");
  let passed = await tryRender(qr, { roundedDots: true, roundedFinders: false, logo: true });
  if (passed) return;

  // Attempt 2: Hybrid, no logo
  console.log("  Attempt 2: Hybrid, no logo...");
  passed = await tryRender(qr, { roundedDots: true, roundedFinders: false, logo: false });
  if (passed) return;

  // Attempt 3: Rounded finders + rounded data + logo
  console.log("  Attempt 3: Full rounded + logo...");
  passed = await tryRender(qr, { roundedDots: true, roundedFinders: true, logo: true });
  if (passed) return;

  // Attempt 4: Standard modules + logo
  console.log("  Attempt 4: Standard modules + logo...");
  passed = await tryRender(qr, { roundedDots: false, roundedFinders: false, logo: true });
  if (passed) return;

  // Attempt 5: Clean standard QR
  console.log("  Attempt 5: Standard QR, no styling...");
  passed = await tryRender(qr, { roundedDots: false, roundedFinders: false, logo: false });
  if (passed) return;

  console.error("  CRITICAL: No version scans. Exiting.");
  process.exit(1);
}

async function tryRender(qr, opts) {
  const size = qr.modules.size;
  const data = qr.modules.data;
  const margin = 1;
  const totalSize = size + margin * 2;
  const moduleSize = OUTPUT_SIZE / totalSize;

  // Logo dead zone (center ~18% of modules)
  const logoModules = Math.floor(size * 0.18);
  const logoStart = Math.floor((size - logoModules) / 2);
  const logoEnd = logoStart + logoModules;

  // Finder pattern bounds (7x7 + 1 module separator)
  function isInFinder(r, c) {
    return (
      (r < 7 && c < 7) ||
      (r < 7 && c >= size - 7) ||
      (r >= size - 7 && c < 7)
    );
  }

  let svg = [];
  svg.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${OUTPUT_SIZE}" height="${OUTPUT_SIZE}" viewBox="0 0 ${OUTPUT_SIZE} ${OUTPUT_SIZE}">`
  );

  // Render finder patterns
  for (const [fr, fc] of [
    [0, 0],
    [0, size - 7],
    [size - 7, 0],
  ]) {
    if (opts.roundedFinders) {
      // Rounded finder patterns
      const fx = (fc + margin) * moduleSize;
      const fy = (fr + margin) * moduleSize;
      const outerSize = 7 * moduleSize;
      const rOuter = moduleSize * 0.85;

      svg.push(
        `<rect x="${fx}" y="${fy}" width="${outerSize}" height="${outerSize}" rx="${rOuter}" ry="${rOuter}" fill="${MODULE_COLOR}"/>`
      );
      const gapX = fx + moduleSize;
      const gapY = fy + moduleSize;
      const gapSize = 5 * moduleSize;
      const rGap = moduleSize * 0.6;
      svg.push(
        `<rect x="${gapX}" y="${gapY}" width="${gapSize}" height="${gapSize}" rx="${rGap}" ry="${rGap}" fill="#1A1A1E"/>`
      );
      const innerX = fx + 2 * moduleSize;
      const innerY = fy + 2 * moduleSize;
      const innerSize = 3 * moduleSize;
      const rInner = moduleSize * 0.5;
      svg.push(
        `<rect x="${innerX}" y="${innerY}" width="${innerSize}" height="${innerSize}" rx="${rInner}" ry="${rInner}" fill="${MODULE_COLOR}"/>`
      );
    } else {
      // Standard square finder patterns (module-by-module)
      for (let r = fr; r < fr + 7; r++) {
        for (let c = fc; c < fc + 7; c++) {
          const idx = r * size + c;
          if (!data[idx]) continue;
          const x = (c + margin) * moduleSize;
          const y = (r + margin) * moduleSize;
          svg.push(
            `<rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" fill="${MODULE_COLOR}"/>`
          );
        }
      }
    }
  }

  // Render data modules (non-finder)
  // roundedDots: use rounded squares (rect with rx/ry ~35%) - looks styled but preserves
  // module fill area for reliable scanning. Pure circles leave too many gaps.
  const cornerR = moduleSize * 0.35;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const idx = r * size + c;
      if (!data[idx]) continue;
      if (isInFinder(r, c)) continue;
      if (opts.logo && r >= logoStart && r < logoEnd && c >= logoStart && c < logoEnd) continue;

      const x = (c + margin) * moduleSize;
      const y = (r + margin) * moduleSize;

      if (opts.roundedDots) {
        svg.push(
          `<rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" rx="${cornerR}" ry="${cornerR}" fill="${MODULE_COLOR}"/>`
        );
      } else {
        svg.push(
          `<rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" fill="${MODULE_COLOR}"/>`
        );
      }
    }
  }

  // Logo overlay
  if (opts.logo) {
    const logoPixelSize = logoModules * moduleSize;
    const cx = OUTPUT_SIZE / 2;
    const cy = OUTPUT_SIZE / 2;
    const bgR = logoPixelSize * 0.58;
    const fontSize = logoPixelSize * 0.75;

    svg.push(
      `<circle cx="${cx}" cy="${cy}" r="${bgR}" fill="#1A1A1E"/>`
    );
    svg.push(
      `<circle cx="${cx}" cy="${cy}" r="${bgR}" fill="none" stroke="${MODULE_COLOR}" stroke-width="${moduleSize * 0.4}" opacity="0.3"/>`
    );
    svg.push(
      `<text x="${cx}" y="${cy}" dy="-0.12em" font-family="'JetBrains Mono', monospace" font-size="${fontSize}" font-weight="600" fill="${MODULE_COLOR}" text-anchor="middle" dominant-baseline="central">g</text>`
    );
  }

  svg.push("</svg>");

  // Render SVG to PNG
  const svgBuffer = Buffer.from(svg.join("\n"));
  const pngBuffer = await sharp(svgBuffer)
    .resize(OUTPUT_SIZE, OUTPUT_SIZE)
    .png()
    .toBuffer();

  fs.writeFileSync(OUTPUT_PATH, pngBuffer);

  // Verify
  const scans = await verifyQR(OUTPUT_PATH);
  if (scans) {
    const label = [];
    if (opts.roundedDots) label.push("rounded dots");
    if (opts.logo) label.push("logo");
    console.log(`  PASS: QR scans (${label.join(" + ") || "standard"})`);
    console.log(`\nDone. QR saved to ${OUTPUT_PATH}\n`);
    return true;
  }

  console.log("  FAIL: Does not scan");
  return false;
}

async function verifyQR(filePath) {
  try {
    const jsQR = require("jsqr");

    // jsQR needs dark-on-light contrast. Cyan is too bright to register as "dark".
    // Negate + flatten to white converts colored modules to dark-on-white.
    const { data, info } = await sharp(filePath)
      .negate({ alpha: false })
      .flatten({ background: "#ffffff" })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const code = jsQR(
      new Uint8ClampedArray(data),
      info.width,
      info.height
    );

    if (code && code.data === TARGET_URL) return true;
    if (code) console.log(`    Decoded: "${code.data}"`);
    return false;
  } catch (err) {
    console.error(`    Verify error: ${err.message}`);
    return false;
  }
}

generateQR().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
