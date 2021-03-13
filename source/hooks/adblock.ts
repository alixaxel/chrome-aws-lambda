import { promises } from 'fs';
import { get } from 'https';
import { Page } from 'puppeteer-core';

let adblocker: any = null;

/**
 * Enables ad blocking in page.
 * Requires `@cliqz/adblocker-puppeteer` package to be installed.
 *
 * @param page - Page to hook to.
 */
export = async function (page: Page): Promise<Page> {
  if (adblocker == null) {
    const { fullLists, PuppeteerBlocker } = require('@cliqz/adblocker-puppeteer');

    adblocker = await PuppeteerBlocker.fromLists(
      (url: string) => {
        return new Promise((resolve, reject) => {
          return get(url, (response) => {
            if (response.statusCode !== 200) {
              return reject(`Unexpected status code: ${response.statusCode}.`);
            }

            let result = '';

            response.on('data', (chunk) => {
              result += chunk;
            });

            response.on('end', () => {
              return resolve({ text: () => result });
            });
          });
        });
      },
      fullLists,
      { enableCompression: false },
      {
        path: '/tmp/adblock.bin',
        read: promises.readFile,
        write: promises.writeFile,
      }
    );
  }

  return await adblocker.enableBlockingInPage(page).then(() => page);
}
