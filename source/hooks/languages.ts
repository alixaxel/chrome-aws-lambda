import { Page } from 'puppeteer-core';

/**
 * Emulates `en-US` language.
 *
 * @param page - Page to hook to.
 */
export = async function (page: Page): Promise<Page> {
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(Object.getPrototypeOf(navigator), 'language', {
      get: () => 'en-US',
    });

    Object.defineProperty(Object.getPrototypeOf(navigator), 'languages', {
      get: () => ['en-US', 'en'],
    });
  });

  return page;
}
