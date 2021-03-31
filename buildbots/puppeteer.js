const chromium = require('../build/');

exports.handler = async (event, context) => {
  let browser = null;

  try {
    const browser = await chromium.puppeteer.launch({
      executablePath: await chromium.executablePath,
      defaultViewport: chromium.defaultViewport,
      args: chromium.args,
    });

    const page = await browser.newPage();
    await page.goto(event.url);
    const data = await page.screenshot();
    if (data.length === 0) {
      throw new Error(`Screenshot is empty`);
    }
    console.log('Page title: ', await page.title());
  } catch (error) {
    throw error;
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
};