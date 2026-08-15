#!/usr/bin/env node
/**
 * Brand SVG integrity check.
 *
 * Guards the two rendering bugs found in the Focus Lab logo files, both of
 * which were invisible in source review and only showed up on screen:
 *
 *   CLIP    — declared viewBox smaller than the artwork, so glyphs render
 *             off-canvas. `focus-lab-compact-*.svg` hid PRODUCTIONS this way
 *             for 317 units; `favicon.svg` shaved its blades on all four edges.
 *
 *   OVERLAP — a rule/divider `<line>` crossing a text path's box, which reads
 *             as a strike-through. A bounds check alone does not catch this:
 *             the offending element was comfortably inside the viewBox.
 *
 * Geometry comes from the browser's own `getBBox()` rather than a hand-rolled
 * path parser, so arcs and transforms are measured exactly as they render.
 *
 * Usage:  node scripts/check-svg-bounds.mjs [--json] [dir ...]
 * Exit:   0 clean, 1 problems found, 2 could not run
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const DEFAULT_DIRS = ["public/brand", "LOGOS"];
const args = process.argv.slice(2);
const asJson = args.includes("--json");
const dirs = args.filter((a) => !a.startsWith("--"));
const roots = dirs.length ? dirs : DEFAULT_DIRS;

/** Tolerance in user units. Absorbs float noise without hiding a real clip. */
const CLIP_TOLERANCE = 0.5;
/** How deep a line must sit inside a text box before it counts as a strike. */
const OVERLAP_TOLERANCE = 1.0;

function collect(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.toLowerCase().endsWith(".svg"))
    .map((f) => join(dir, f))
    .sort();
}

const files = roots.flatMap(collect);
if (!files.length) {
  console.error(`No SVGs found in: ${roots.join(", ")}`);
  process.exit(2);
}

let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  console.error("playwright is required for this check (npm install)");
  process.exit(2);
}

const launch = {};
if (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH) {
  launch.executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
}

let browser;
try {
  browser = await chromium.launch(launch);
} catch (error) {
  console.error(`Could not launch chromium: ${error.message}`);
  console.error("Set PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH if using a system browser.");
  process.exit(2);
}

const page = await browser.newPage();
await page.setContent("<body></body>");

const report = [];

