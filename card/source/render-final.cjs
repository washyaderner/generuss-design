#!/usr/bin/env node

/**
 * render-final.cjs - Business Card v11 Final Render Pipeline
 * Location: /Users/studio/Build/generuss-design/card/source/render-final.cjs
 *
 * Pipeline:
 *   1. Generate branded QR code (cyan rounded dots, "g" center, H error correction)
 *   2. Render front + back artwork via Puppeteer at 2079x1394px (600dpi)
 *   3. Embed 600dpi metadata via sharp
 *   4. Verify QR scans programmatically in rendered back artwork
 *   5. Output to ../print/
 *
 * Dependencies: puppeteer, sharp, qrcode, jsqr, pdf-lib
 *
 * Usage:
 *   node render-final.cjs               Full pipeline (QR + artwork + proofs)
 *   node render-final.cjs --skip-qr     Skip QR generation, use existing
 *   node render-final.cjs --qr-only     Only regenerate + verify QR code
 *   node render-final.cjs --verify-only Only scan-verify existing back artwork
 *   node render-final.cjs --masks       Also regenerate gloss mask PDFs
 */

const puppeteer = require("puppeteer");
const sharp = require("sharp");
const QRCode = require("qrcode");
const jsQR = require("jsqr");
const path = require("path");
const fs = require("fs");
const { PDFDocument } = require("pdf-lib");

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const FLAG_SKIP_QR = args.includes("--skip-qr");
const FLAG_QR_ONLY = args.includes("--qr-only");
const FLAG_VERIFY_ONLY = args.includes("--verify-only");
const FLAG_MASKS = args.includes("--masks");

// ---------------------------------------------------------------------------
// Config - Moo Super Business Card specs
// ---------------------------------------------------------------------------
const TRIM_W_MM = 84;
const TRIM_H_MM = 55;
const BLEED_MM = 2;
const TOTAL_W_MM = TRIM_W_MM + BLEED_MM * 2; // 88
const TOTAL_H_MM = TRIM_H_MM + BLEED_MM * 2; // 59
const DPI = 600;
const PX_PER_MM = DPI / 25.4;
const OUTPUT_W = Math.round(TOTAL_W_MM * PX_PER_MM); // 2079
const OUTPUT_H = Math.round(TOTAL_H_MM * PX_PER_MM); // 1394

// Viewport: CSS pixels, card fills 100vw x 100vh via isolateCard()
const VP_W = 800;
const SCALE = OUTPUT_W / VP_W; // ~2.599
const VP_H = Math.ceil(OUTPUT_H / SCALE); // 537 (overshoot, then crop)
const PROOF_SCALE = 2;

// QR config
const QR_URL = "https://generussdesign.com/connect";
const QR_SIZE = 1083;
const QR_COLOR = "#00e5ff";

// Paths
const HTML_PATH = path.resolve(__dirname, "business-card-v16.html");
const QR_PATH = path.resolve(__dirname, "qr-code.png");
const CARD_DIR = path.resolve(__dirname, "..");
const OUT_DIR = path.join(CARD_DIR, "print");
const PROOF_DIR = path.join(CARD_DIR, "proofs");

