import { CDPSession, HTTPRequest, HTTPResponse, Page, TracingOptions, WaitForOptions, WaitTimeoutOptions } from 'puppeteer-core';
import { KeysOfType, Prototype } from '../../../typings/chrome-aws-lambda';

let Super: Prototype<Page> = null;

try {
  Super = require('puppeteer/lib/cjs/puppeteer/common/Page.js').Page;
} catch (error) {
  Super = require('puppeteer-core/lib/cjs/puppeteer/common/Page.js').Page;
}

Super.prototype.block = function (predicates: string[]) {
  return ((this as any)._client as CDPSession).send('Network.setBlockedURLs', {
    urls: predicates
  });
};

Super.prototype.clear = function (selector: string) {
  return this.mainFrame().clear(selector);
};

Super.prototype.clickAndWaitForNavigation = function (selector: string, options?: WaitForOptions) {
  return this.mainFrame().clickAndWaitForNavigation(selector, options);
};

Super.prototype.clickAndWaitForRequest = function (selector: string, predicate: string | RegExp | ((request: HTTPRequest) => boolean | Promise<boolean>), options?: WaitTimeoutOptions) {
  return this.mainFrame().clickAndWaitForRequest(selector, predicate as any, options);
};

Super.prototype.clickAndWaitForResponse = function (selector: string, predicate: string | RegExp | ((request: HTTPResponse) => boolean | Promise<boolean>), options?: WaitTimeoutOptions) {
  return this.mainFrame().clickAndWaitForResponse(selector, predicate as any, options);
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

Super.prototype.waitForInflightRequests = function (requests: number = 0, alpha: number = 500, omega: number = 500, options?: WaitTimeoutOptions) {
  let result: Record<string, Function> = {
    reject: null,
    resolve: null,
  };

  let timeout: NodeJS.Timeout;
  let timeoutAlpha: NodeJS.Timeout;
  let timeoutOmega: NodeJS.Timeout;

  if (options == null) {
    options = {
      timeout: (this as any)._timeoutSettings.navigationTimeout(),
    };
  }

  let inflight = 0;

  const check = () => {
    if (inflight <= Math.max(0, requests)) {
      if (timeoutOmega !== undefined) {
        clearTimeout(timeoutOmega);
      }

      timeoutOmega = setTimeout(onTimeoutOmega, omega);
    }
  };

  const clear = () => {
    if (timeout !== undefined) {
      clearTimeout(timeout);
    }

    if (timeoutAlpha !== undefined) {
      clearTimeout(timeoutAlpha);
    }

    if (timeoutOmega !== undefined) {
      clearTimeout(timeoutOmega);
    }

    this.off('request', onRequestStarted);
    this.off('requestfailed', onRequestSettled);
    this.off('requestfinished', onRequestSettled);
  };

  function onRequestStarted() {
    if (timeoutAlpha !== undefined) {
      clearTimeout(timeoutAlpha);
    }

    if (timeoutOmega !== undefined) {
      clearTimeout(timeoutOmega);
    }

    ++inflight;
  }

  function onRequestSettled() {
    if (inflight > 0) {
      --inflight;
    }

    check();
  }

  function onTimeout() {
    clear(); return result.reject(new Error(`Navigation timeout of ${options.timeout} ms exceeded.`));
  }

  function onTimeoutAlpha() {
    clear(); return result.resolve();
  }

  function onTimeoutOmega() {
    clear(); return result.resolve();
  }

  this.on('request', onRequestStarted);
  this.on('requestfailed', onRequestSettled);
  this.on('requestfinished', onRequestSettled);

  if (options.timeout !== 0) {
    timeout = setTimeout(onTimeout, options.timeout);
  }

  timeoutAlpha = setTimeout(onTimeoutAlpha, alpha);

  return new Promise((resolve, reject) => {
    result.reject = reject;
    result.resolve = resolve;
  });
};

Super.prototype.waitForText = function (predicate: string, options?: WaitTimeoutOptions) {
  return this.mainFrame().waitForText(predicate, options);
};

Super.prototype.waitUntilVisible = function (selector: string, options?: WaitTimeoutOptions) {
  return this.mainFrame().waitUntilVisible(selector, options);
};

Super.prototype.waitWhileVisible = function (selector: string, options?: WaitTimeoutOptions) {
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