for (const file of files) {
  const markup = readFileSync(file, "utf8");
  const result = await page.evaluate(
    ([svgMarkup, clipTol, overlapTol]) => {
      document.body.innerHTML = svgMarkup;
      const svg = document.querySelector("svg");
      if (!svg) return { error: "no <svg> root" };

      const viewBox = svg.getAttribute("viewBox");
      if (!viewBox) return { error: "no viewBox attribute" };
      const [vx, vy, vw, vh] = viewBox.trim().split(/[\s,]+/).map(Number);
      if ([vx, vy, vw, vh].some((n) => !Number.isFinite(n)) || vw <= 0 || vh <= 0) {
        return { error: `unparseable viewBox "${viewBox}"` };
      }

      const round = (n) => Math.round(n * 100) / 100;
      const rootCTM = svg.getCTM();

      /**
       * Bounding box in the ROOT's user space.
       *
       * `getBBox()` alone reports coordinates in the element's own space, which
       * ignores any transform on an ancestor `<g>` — the mark sits inside a
       * translated, scaled group, so raw child boxes would be compared against
       * the viewBox in the wrong coordinate system entirely.
       */
      const box = (el) => {
        const b = el.getBBox();
        let m = null;
        try {
          const ctm = el.getCTM();
          if (ctm && rootCTM) m = rootCTM.inverse().multiply(ctm);
        } catch { /* fall through to untransformed */ }
        if (!m) return { x1: b.x, y1: b.y, x2: b.x + b.width, y2: b.y + b.height };
        const pt = svg.createSVGPoint();
        const xs = [], ys = [];
        for (const [px, py] of [[b.x, b.y], [b.x + b.width, b.y], [b.x, b.y + b.height], [b.x + b.width, b.y + b.height]]) {
          pt.x = px; pt.y = py;
          const p = pt.matrixTransform(m);
          xs.push(p.x); ys.push(p.y);
        }
        return { x1: Math.min(...xs), y1: Math.min(...ys), x2: Math.max(...xs), y2: Math.max(...ys) };
      };

      const issues = [];

      // ── CLIP: does anything render outside the declared canvas? ──
      const content = box(svg);
      const over = {
        left: vx - content.x1,
        top: vy - content.y1,
        right: content.x2 - (vx + vw),
        bottom: content.y2 - (vy + vh),
      };
      for (const [edge, amount] of Object.entries(over)) {
        if (amount > clipTol) {
          issues.push({
            kind: "CLIP",
            edge,
            amount: round(amount),
            detail: `artwork extends ${round(amount)}u past the ${edge} edge of viewBox "${viewBox}"`,
          });
        }
      }

      // Name the specific elements that fall outside, so the fix is obvious.
      for (const el of svg.querySelectorAll("[aria-label], line, path, rect, circle, ellipse, g")) {
        if (el.closest("defs")) continue;
        let b;
        try { b = box(el); } catch { continue; }
        if (b.x2 - b.x1 === 0 && b.y2 - b.y1 === 0) continue;
        const outside =
          b.x2 - (vx + vw) > clipTol || vx - b.x1 > clipTol ||
          b.y2 - (vy + vh) > clipTol || vy - b.y1 > clipTol;
        if (outside) {
          issues.push({
            kind: "OUT_OF_BOUNDS",
            element: `${el.tagName}#${el.getAttribute("id") ?? "?"}`,
            label: el.getAttribute("aria-label")?.trim().slice(0, 32) || null,
            detail: `x ${round(b.x1)}→${round(b.x2)}  y ${round(b.y1)}→${round(b.y2)}`,
          });
        }
      }

      // ── OVERLAP: a rule crossing lettering reads as a strike-through. ──
      const texts = [...svg.querySelectorAll("[aria-label]")].map((el) => ({
        label: el.getAttribute("aria-label").trim().slice(0, 32),
        id: el.getAttribute("id") ?? "?",
        ...box(el),
      }));
      for (const line of svg.querySelectorAll("line")) {
        if (line.closest("defs")) continue;
        const raw = box(line);
        // A horizontal rule has zero bbox height, so an area test would never
        // fire on the exact bug this check exists to catch. Inflate by the
        // stroke so the box matches what is actually painted.
        const sw = parseFloat(line.getAttribute("stroke-width") || getComputedStyle(line).strokeWidth) || 1;
        const pad = Math.max(sw / 2, 0.5);
        const lb = { x1: raw.x1 - pad, y1: raw.y1 - pad, x2: raw.x2 + pad, y2: raw.y2 + pad };
        for (const t of texts) {
          const ox = Math.min(lb.x2, t.x2) - Math.max(lb.x1, t.x1);
          const oy = Math.min(lb.y2, t.y2) - Math.max(lb.y1, t.y1);
          if (ox > overlapTol && oy > overlapTol) {
            issues.push({
              kind: "OVERLAP",
              element: `line#${line.getAttribute("id") ?? "?"}`,
              detail:
                `crosses "${t.label}" (#${t.id}) by ${round(ox)}u horizontally — ` +
                `a divider should sit clear of the lettering`,
            });
          }
        }
      }

      return {
        viewBox,
        content: { x1: round(content.x1), y1: round(content.y1), x2: round(content.x2), y2: round(content.y2) },
        issues,
      };
    },
    [markup, CLIP_TOLERANCE, OVERLAP_TOLERANCE],
  );

  report.push({ file, ...result });
}

await browser.close();

if (asJson) {
  console.log(JSON.stringify(report, null, 2));
} else {
  for (const r of report) {
    const bad = r.error || r.issues.length;
    console.log(`${bad ? "FAIL" : "ok  "}  ${relative(process.cwd(), r.file)}`);
    if (r.error) {
      console.log(`        ${r.error}`);
      continue;
    }
    if (!r.issues.length) {
      console.log(`        viewBox "${r.viewBox}"  content x ${r.content.x1}→${r.content.x2}  y ${r.content.y1}→${r.content.y2}`);
      continue;
    }
    for (const i of r.issues) {
      const head = i.element ? `${i.kind} ${i.element}` : i.kind;
      console.log(`        ${head}: ${i.detail}`);
    }
  }
}

const failed = report.filter((r) => r.error || r.issues.length);
if (failed.length) {
  console.error(`\n${failed.length} of ${report.length} SVG file(s) have problems.`);
  console.error("Fix the viewBox bounds or reposition the offending element, then re-run.");
  process.exit(1);
}
console.log(`\nAll ${report.length} SVG files are within their declared bounds.`);
