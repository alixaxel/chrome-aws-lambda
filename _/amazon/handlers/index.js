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

    const contexts = [
      browser.defaultBrowserContext(),
    ];

    while (contexts.length < event.length) {
      contexts.push(await browser.createIncognitoBrowserContext());
    }

    for (let context of contexts) {
      const job = event.shift();
      const page = await context.defaultPage();

      if (job.hasOwnProperty('url') === true) {
        await page.goto(job.url, { waitUntil: ['domcontentloaded', 'load'] });

        if (job.hasOwnProperty('expected') === true) {
          if (job.expected.hasOwnProperty('title') === true) {
            ok(await page.title() === job.expected.title, `Title assertion failed.`);
          }

          if (job.expected.hasOwnProperty('screenshot') === true) {
            ok(createHash('sha1').update((await page.screenshot()).toString('base64')).digest('hex') === event.expected.screenshot, `Screenshot assertion failed.`);
          }
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
