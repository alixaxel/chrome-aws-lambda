import { Page } from 'puppeteer-core';

/**
 * Removes global `webdriver` property to mimic headful Chrome.
 *
 * @param page - Page to hook to.
 */
export = async function (page: Page): Promise<Page> {
  const handler = () => {
    Object.defineProperty(Object.getPrototypeOf(navigator), 'webdriver', {
      get: () => false,
    });
  };

  await page.evaluate(handler);
  await page.evaluateOnNewDocument(handler);

  return page;
}
