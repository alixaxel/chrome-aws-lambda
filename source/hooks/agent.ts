import { Page } from 'puppeteer-core';

/**
 * Removes `Headless` from the User Agent string.
 *
 * @param page - Page to hook to.
 */
export = function (page: Page): Promise<Page> {
  return page
    .browser()
    .userAgent()
    .then((value) => page.setUserAgent(value.replace('Headless', '')))
    .then(() => page);
};
