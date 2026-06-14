// Screenshot harness for before/after design comparison.
// Usage: node .design/shoot.js <outDir>   e.g. node .design/shoot.js baseline
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const BASE = process.env.BASE_URL || "http://localhost:3000";
const outDir = path.join(__dirname, process.argv[2] || "shots");

const ROUTES = [
  ["home", "/"],
  ["services", "/services"],
  ["why-viewnear", "/why-viewnear"],
  ["security", "/security"],
  ["about", "/about"],
  ["industries", "/industries"],
  ["industry-healthcare", "/industries/healthcare"],
  ["industry-financial", "/industries/financial-services"],
  ["case-studies", "/case-studies"],
  ["blog", "/blog"],
  ["news", "/news"],
  ["careers", "/careers"],
  ["contact", "/contact"],
  ["brand", "/brand"],
  ["learning", "/learning"],
  ["videos", "/videos"],
];

const VIEWPORTS = [
  ["desktop", 1440, 900],
  ["mobile", 390, 844],
];

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  for (const [vp, w, h] of VIEWPORTS) {
    const ctx = await browser.newContext({
      viewport: { width: w, height: h },
      deviceScaleFactor: vp === "mobile" ? 2 : 1,
    });
    const page = await ctx.newPage();
    for (const [name, route] of ROUTES) {
      try {
        await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 30000 });
        // Scroll through the page so IntersectionObserver-based scroll-reveal
        // (the .reveal → .is-visible animation) fires for below-fold content;
        // otherwise a fullPage capture shows revealed sections at opacity 0.
        await page.evaluate(async () => {
          const step = Math.round(window.innerHeight * 0.8);
          for (let y = 0; y < document.body.scrollHeight; y += step) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 120));
          }
          window.scrollTo(0, 0);
        });
        // let fonts + reveal transitions settle
        await page.waitForTimeout(900);
        const file = path.join(outDir, `${name}.${vp}.png`);
        await page.screenshot({ path: file, fullPage: true });
        console.log("✓", `${name}.${vp}`);
      } catch (e) {
        console.log("✗", `${name}.${vp}`, e.message.split("\n")[0]);
      }
    }
    await ctx.close();
  }
  await browser.close();
  console.log("done →", outDir);
})();
