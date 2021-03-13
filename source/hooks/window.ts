import { Page } from 'puppeteer-core';

/**
 * Patches `outerHeight` and `outerWidth` to mimic headful Chrome.
 *
 * @param page - Page to hook to.
 */
export = async function (page: Page): Promise<Page> {
  await page.evaluateOnNewDocument(() => {
    if (window.outerHeight === 0) {
      Object.defineProperty(window, 'outerHeight', {
        get: () => window.innerHeight,
      });
    }

    if (window.outerWidth === 0) {
      Object.defineProperty(window, 'outerWidth', {
        get: () => window.innerWidth,
      });
    }
  });

  return page;
}
