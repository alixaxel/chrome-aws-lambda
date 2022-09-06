import { Page } from 'puppeteer-core';

/**
 * Emulates `denied` state for all permission queries.
 *
 * @param page - Page to hook to.
 */
export = async function (page: Page): Promise<Page> {
  const handler = () => {
    let query = window.navigator.permissions.query;

    (Permissions as any).prototype.query = function (parameters: PermissionDescriptor) {
      if (parameters?.name?.length > 0) {
        return Promise.resolve({
          onchange: null,
          state: 'denied',
        });
      }

      return query(parameters);
    };
  };

  await page.evaluate(handler);
  await page.evaluateOnNewDocument(handler);

  return page;
}
