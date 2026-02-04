const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

const classic = require("../utils/resumeTemplates/classic");
const minimal = require("../utils/resumeTemplates/minimal");
const modern = require("../utils/resumeTemplates/modern");

async function generateResumePDF(resume, templateId = "classic", theme = "light") {
  const themeObj = typeof theme === "string" ? { mode: theme } : (theme || {});

  let html = "";
  try {
    switch (templateId) {
      case "modern":
        html = modern(resume, themeObj);
        break;
      case "minimal":
        html = minimal(resume, themeObj);
        break;
      default:
        html = classic(resume, themeObj);
    }
  } catch (e) {
    console.error("❌ TEMPLATE FUNCTION CRASH:", e);
    throw new Error("Template function crashed: " + e.message);
  }

  if (!html || typeof html !== "string") {
    throw new Error("Template returned empty HTML");
  }

  const executablePath = await chromium.executablePath();
  if (!executablePath) throw new Error("Chromium executablePath not found");

  const browser = await puppeteer.launch({
    executablePath,
    headless: chromium.headless,
    args: [
      ...chromium.args,
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--single-process",
      "--no-zygote",
      "--disable-gpu",
    ],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "domcontentloaded" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "16px", right: "16px", bottom: "16px", left: "16px" },
    });

    return pdfBuffer;
  } catch (e) {
    console.error("❌ PUPPETEER PDF ERROR:", e);
    throw new Error("Puppeteer failed: " + e.message);
  } finally {
    await browser.close();
  }
}

module.exports = generateResumePDF;
