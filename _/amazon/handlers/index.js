const { ok } = require('assert');
const { createHash } = require('crypto');
const chromium = require('chrome-aws-lambda');

exports.handler = async (event, context) => {
  let browser = null;

  try {
    const browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.defaultPage();

    if (event.hasOwnProperty('url') === true) {
      await page.goto(event.url, {
        waitUntil: ['domcontentloaded', 'load'],
      });

      if (event.hasOwnProperty('expected') === true) {
        if (event.expected.hasOwnProperty('title') === true) {
          ok(await page.title() === event.expected.title, `Title assertion failed.`);
        }

        if (event.expected.hasOwnProperty('screenshot') === true) {
          ok(createHash('sha1').update((await page.screenshot()).toString('base64')).digest('hex') === event.expected.screenshot, `Screenshot assertion failed.`);
        }
      }
    }
  } catch (error) {
    throw error.message;
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }

  return true;
};
