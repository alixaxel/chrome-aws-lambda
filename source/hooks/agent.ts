import { Page } from 'puppeteer-core';

/**
 * Removes `Headless` from the User Agent string, if present.
 *
 * @param page - Page to hook to.
 */
export = async function (page: Page): Promise<Page> {
  let result = await page.browser().userAgent();

  if (result.includes('Headless') === true) {
    await page.setUserAgent(result.replace('Headless', ''));
  }

  return page;
};
