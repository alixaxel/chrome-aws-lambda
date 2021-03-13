import { Page } from 'puppeteer-core';

/**
 * Removes global `webdriver` property to mimic headful Chrome.
 *
 * @param page - Page to hook to.
 */
export = async function (page: Page): Promise<Page> {
  await page.evaluateOnNewDocument(() => {
    delete Object.getPrototypeOf(navigator).webdriver;
  });

  return page;
}
