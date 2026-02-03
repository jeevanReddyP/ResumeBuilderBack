const puppeteer = require("puppeteer")

const classic = require("../utils/resumeTemplates/classic")
const minimal = require("../utils/resumeTemplates/minimal")
const modern = require("../utils/resumeTemplates/modern")

async function generateResumePDF(resume, templateId = "classic", theme = {}) {
    let html

    switch (templateId) {
        case "modern":
            html = modern(resume, theme);
            break;
        case "minimal":
            html = minimal(resume, theme);
            break;

        default:
            html = classic(resume, theme)
    }

    const browser = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    })

    const page = await browser.newPage()

    await page.setContent(html, {
        waitUntil: "networkidle0"
    })
    const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true
    });

    await browser.close();

    return pdfBuffer;
}

module.exports = generateResumePDF;