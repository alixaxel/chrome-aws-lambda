import { Page } from 'puppeteer-core';

/**
 * Emulates `denied` state for all permission queries.
 *
 * @param page - Page to hook to.
 */
export = async function (page: Page): Promise<Page> {
  await page.evaluateOnNewDocument(() => {
    let query = window.navigator.permissions.query;

    (Permissions as any).prototype.query = function (parameters: DevicePermissionDescriptor | MidiPermissionDescriptor | PermissionDescriptor | PushPermissionDescriptor) {
      if (parameters?.name?.length > 0) {
        return Promise.resolve({
          onchange: null,
          state: 'denied',
        });
      }

      return query(parameters);
    };
  });

  return page;
}
