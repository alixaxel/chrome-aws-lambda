import { Frame, HTTPRequest, HTTPResponse, WaitForOptions, WaitTimeoutOptions } from 'puppeteer-core';
import { KeysOfType, Prototype } from '../../../typings/chrome-aws-lambda';

let Super: Prototype<Frame> = null;

try {
  Super = require('puppeteer/lib/cjs/puppeteer/common/FrameManager.js').Frame;
} catch (error) {
  Super = require('puppeteer-core/lib/cjs/puppeteer/common/FrameManager.js').Frame;
}

Super.prototype.clear = function (selector: string) {
  return this.$(selector).then((element) => element?.clear());
};

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

Super.prototype.clickAndWaitForRequest = function (selector: string, predicate: string | RegExp | ((request: HTTPRequest) => boolean | Promise<boolean>), options?: WaitTimeoutOptions) {
  let callback = (request: HTTPRequest) => {
    let url = request.url();

    if (typeof predicate === 'string' && predicate.includes('*') === true) {
      predicate = new RegExp(predicate.replace(/[-\/\\^$+?.()|[\]{}]/g, '\\$&').replace(/[*]+/g, '.*?'), 'g');
    }

    if (predicate instanceof RegExp) {
      return predicate.test(url);
    }

    return predicate === url;
  };

  let promises: [Promise<HTTPRequest>, Promise<void>] = [
    this.page().waitForRequest((typeof predicate === 'function') ? predicate : callback, options),
    this.click(selector),
  ];

  return Promise.all(promises).then((value) => value.shift() as HTTPRequest);
};

Super.prototype.clickAndWaitForResponse = function (selector: string, predicate: string | RegExp | ((request: HTTPResponse) => boolean | Promise<boolean>), options?: WaitTimeoutOptions) {
  let callback = (request: HTTPResponse) => {
    let url = request.url();

    if (typeof predicate === 'string' && predicate.includes('*') === true) {
      predicate = new RegExp(predicate.replace(/[-\/\\^$+?.()|[\]{}]/g, '\\$&').replace(/[*]+/g, '.*?'), 'g');
    }

    if (predicate instanceof RegExp) {
      return predicate.test(url);
    }

    return predicate === url;
  };

  let promises: [Promise<HTTPResponse>, Promise<void>] = [
    this.page().waitForResponse((typeof predicate === 'function') ? predicate : callback, options),
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

Super.prototype.waitForText = function (predicate: string, options?: WaitTimeoutOptions) {
  if (predicate.includes(`"`) !== true) {
    predicate = `"${predicate}"`;
  } else if (predicate.includes(`'`) !== true) {
    predicate = `'${predicate}'`;
  } else {
    throw new Error('Predicate cannot include both single and double quotes.');
  }

  return this.waitForXPath(`//*[contains(concat(' ', normalize-space(text()), ' '), ${predicate})]`, {
    ...options,
    visible: true,
  });
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
