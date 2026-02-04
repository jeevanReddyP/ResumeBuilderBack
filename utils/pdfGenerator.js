const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

const classic = require("../utils/resumeTemplates/classic");
const minimal = require("../utils/resumeTemplates/minimal");
const modern = require("../utils/resumeTemplates/modern");

async function generateResumePDF(resume, templateId = "classic", theme = {}) {
  let html;

  switch (templateId) {
    case "modern":
      html = modern(resume, theme);
      break;
    case "minimal":
      html = minimal(resume, theme);
      break;
    default:
      html = classic(resume, theme);
  }

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(), // ✅ this fixes Render
    headless: chromium.headless,
  });

  try {
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "16px", right: "16px", bottom: "16px", left: "16px" },
    });

    return pdfBuffer;
  } finally {
    await browser.close();
  }
}

module.exports = generateResumePDF;
