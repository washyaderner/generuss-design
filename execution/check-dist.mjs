#!/usr/bin/env node
// Deploy gate (pharallax recipe): fail if any sitemap URL has no built file
// in dist/ or its HTML carries a noindex robots meta. Run AFTER `npm run build`,
// BEFORE merging dev -> main (which IS the production deploy).
// Exit codes: 0 = clean, 1 = failures found, 2 = couldn't run (missing dist).

import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const DIST = new URL("../dist/", import.meta.url).pathname;
if (!existsSync(DIST)) {
  console.error("FAIL: dist/ not found. Run npm run build first.");
  process.exit(2);
}

// Collect URLs from sitemap-index + child sitemaps.
const urls = [];
const xmlFiles = readdirSync(DIST).filter(
  (f) => f.startsWith("sitemap") && f.endsWith(".xml"),
);
if (xmlFiles.length === 0) {
  console.error("FAIL: no sitemap*.xml in dist/.");
  process.exit(1);
}
for (const f of xmlFiles) {
  const xml = readFileSync(join(DIST, f), "utf8");
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const loc = m[1];
    if (loc.endsWith(".xml")) continue; // sitemap index entries
    urls.push(loc);
  }
}

let failures = 0;
for (const url of urls) {
  const path = new URL(url).pathname;
  // Astro static output: /foo -> dist/foo/index.html, / -> dist/index.html
  const candidates = [
    join(DIST, path, "index.html"),
    join(DIST, path.replace(/\/$/, "") + ".html"),
    join(DIST, path),
  ];
  const file = candidates.find((c) => existsSync(c) && !c.endsWith("/"));
  if (!file) {
    console.error(`FAIL 404: ${url} (no built file)`);
    failures++;
    continue;
  }
  const html = readFileSync(file, "utf8");
  if (/<meta[^>]+name=["']robots["'][^>]+noindex/i.test(html)) {
    console.error(`FAIL noindex: ${url}`);
    failures++;
  }
}

console.log(
  `${urls.length} sitemap URLs checked, ${failures} failures.` +
    (failures ? "" : " Gate clean."),
);
process.exit(failures ? 1 : 0);
