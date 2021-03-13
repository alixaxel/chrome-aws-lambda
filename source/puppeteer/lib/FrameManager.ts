import { Frame, HTTPRequest, HTTPResponse, Page, WaitForOptions, WaitTimeoutOptions } from 'puppeteer-core';
import { KeysOfType, Prototype } from '../../../typings/chrome-aws-lambda';

let Super: Prototype<Frame> = null;

try {
  Super = require('puppeteer/lib/cjs/puppeteer/common/FrameManager').Frame;
} catch (error) {
  Super = require('puppeteer-core/lib/cjs/puppeteer/common/FrameManager').Frame;
}

Super.prototype.clickAndWaitForNavigation = function (selector: string, options?: WaitForOptions) {
  options = options ?? {
    waitUntil: [
      'load',
    ],
  };

  let promises: [Promise<HTTPResponse>, Promise<void>] = [
    this.waitForNavigation(options),
    this.waitForSelector(selector, { timeout: options.timeout }).then((element) => element.click()),
  ];

  return Promise.all(promises).then((value) => value.shift() as HTTPResponse);
};

Super.prototype.clickAndWaitForRequest = function (selector: string, pattern: string | RegExp, options?: WaitTimeoutOptions) {
  let callback = (request: HTTPRequest) => {
    let url = request.url();

    if (typeof pattern === 'string' && pattern.includes('*') === true) {
      pattern = new RegExp(pattern.replace(/[-\/\\^$+?.()|[\]{}]/g, '\\$&').replace(/[*]+/g, '.*?'), 'g');
    }

    if (pattern instanceof RegExp) {
      return pattern.test(url);
    }

    return pattern === url;
  };

  let promises: [Promise<HTTPRequest>, Promise<void>] = [
    ((this._frameManager as any)._page as Page).waitForRequest(callback, options),
    this.click(selector),
  ];

  return Promise.all(promises).then((value) => value.shift() as HTTPRequest);
};

Super.prototype.clickAndWaitForResponse = function (selector: string, pattern: string | RegExp, options?: WaitTimeoutOptions) {
  let callback = (request: HTTPResponse) => {
    let url = request.url();

    if (typeof pattern === 'string' && pattern.includes('*') === true) {
      pattern = new RegExp(pattern.replace(/[-\/\\^$+?.()|[\]{}]/g, '\\$&').replace(/[*]+/g, '.*?'), 'g');
    }

    if (pattern instanceof RegExp) {
      return pattern.test(url);
    }

    return pattern === url;
  };

  let promises: [Promise<HTTPResponse>, Promise<void>] = [
    ((this._frameManager as any)._page as Page).waitForResponse(callback, options),
    this.click(selector),
  ];

  return Promise.all(promises).then((value) => value.shift() as HTTPResponse);
};

Super.prototype.count = function (selector: string) {
  let callback = (selector: string) => {
    return document.querySelectorAll(selector).length;
  };

  return this.evaluate(callback, selector);
};

Super.prototype.exists = function (selector: string) {
  let callback = (selector: string) => {
    return document.querySelector(selector) !== null;
  };

  return this.evaluate(callback, selector);
};

Super.prototype.fillFormByLabel = function <T extends Record<string, boolean | string | string[]>>(selector: string, data: T) {
  return this.$(selector).then((element) => element?.fillFormByLabel(data) ?? null);
};

Super.prototype.fillFormByName = function <T extends Record<string, boolean | string | string[]>>(selector: string, data: T) {
  return this.$(selector).then((element) => element?.fillFormByName(data) ?? null);
};

Super.prototype.fillFormBySelector = function <T extends Record<string, boolean | string | string[]>>(selector: string, data: T) {
  return this.$(selector).then((element) => element?.fillFormBySelector(data) ?? null);
};

Super.prototype.fillFormByXPath = function <T extends Record<string, boolean | string | string[]>>(selector: string, data: T) {
  return this.$(selector).then((element) => element?.fillFormByXPath(data) ?? null);
};

Super.prototype.number = function <T = HTMLElement>(selector: string, decimal: string = '.', property: KeysOfType<T, string> = 'textContent' as any) {
  return this.$(selector).then((element) => element?.number(decimal, property) ?? null);
};

Super.prototype.selectByLabel = function (selector: string, ...values: string[]) {
  return this.$(selector).then((element) => element?.selectByLabel(...values) ?? null);
};

Super.prototype.string = function <T = HTMLElement>(selector: string, property: KeysOfType<T, string> = 'textContent' as any) {
  return this.$(selector).then((element) => element?.string(property) ?? null);
};

Super.prototype.waitUntilVisible = function (selector: string, options?: WaitTimeoutOptions) {
  return this.waitForSelector(selector, {
    ...options,
    visible: true,
  });
};

Super.prototype.waitWhileVisible = function (selector: string, options?: WaitTimeoutOptions) {
  return this.waitForSelector(selector, {
    ...options,
    hidden: true,
  });
};
