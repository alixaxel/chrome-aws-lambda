import { ElementHandle, EvaluateFunc, HTTPRequest, HTTPResponse, Page, WaitForOptions, WaitTimeoutOptions } from 'puppeteer-core';
import { Prototype } from '../../../typings/chrome-aws-lambda';

let Super: Prototype<ElementHandle> = null;

try {
  Super = require('puppeteer/lib/cjs/puppeteer/common/ElementHandle.js').ElementHandle;
} catch (error) {
  Super = require('puppeteer-core/lib/cjs/puppeteer/common/ElementHandle.js').ElementHandle;
}

Super.prototype.clear = function () {
  return this.click({ clickCount: 3 }).then(() => this.press('Backspace'));
};

Super.prototype.clickAndWaitForNavigation = function (options?: WaitForOptions) {
  options = options ?? {
    waitUntil: [
      'load',
    ],
  };

  let promises: [Promise<HTTPResponse>, Promise<void>] = [
    ((this as any)._page as Page).waitForNavigation(options),
    this.click(),
  ];

  return Promise.all(promises).then((value) => value.shift() as HTTPResponse);
};

Super.prototype.clickAndWaitForRequest = function (predicate: string | RegExp | ((request: HTTPRequest) => boolean | Promise<boolean>), options?: WaitTimeoutOptions) {
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
    ((this as any)._page as Page).waitForRequest((typeof predicate === 'function') ? predicate : callback, options),
    this.click(),
  ];

  return Promise.all(promises).then((value) => value.shift() as HTTPRequest);
};

Super.prototype.clickAndWaitForResponse = function (predicate: string | RegExp | ((request: HTTPResponse) => boolean | Promise<boolean>), options?: WaitTimeoutOptions) {
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
    ((this as any)._page as Page).waitForResponse((typeof predicate === 'function') ? predicate : callback, options),
    this.click(),
  ];

  return Promise.all(promises).then((value) => value.shift() as HTTPResponse);
};

