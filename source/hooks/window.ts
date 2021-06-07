import { Page } from 'puppeteer-core';

/**
 * Patches window outer dimentions to mimic headful Chrome.
 *
 * @param page - Page to hook to.
 */
export = async function (page: Page): Promise<Page> {
  const handler = () => {
    if (window.outerWidth === 0) {
      Object.defineProperty(window, 'outerWidth', {
        get: () => screen.availWidth,
      });
    }

    if (window.outerHeight === 0) {
      Object.defineProperty(window, 'outerHeight', {
        get: () => screen.availHeight,
      });
    }

    if (window.screenX === 0) {
      Object.defineProperty(window, 'screenX', {
        get: () => screen.width - screen.availWidth,
      });

      Object.defineProperty(window, 'screenLeft', {
        get: () => screenX,
      });
    }

    if (window.screenY === 0) {
      Object.defineProperty(window, 'screenY', {
        get: () => screen.height - screen.availHeight,
      });

      Object.defineProperty(window, 'screenTop', {
        get: () => screenY,
      });
    }
  };

  await page.evaluate(handler);
  await page.evaluateOnNewDocument(handler);

  return page;
}
