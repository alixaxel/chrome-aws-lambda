import { Page } from 'puppeteer-core';

/**
 * Emulates `en-US` language.
 *
 * @param page - Page to hook to.
 */
export = async function (page: Page): Promise<Page> {
  const handler = () => {
    Object.defineProperty(Object.getPrototypeOf(navigator), 'language', {
      get: () => 'en-US',
    });

    Object.defineProperty(Object.getPrototypeOf(navigator), 'languages', {
      get: () => ['en-US', 'en'],
    });
  };

  await page.evaluate(handler);
  await page.evaluateOnNewDocument(handler);

  return page;
}
