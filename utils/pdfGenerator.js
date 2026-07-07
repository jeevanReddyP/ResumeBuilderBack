const chromium = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-core");

const classic = require("../utils/resumeTemplates/classic");
const minimal = require("../utils/resumeTemplates/minimal");
const modern = require("../utils/resumeTemplates/modern");

async function generateResumePDF(
  resume,
  templateId = "classic",
  theme = "light"
) {
  const themeObj =
    typeof theme === "string" ? { mode: theme } : theme || {};

  let html = "";

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

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });

  try {
    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "16px",
        right: "16px",
        bottom: "16px",
        left: "16px",
      },
    });

    return pdfBuffer;
  } finally {
    await browser.close();
  }
}

module.exports = generateResumePDF;