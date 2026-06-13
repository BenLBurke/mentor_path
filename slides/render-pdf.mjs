import puppeteer from "puppeteer";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
const page = await browser.newPage();
await page.goto(`file://${join(__dirname, "mentorpath-deck.html")}`, {
  waitUntil: "networkidle0",
  timeout: 30000,
});

await page.setViewport({ width: 1280, height: 720 });

const outPath = join(__dirname, "MentorPath-Deck.pdf");
await page.pdf({
  path: outPath,
  width: "1280px",
  height: "720px",
  printBackground: true,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
  preferCSSPageSize: true,
});

await browser.close();
console.log(`PDF saved to ${outPath}`);