// ---------------------------------------------------------------------------
// QR Generation
// ---------------------------------------------------------------------------
async function generateBrandedQR() {
  console.log("\n[1] Generating branded QR code...");
  console.log(`  URL:  ${QR_URL}`);
  console.log(`  Size: ${QR_SIZE}px, EC level H`);

  const qr = QRCode.create(QR_URL, { errorCorrectionLevel: "H" });
  const size = qr.modules.size;
  const data = qr.modules.data;
  const margin = 1;
  const totalSize = size + margin * 2;
  const moduleSize = QR_SIZE / totalSize;
  const cornerR = moduleSize * 0.35;

  // Logo dead zone (center ~18%)
  const logoModules = Math.floor(size * 0.18);
  const logoStart = Math.floor((size - logoModules) / 2);
  const logoEnd = logoStart + logoModules;

  function isInFinder(r, c) {
    return (
      (r < 7 && c < 7) ||
      (r < 7 && c >= size - 7) ||
      (r >= size - 7 && c < 7)
    );
  }

  let svg = [];
  svg.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${QR_SIZE}" height="${QR_SIZE}" viewBox="0 0 ${QR_SIZE} ${QR_SIZE}">`
  );

  // Standard square finder patterns (critical for scanning reliability)
  for (const [fr, fc] of [[0, 0], [0, size - 7], [size - 7, 0]]) {
    for (let r = fr; r < fr + 7; r++) {
      for (let c = fc; c < fc + 7; c++) {
        const idx = r * size + c;
        if (!data[idx]) continue;
        const x = (c + margin) * moduleSize;
        const y = (r + margin) * moduleSize;
        svg.push(
          `<rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" fill="${QR_COLOR}"/>`
        );
      }
    }
  }

  // Data modules as rounded squares
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const idx = r * size + c;
      if (!data[idx]) continue;
      if (isInFinder(r, c)) continue;
      if (r >= logoStart && r < logoEnd && c >= logoStart && c < logoEnd)
        continue;

      const x = (c + margin) * moduleSize;
      const y = (r + margin) * moduleSize;
      svg.push(
        `<rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" rx="${cornerR}" ry="${cornerR}" fill="${QR_COLOR}"/>`
      );
    }
  }

  // Center "g" logo
  const logoPixelSize = logoModules * moduleSize;
  const cx = QR_SIZE / 2;
  const cy = QR_SIZE / 2;
  const bgR = logoPixelSize * 0.58;
  const fontSize = logoPixelSize * 0.75;

  svg.push(`<circle cx="${cx}" cy="${cy}" r="${bgR}" fill="#1A1A1E"/>`);
  svg.push(
    `<circle cx="${cx}" cy="${cy}" r="${bgR}" fill="none" stroke="${QR_COLOR}" stroke-width="${moduleSize * 0.4}" opacity="0.3"/>`
  );
  svg.push(
    `<text x="${cx}" y="${cy}" dy="-0.12em" font-family="'JetBrains Mono', monospace" font-size="${fontSize}" font-weight="600" fill="${QR_COLOR}" text-anchor="middle" dominant-baseline="central">g</text>`
  );
  svg.push("</svg>");

  // Render SVG to transparent PNG
  const pngBuffer = await sharp(Buffer.from(svg.join("\n")))
    .resize(QR_SIZE, QR_SIZE)
    .png()
    .toBuffer();

  fs.writeFileSync(QR_PATH, pngBuffer);

  // Verify
  const decoded = await scanQR(QR_PATH);
  if (decoded === QR_URL) {
    console.log(`  PASS: QR decodes to "${decoded}"`);
  } else {
    console.error(
      `  FAIL: QR decode = "${decoded || "none"}" (expected "${QR_URL}")`
    );
    process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// QR Scanning (negate+flatten for cyan-on-transparent)
// ---------------------------------------------------------------------------
async function scanQR(filePath, region) {
  try {
    let pipeline = sharp(filePath);
    if (region) pipeline = pipeline.extract(region);

    const { data, info } = await pipeline
      .negate({ alpha: false })
      .flatten({ background: "#ffffff" })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const code = jsQR(new Uint8ClampedArray(data), info.width, info.height);
    return code ? code.data : null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Puppeteer page setup + card isolation
// ---------------------------------------------------------------------------
async function setupPage(browser, scale) {
  const page = await browser.newPage();
  await page.setViewport({
    width: VP_W,
    height: VP_H,
    deviceScaleFactor: scale,
  });
  await page.goto(`file://${HTML_PATH}`, { waitUntil: "networkidle0" });
  await page.evaluateHandle("document.fonts.ready");
  await page.waitForFunction(
    () => {
      const el = document.getElementById("email-line");
      return el && el.textContent && el.textContent.includes("@");
    },
    { timeout: 5000 }
  );
  return page;
}

async function isolateCard(page, side) {
  await page.evaluate((s) => {
    document.body.style.cssText =
      "margin:0;padding:0;gap:0;min-height:auto;background:#1A1A1E;overflow:hidden;";

    document
      .querySelectorAll(".page-header,.side-label,.notes")
      .forEach((el) => (el.style.display = "none"));

    document.querySelectorAll(".card").forEach((c) => {
      if (s === "front" && c.classList.contains("back"))
        c.style.display = "none";
      if (s === "back" && c.classList.contains("front"))
        c.style.display = "none";
    });

    const card = document.querySelector(`.card.${s}`);
    card.style.cssText = `
      width:100vw;height:100vh;position:fixed;top:0;left:0;
      border-radius:0;z-index:9999;overflow:hidden;
    `;
  }, side);
}

// ---------------------------------------------------------------------------
// Artwork rendering
// ---------------------------------------------------------------------------
async function renderArtwork(browser, side) {
  console.log(`  Rendering ${side} artwork...`);
  const page = await setupPage(browser, SCALE);
  await isolateCard(page, side);
  await new Promise((r) => setTimeout(r, 300));

  const rawPath = path.join(OUT_DIR, `${side}-artwork-raw.png`);
  await page.screenshot({
    path: rawPath,
    type: "png",
    clip: { x: 0, y: 0, width: VP_W, height: VP_H },
  });
  await page.close();

  // Crop to exact dimensions + embed 600dpi metadata
  const outPath = path.join(OUT_DIR, `${side}-artwork.png`);
  await sharp(rawPath)
    .extract({ left: 0, top: 0, width: OUTPUT_W, height: OUTPUT_H })
    .withMetadata({ density: DPI })
    .toFile(outPath);
  fs.unlinkSync(rawPath);

  const info = await sharp(outPath).metadata();
  console.log(
    `    ${info.width}x${info.height} @ ${info.density}dpi (${(fs.statSync(outPath).size / 1024).toFixed(0)} KB)`
  );
}

// ---------------------------------------------------------------------------
// Proof rendering (screen-res)
// ---------------------------------------------------------------------------
async function renderProof(browser, side) {
  console.log(`  Rendering ${side} proof...`);
  const page = await setupPage(browser, PROOF_SCALE);
  await isolateCard(page, side);
  await new Promise((r) => setTimeout(r, 300));

  const rawPath = path.join(PROOF_DIR, `${side}-proof-raw.png`);
  await page.screenshot({
    path: rawPath,
    type: "png",
    clip: { x: 0, y: 0, width: VP_W, height: VP_H },
  });
  await page.close();

  const outPath = path.join(PROOF_DIR, `${side}-proof.png`);
  const proofW = VP_W * PROOF_SCALE;
  const proofH = Math.round(proofW * (TOTAL_H_MM / TOTAL_W_MM));
  await sharp(rawPath)
    .extract({ left: 0, top: 0, width: proofW, height: proofH })
    .toFile(outPath);
  fs.unlinkSync(rawPath);

  const info = await sharp(outPath).metadata();
  console.log(`    ${info.width}x${info.height}`);
}

// ---------------------------------------------------------------------------
// Gloss mask extraction + rendering (--masks flag only)
// ---------------------------------------------------------------------------
async function extractFrontGloss(page) {
  return page.evaluate(() => {
    const glow = document.querySelector(".glow-line");
    const gr = glow.getBoundingClientRect();
    const dots = [...document.querySelectorAll(".dot-lit")];
    const ctaAction = document.querySelector(".cta-action");
    const cr = ctaAction.getBoundingClientRect();
    const ctaStyle = window.getComputedStyle(ctaAction);

    return {
      glowLine: { x: gr.x, y: gr.y, w: gr.width, h: gr.height },
      litDots: dots.map((d) => {
        const r = d.getBoundingClientRect();
        return { x: r.x, y: r.y, w: r.width, h: r.height };
      }),
      ctaAction: {
        x: cr.x, y: cr.y, w: cr.width, h: cr.height,
        text: ctaAction.textContent,
        fontSize: ctaStyle.fontSize,
        fontWeight: ctaStyle.fontWeight,
        letterSpacing: ctaStyle.letterSpacing,
      },
    };
  });
}

async function extractBackGloss(page) {
  return page.evaluate(() => {
    const weapon = document.querySelector(".tagline-weapon");
    const wr = weapon.getBoundingClientRect();
    const pulseDots = [...document.querySelectorAll(".back-dot-pulse")];
    const hbSvg = document.querySelector(".heartbeat-svg");
    const hr = hbSvg.getBoundingClientRect();
    const sepDots = [...document.querySelectorAll(".sep-dot")];

    return {
      thatConvert: { x: wr.x, y: wr.y, w: wr.width, h: wr.height },
      pulseDots: pulseDots.map((d) => {
        const r = d.getBoundingClientRect();
        return { x: r.x, y: r.y, w: r.width, h: r.height };
      }),
      heartbeat: { x: hr.x, y: hr.y, w: hr.width, h: hr.height },
      sepDots: sepDots.map((d) => {
        const r = d.getBoundingClientRect();
        return { x: r.x, y: r.y, w: r.width, h: r.height };
      }),
    };
  });
}

function buildFrontMaskHtml(els) {
  const bloom = 0.5;
  let h = `<!DOCTYPE html><html><head>`;
  h += `<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@600&display=swap" rel="stylesheet">`;
  h += `</head><body style="margin:0;padding:0;background:#000;width:${VP_W}px;height:${VP_H}px;overflow:hidden;position:relative;">`;

  const g = els.glowLine;
  h += `<div style="position:absolute;left:${g.x - bloom}px;top:${g.y - bloom}px;width:${g.w + bloom * 2}px;height:${g.h + bloom * 2}px;background:#fff;border-radius:2px;"></div>`;

  for (const d of els.litDots) {
    h += `<div style="position:absolute;left:${d.x}px;top:${d.y}px;width:${d.w}px;height:${d.h}px;background:#fff;border-radius:50%;"></div>`;
  }

  const cta = els.ctaAction;
  h += `<span style="position:absolute;left:${cta.x}px;top:${cta.y}px;`;
  h += `font-family:'JetBrains Mono',monospace;font-size:${cta.fontSize};font-weight:${cta.fontWeight};`;
  h += `letter-spacing:${cta.letterSpacing};text-transform:uppercase;`;
  h += `color:#fff;line-height:${cta.h}px;white-space:nowrap;">${cta.text}</span>`;

  h += `</body></html>`;
  return h;
}

function buildBackMaskHtml(els) {
  let h = `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#000;width:${VP_W}px;height:${VP_H}px;overflow:hidden;position:relative;">`;

  const tc = els.thatConvert;
  h += `<div style="position:absolute;left:${tc.x}px;top:${tc.y}px;width:${tc.w}px;height:${tc.h}px;background:#fff;"></div>`;

  for (const d of els.pulseDots) {
    h += `<div style="position:absolute;left:${d.x}px;top:${d.y}px;width:${d.w}px;height:${d.h}px;background:#fff;border-radius:50%;"></div>`;
  }

  const hb = els.heartbeat;
  h += `<svg style="position:absolute;left:${hb.x}px;top:${hb.y}px;width:${hb.w}px;height:${hb.h}px;" viewBox="0 0 200 24" fill="none" xmlns="http://www.w3.org/2000/svg">`;
  h += `<path d="M 118 12 L 128 3 L 136 20 L 142 8 L 150 12" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
  h += `</svg>`;

  for (const d of els.sepDots) {
    h += `<div style="position:absolute;left:${d.x}px;top:${d.y}px;width:${d.w}px;height:${d.h}px;background:#fff;border-radius:50%;"></div>`;
  }

  h += `</body></html>`;
  return h;
}

async function renderGlossMask(browser, side) {
  console.log(`  Rendering ${side} gloss mask...`);

  const extractPage = await setupPage(browser, SCALE);
  await isolateCard(extractPage, side);
  await new Promise((r) => setTimeout(r, 300));

  const elements =
    side === "front"
      ? await extractFrontGloss(extractPage)
      : await extractBackGloss(extractPage);
  await extractPage.close();

  const maskHtml =
    side === "front"
      ? buildFrontMaskHtml(elements)
      : buildBackMaskHtml(elements);

  const maskPage = await browser.newPage();
  await maskPage.setViewport({
    width: VP_W,
    height: VP_H,
    deviceScaleFactor: SCALE,
  });
  await maskPage.setContent(maskHtml, { waitUntil: "networkidle0" });
  await maskPage.evaluateHandle("document.fonts.ready");
  await new Promise((r) => setTimeout(r, 300));

  const rawMaskPath = path.join(OUT_DIR, `${side}-gloss-mask-raw.png`);
  await maskPage.screenshot({
    path: rawMaskPath,
    type: "png",
    clip: { x: 0, y: 0, width: VP_W, height: VP_H },
  });
  await maskPage.close();

  const pngPath = path.join(OUT_DIR, `${side}-gloss-mask.png`);
  await sharp(rawMaskPath)
    .extract({ left: 0, top: 0, width: OUTPUT_W, height: OUTPUT_H })
    .grayscale()
    .threshold(128)
    .toFile(pngPath);
  fs.unlinkSync(rawMaskPath);

  const pdfPath = path.join(OUT_DIR, `${side}-gloss-mask.pdf`);
  await pngToPdf(pngPath, pdfPath);

  const verifyPng = path.join(PROOF_DIR, `${side}-gloss-mask-verify.png`);
  fs.renameSync(pngPath, verifyPng);
  console.log(`    ${pdfPath}`);
}

async function pngToPdf(pngPath, pdfPath) {
  const pdfDoc = await PDFDocument.create();
  const pngBytes = fs.readFileSync(pngPath);
  const pngImage = await pdfDoc.embedPng(pngBytes);
  const wPt = TOTAL_W_MM * 2.8346;
  const hPt = TOTAL_H_MM * 2.8346;
  const page = pdfDoc.addPage([wPt, hPt]);
  page.drawImage(pngImage, { x: 0, y: 0, width: wPt, height: hPt });
  fs.writeFileSync(pdfPath, await pdfDoc.save());
}

// ---------------------------------------------------------------------------
// Back artwork QR verification
// ---------------------------------------------------------------------------
async function verifyBackQR() {
  const backArtwork = path.join(OUT_DIR, "back-artwork.png");
  if (!fs.existsSync(backArtwork)) {
    console.log("  SKIP: back-artwork.png not found");
    return false;
  }

  const meta = await sharp(backArtwork).metadata();
  const qrRegionW = Math.round(meta.width * 0.28);
  const decoded = await scanQR(backArtwork, {
    left: 0,
    top: 0,
    width: qrRegionW,
    height: meta.height,
  });

  if (decoded === QR_URL) {
    console.log(`  PASS: QR decodes to "${decoded}"`);
    return true;
  }

  console.log(`  WARN: Decoded "${decoded || "none"}" (expected "${QR_URL}")`);
  return false;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const flags = [];
  if (FLAG_QR_ONLY) flags.push("--qr-only");
  if (FLAG_SKIP_QR) flags.push("--skip-qr");
  if (FLAG_VERIFY_ONLY) flags.push("--verify-only");
  if (FLAG_MASKS) flags.push("--masks");

  console.log(`\nBusiness Card v11 - Final Render`);
  console.log("~".repeat(40));
  if (flags.length) console.log(`Flags:   ${flags.join(" ")}`);
  console.log(`Source:  ${HTML_PATH}`);
  console.log(`Output:  ${OUT_DIR}/`);
  console.log(`Canvas:  ${TOTAL_W_MM}x${TOTAL_H_MM}mm (${OUTPUT_W}x${OUTPUT_H}px @ ${DPI}dpi)`);
  console.log(`QR URL:  ${QR_URL}`);
  console.log(`Scale:   ${SCALE.toFixed(3)}x\n`);

  // --verify-only
  if (FLAG_VERIFY_ONLY) {
    console.log("[Verify] Scanning back artwork for QR...");
    const ok = await verifyBackQR();
    process.exit(ok ? 0 : 1);
  }

  // QR generation (unless --skip-qr)
  if (!FLAG_SKIP_QR) {
    await generateBrandedQR();
  } else {
    if (fs.existsSync(QR_PATH)) {
      console.log(`[1] Using existing QR: ${QR_PATH}`);
    } else {
      console.error(`ERROR: --skip-qr but ${QR_PATH} not found`);
      process.exit(1);
    }
  }

  // --qr-only
  if (FLAG_QR_ONLY) {
    console.log(`\nDone. QR saved to ${QR_PATH}`);
    return;
  }

  // Full render
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(PROOF_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    console.log("\n[2] Rendering artwork...");
    await renderArtwork(browser, "front");
    await renderArtwork(browser, "back");

    if (FLAG_MASKS) {
      console.log("\n[3] Rendering gloss masks...");
      await renderGlossMask(browser, "front");
      await renderGlossMask(browser, "back");
    }

    console.log("\n[4] Rendering proofs...");
    await renderProof(browser, "front");
    await renderProof(browser, "back");

    console.log("\n[5] Verifying QR in back artwork...");
    await verifyBackQR();
  } finally {
    await browser.close();
  }

  // Summary
  console.log("\n" + "~".repeat(40));
  console.log("COMPLETE");
  const printFiles = fs.readdirSync(OUT_DIR).filter((f) => !f.startsWith("."));
  for (const f of printFiles) {
    const s = fs.statSync(path.join(OUT_DIR, f));
    console.log(`  ${f} (${(s.size / 1024).toFixed(0)} KB)`);
  }
  if (!FLAG_MASKS) {
    console.log("\n  Gloss masks unchanged (use --masks to regenerate).");
  }
}

main().catch((err) => {
  console.error(`\nFatal: ${err.message}`);
  console.error(err.stack);
  process.exit(1);
});