Super.prototype.fillFormByLabel = function <T extends Record<string, boolean | string | string[]>>(data: T) {
  let callback = (node: HTMLFormElement, data: T) => {
    if (node.nodeName.toLowerCase() !== 'form') {
      throw new Error('Element is not a <form> element.');
    }

    let result: Record<string, string[]> = {};

    for (let [key, value] of Object.entries(data)) {
      let selector = [
        `id(string(//label[normalize-space(.) = "${key}"]/@for))`,
        `//label[normalize-space(.) = "${key}"]//*[self::input or self::select or self::textarea]`,
      ].join(' | ');

      if (result.hasOwnProperty(key) !== true) {
        result[key] = [];
      }

      let element: Node = null;
      let elements: HTMLInputElement[] = [];
      let iterator = document.evaluate(selector, node, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

      while ((element = iterator.iterateNext()) != null) {
        elements.push(element as HTMLInputElement);
      }

      if (elements.length === 0) {
        throw new Error(`No elements match the selector '${selector}' for '${key}'.`);
      }

      let type = (elements[0].getAttribute('type') || elements[0].nodeName).toLowerCase();
      let values: (boolean | string)[] = (Array.isArray(value) === true) ? value as (boolean | string)[] : [value] as (boolean | string)[];

      if (type === 'file') {
        throw new Error(`Input element of type 'file' is not supported.`);
      }

      for (let element of elements) {
        try {
          element.focus();
          element.dispatchEvent(new Event('focus'));
        } catch (error) {
        }

        if (type === 'select') {
          element.value = undefined;

          for (let index of ['value', 'label'] as ['value', 'label']) {
            if (result[key].length > 0) {
              break;
            }

            for (let option of Array.from((element as unknown as HTMLSelectElement).options)) {
              option.selected = values.includes(option[index]);

              if (option.selected === true) {
                result[key].push(option.value);

                if (element.multiple !== true) {
                  break;
                }
              }
            }
          }
        } else if (type === 'checkbox' || type === 'radio') {
          element.checked = (value === true) || values.includes(element.value);

          if (element.checked === true) {
            result[key].push(element.value);
          }
        } else if (typeof value === 'string') {
          if (element.isContentEditable === true) {
            result[key].push(element.textContent = value);
          } else {
            result[key].push(element.value = value);
          }
        }

        for (let trigger of ['input', 'change']) {
          element.dispatchEvent(new Event(trigger, { 'bubbles': true }));
        }

        try {
          element.blur();
          element.dispatchEvent(new Event('blur'));
        } catch (error) {
        }

        if (type === 'checkbox' || type === 'radio') {
          break;
        }
      }
    }

    return result;
  };

  return this.evaluate(callback as unknown as EvaluateFunc<[ElementHandle<Element>, T]>, data) as any;
};

Super.prototype.fillFormByName = function <T extends Record<string, boolean | string | string[]>>(data: T) {
  let callback = (node: HTMLFormElement, data: T, heuristic: 'css' | 'label' | 'name' | 'xpath' = 'css') => {
    if (node.nodeName.toLowerCase() !== 'form') {
      throw new Error('Element is not a <form> element.');
    }

    let result: Record<string, string[]> = {};

    for (let [key, value] of Object.entries(data)) {
      let selector = `[name="${key}"]`;

      if (result.hasOwnProperty(key) !== true) {
        result[key] = [];
      }

      let elements: HTMLInputElement[] = Array.from(node.querySelectorAll(selector));

      if (elements.length === 0) {
        throw new Error(`No elements match the selector '${selector}' for '${key}'.`);
      }

      let type = (elements[0].getAttribute('type') || elements[0].nodeName).toLowerCase();
      let values: (boolean | string)[] = (Array.isArray(value) === true) ? value as (boolean | string)[] : [value] as (boolean | string)[];

      if (type === 'file') {
        throw new Error(`Input element of type 'file' is not supported.`);
      }

      for (let element of elements) {
        try {
          element.focus();
          element.dispatchEvent(new Event('focus'));
        } catch (error) {
        }

        if (type === 'select') {
          element.value = undefined;

          for (let index of ['value', 'label'] as ['value', 'label']) {
            if (result[key].length > 0) {
              break;
            }

            for (let option of Array.from((element as unknown as HTMLSelectElement).options)) {
              option.selected = values.includes(option[index]);

              if (option.selected === true) {
                result[key].push(option.value);

                if (element.multiple !== true) {
                  break;
                }
              }
            }
          }
        } else if (type === 'checkbox' || type === 'radio') {
          element.checked = (value === true) || values.includes(element.value);

          if (element.checked === true) {
            result[key].push(element.value);
          }
        } else if (typeof value === 'string') {
          if (element.isContentEditable === true) {
            result[key].push(element.textContent = value);
          } else {
            result[key].push(element.value = value);
          }
        }

        for (let trigger of ['input', 'change']) {
          element.dispatchEvent(new Event(trigger, { 'bubbles': true }));
        }

        try {
          element.blur();
          element.dispatchEvent(new Event('blur'));
        } catch (error) {
        }

        if (type === 'checkbox' || type === 'radio') {
          break;
        }
      }
    }

    return result;
  };

  return this.evaluate(callback as unknown as EvaluateFunc<[ElementHandle<Element>, T]>, data) as any;
};

Super.prototype.fillFormBySelector = function <T extends Record<string, boolean | string | string[]>>(data: T) {
  let callback = (node: HTMLFormElement, data: T, heuristic: 'css' | 'label' | 'name' | 'xpath' = 'css') => {
    if (node.nodeName.toLowerCase() !== 'form') {
      throw new Error('Element is not a <form> element.');
    }

    let result: Record<string, string[]> = {};

    for (let [key, value] of Object.entries(data)) {
      let selector = key;

      if (result.hasOwnProperty(key) !== true) {
        result[key] = [];
      }

      let elements: HTMLInputElement[] = Array.from(node.querySelectorAll(selector));

      if (elements.length === 0) {
        throw new Error(`No elements match the selector '${selector}' for '${key}'.`);
      }

      let type = (elements[0].getAttribute('type') || elements[0].nodeName).toLowerCase();
      let values: (boolean | string)[] = (Array.isArray(value) === true) ? value as (boolean | string)[] : [value] as (boolean | string)[];

      if (type === 'file') {
        throw new Error(`Input element of type 'file' is not supported.`);
      }

      for (let element of elements) {
        try {
          element.focus();
          element.dispatchEvent(new Event('focus'));
        } catch (error) {
        }

        if (type === 'select') {
          element.value = undefined;

          for (let index of ['value', 'label'] as ['value', 'label']) {
            if (result[key].length > 0) {
              break;
            }

            for (let option of Array.from((element as unknown as HTMLSelectElement).options)) {
              option.selected = values.includes(option[index]);

              if (option.selected === true) {
                result[key].push(option.value);

                if (element.multiple !== true) {
                  break;
                }
              }
            }
          }
        } else if (type === 'checkbox' || type === 'radio') {
          element.checked = (value === true) || values.includes(element.value);

          if (element.checked === true) {
            result[key].push(element.value);
          }
        } else if (typeof value === 'string') {
          if (element.isContentEditable === true) {
            result[key].push(element.textContent = value);
          } else {
            result[key].push(element.value = value);
          }
        }

        for (let trigger of ['input', 'change']) {
          element.dispatchEvent(new Event(trigger, { 'bubbles': true }));
        }

        try {
          element.blur();
          element.dispatchEvent(new Event('blur'));
        } catch (error) {
        }

        if (type === 'checkbox' || type === 'radio') {
          break;
        }
      }
    }

    return result;
  };

  return this.evaluate(callback as unknown as EvaluateFunc<[ElementHandle<Element>, T]>, data) as any;
};

Super.prototype.fillFormByXPath = function <T extends Record<string, boolean | string | string[]>>(data: T) {
  let callback = (node: HTMLFormElement, data: T) => {
    if (node.nodeName.toLowerCase() !== 'form') {
      throw new Error('Element is not a <form> element.');
    }

    let result: Record<string, string[]> = {};

    for (let [key, value] of Object.entries(data)) {
      let selector = key;

      if (result.hasOwnProperty(key) !== true) {
        result[key] = [];
      }

      let element: Node = null;
      let elements: HTMLInputElement[] = [];
      let iterator = document.evaluate(selector, node, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

      while ((element = iterator.iterateNext()) != null) {
        elements.push(element as HTMLInputElement);
      }

      if (elements.length === 0) {
        throw new Error(`No elements match the selector '${selector}' for '${key}'.`);
      }

      let type = (elements[0].getAttribute('type') || elements[0].nodeName).toLowerCase();
      let values: (boolean | string)[] = (Array.isArray(value) === true) ? value as (boolean | string)[] : [value] as (boolean | string)[];

      if (type === 'file') {
        throw new Error(`Input element of type 'file' is not supported.`);
      }

      for (let element of elements) {
        try {
          element.focus();
          element.dispatchEvent(new Event('focus'));
        } catch (error) {
        }

        if (type === 'select') {
          element.value = undefined;

          for (let index of ['value', 'label'] as ['value', 'label']) {
            if (result[key].length > 0) {
              break;
            }

            for (let option of Array.from((element as unknown as HTMLSelectElement).options)) {
              option.selected = values.includes(option[index]);

              if (option.selected === true) {
                result[key].push(option.value);

                if (element.multiple !== true) {
                  break;
                }
              }
            }
          }
        } else if (type === 'checkbox' || type === 'radio') {
          element.checked = (value === true) || values.includes(element.value);

          if (element.checked === true) {
            result[key].push(element.value);
          }
        } else if (typeof value === 'string') {
          if (element.isContentEditable === true) {
            result[key].push(element.textContent = value);
          } else {
            result[key].push(element.value = value);
          }
        }

        for (let trigger of ['input', 'change']) {
          element.dispatchEvent(new Event(trigger, { 'bubbles': true }));
        }

        try {
          element.blur();
          element.dispatchEvent(new Event('blur'));
        } catch (error) {
        }

        if (type === 'checkbox' || type === 'radio') {
          break;
        }
      }
    }

    return result;
  };

  return this.evaluate(callback as unknown as EvaluateFunc<[ElementHandle<Element>, T]>, data) as any;
};

Super.prototype.getInnerHTML = function () {
  return this.evaluate((node: Element) => {
    return (node as HTMLElement).innerHTML;
  });
};

Super.prototype.getInnerText = function () {
  return this.evaluate((node: Element) => {
    return (node as HTMLElement).innerText;
  });
};

Super.prototype.number = function (decimal: string = '.', property: any) {
  let callback = (node: any, decimal: string, property: any) => {
    let data = (node[property] as unknown) as string;

    if (typeof data === 'string') {
      decimal = decimal ?? '.';

      if (typeof decimal === 'string') {
        decimal = decimal.replace(/[.]/g, '\\$&');
      }

      let matches = data.match(/((?:[-+]|\b)[0-9]+(?:[ ,.'`´]*[0-9]+)*)\b/g);

      if (matches != null) {
        return matches.map((value) => parseFloat(value.replace(new RegExp(`[^-+0-9${decimal}]+`, 'g'), '').replace(decimal, '.')));
      }
    }

    return null;
  };

  return this.evaluate(callback, decimal, property as any);
};

Super.prototype.selectByLabel = function (...values: string[]) {
  for (let value of values) {
    console.assert(typeof value === 'string', `Values must be strings. Found value '${value}' of type '${typeof value}'.`);
  }

  let callback = (node: HTMLSelectElement, values: string[]) => {
    if (node.nodeName.toLowerCase() !== 'select') {
      throw new Error('Element is not a <select> element.');
    }

    node.value = undefined;

    let result = [];
    let options = Array.from(node.options);

    for (let option of options) {
      option.selected = values.includes(option.label);

      if (option.selected === true) {
        result.push(option.value);

        if (node.multiple !== true) {
          break;
        }
      }
    }

    for (let trigger of ['input', 'change']) {
      node.dispatchEvent(new Event(trigger, { bubbles: true }));
    }

    return result;
  };

  return this.evaluate(callback as any, values);
};

Super.prototype.string = function (property: any) {
  let callback = (node: any, property: any) => {
    let data = (node[property] as unknown) as string;

    if (typeof data === 'string') {
      let patterns = {
        ' ': /[\u00A0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000]/g,
        '-': /[\u2013\u2014]/g,
        '...': /[\u2026]/g,
        '': /[\u200B\uFEFF]/g,
        '"': /[\u201C\u201D]/g,
        '<': /[\u00AB\u2039]/g,
        '>': /[\u00BB\u203A]/g,
        '|': /[\u007C\u00A6\u01C0\u2223\u2758]/g,
        "'": /[\u2018\u2019\u201A\u201B\u2032]/g,
      };

      for (let [key, value] of Object.entries(patterns)) {
        data = data.replace(value, key);
      }

      return data.replace(/[\s]+/g, ' ').trim();
    }

    return null;
  };

  return this.evaluate(callback, property as any);
};
