import { CDPSession, Page, TracingOptions, WaitForOptions, WaitTimeoutOptions } from 'puppeteer-core';
import { KeysOfType, Prototype } from '../../../typings/chrome-aws-lambda';

let Super: Prototype<Page> = null;

try {
  Super = require('puppeteer/lib/cjs/puppeteer/common/Page').Page;
} catch (error) {
  Super = require('puppeteer-core/lib/cjs/puppeteer/common/Page').Page;
}

Super.prototype.block = function (predicates: string[]) {
  return ((this as any)._client as CDPSession).send('Network.setBlockedURLs', {
    urls: predicates
  });
};

Super.prototype.clickAndWaitForNavigation = function (selector: string, options?: WaitForOptions) {
  return this.mainFrame().clickAndWaitForNavigation(selector, options);
};

Super.prototype.clickAndWaitForRequest = function (selector: string, pattern: string | RegExp, options?: WaitTimeoutOptions) {
  return this.mainFrame().clickAndWaitForRequest(selector, pattern, options);
};

Super.prototype.clickAndWaitForResponse = function (selector: string, pattern: string | RegExp, options?: WaitTimeoutOptions) {
  return this.mainFrame().clickAndWaitForResponse(selector, pattern, options);
};

Super.prototype.count = function (selector: string) {
  return this.mainFrame().count(selector);
};

Super.prototype.exists = function (selector: string) {
  return this.mainFrame().exists(selector);
};

Super.prototype.fillFormByLabel = function <T extends Record<string, boolean | string | string[]>>(selector: string, data: T) {
  return this.mainFrame().fillFormByLabel(selector, data);
};

Super.prototype.fillFormByName = function <T extends Record<string, boolean | string | string[]>>(selector: string, data: T) {
  return this.mainFrame().fillFormByName(selector, data);
};

Super.prototype.fillFormBySelector = function <T extends Record<string, boolean | string | string[]>>(selector: string, data: T) {
  return this.mainFrame().fillFormBySelector(selector, data);
};

Super.prototype.fillFormByXPath = function <T extends Record<string, boolean | string | string[]>>(selector: string, data: T) {
  return this.mainFrame().fillFormByXPath(selector, data);
};

Super.prototype.number = function <T = HTMLElement>(selector: string, decimal: string = '.', property: KeysOfType<T, string> = 'textContent' as any) {
  return this.mainFrame().number(selector, decimal, property);
};

Super.prototype.selectByLabel = function (selector: string, ...values: string[]) {
  return this.mainFrame().selectByLabel(selector, ...values);
};

Super.prototype.string = function <T = HTMLElement>(selector: string, property: KeysOfType<T, string> = 'textContent' as any) {
  return this.mainFrame().string(selector, property);
};

Super.prototype.waitUntilVisible = function (selector: string, options?: WaitTimeoutOptions) {
  return this.mainFrame().waitUntilVisible(selector, options);
};

Super.prototype.waitWhileVisible = function (selector: string, options?: WaitTimeoutOptions) {
  this.coverage.startCSSCoverage()
  return this.mainFrame().waitWhileVisible(selector, options);
};

Super.prototype.withTracing = function (options: TracingOptions, callback: (page: Page) => Promise<any>): Promise<Buffer> {
  return this.tracing.start(options).then(async () => {
    if (typeof callback === 'function') {
      await callback(this);
    }

    return await this.tracing.stop();
  });
};
