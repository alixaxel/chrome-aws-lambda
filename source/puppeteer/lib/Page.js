let Super = null;

try {
  Super = require('puppeteer/lib/Page').Page;
} catch (error) {
  Super = require('puppeteer-core/lib/Page').Page;
}

/**
 * Clicks an element and waits for navigation to finish.
 *
 * @param {string} selector - Selector to query for.
 * @param {NavigationOptions} [options=null] - How long to wait for, in milliseconds.
 * @returns {Promise<Response>}
 */
Super.prototype.clickAndWaitForNavigation = function (selector, options = null) {
  if (options == null) {
    options = {
      waitUntil: [
        'domcontentloaded',
        'load',
      ],
    };
  }

  let promises = [
    this.waitForNavigation(options),
    this.click(selector),
  ];

  return Promise.all(promises).then((value) => value.shift());
};

/**
 * Returns the total number of elements that match the selector.
 *
 * @param {string} selector - Selector to query for.
 * @returns {Promise<number>}
 */
Super.prototype.count = function (selector) {
  return this.mainFrame().count(selector);
};

/**
 * Checks whether at least one element matching the selector exists.
 *
 * @param {string} selector - Selector to query for.
 * @returns {Promise<boolean>}
 */
Super.prototype.exists = function (selector) {
  return this.mainFrame().exists(selector);
};

/**
 * Fills a `form` with a variable number of inputs and returns its filled state.
 *
 * @param {string} form - Selector to query the `form` element for.
 * @param {Object.<string, boolean | string | string[]>} data - Data to fill the form, as a selector-value[s] map.
 * @param {'css' | 'label' | 'name' | 'xpath'} [heuristic='name'] - Heuristic to use for form input selectors.
 * @returns {Promise<Object.<string, string[]>>}
 */
Super.prototype.fill = function (form, data, heuristic = 'name') {
  return this.mainFrame().fill(form, data, heuristic);
};

/**
 * @deprecated Use `page.goto` instead.
 */
Super.prototype.go = async function (url, options = null) {
  if (options == null) {
    options = {
      waitUntil: [
        'domcontentloaded',
        'load',
      ],
    };
  }

  return await this.goto(url, options);
};

/**
 * Returns normalized number(s) found in the given selector.
 *
 * @param {string} selector - Selector to query for.
 * @param {string} [decimal='.'] - Decimal separator to use.
 * @param {number|null} [index=null] - Element to return.
 * @param {string} [property='textContent'] - Element property to extract content from.
 * @returns {Promise<number[] | number | null>}
 */
Super.prototype.number = function (selector, decimal = '.', index = null, property = 'textContent') {
  return this.mainFrame().number(selector, decimal, index, property);
};

/**
 * Selects multiple `select` options by label and returns the values of the selection.
 *
 * @param {string} selector - Selector to query the `select` element for.
 * @param {...string} values - Option labels to select.
 * @returns {Promise<string[]>}
 */
Super.prototype.selectByLabel = function (selector, ...values) {
  return this.mainFrame().selectByLabel(selector, ...values);
};

/**
 * Returns normalized text found in the given selector.
 *
 * @param {string} selector - Selector to query for.
 * @param {string} [property='textContent'] - Element property to extract content from.
 * @returns {Promise<string[] | string | null>}
 */
Super.prototype.string = function (selector, property = 'textContent') {
  return this.mainFrame().string(selector, property);
};

/**
 * Waits for element to be present in DOM and to be visible.
 *
 * @param {string} selector - Selector to query for.
 * @param {number} [timeout=null] - How long to wait for, in milliseconds.
 * @returns {Promise<ElementHandle>}
 */
Super.prototype.waitUntilVisible = function (selector, timeout = null) {
  return this.mainFrame().waitUntilVisible(selector, timeout);
};

/**
 * Waits for element to not be found in the DOM or to be hidden.
 *
 * @param {string} selector - Selector to query for.
 * @param {number} [timeout=null] - How long to wait for, in milliseconds.
 * @returns {Promise<ElementHandle | null>}
 */
Super.prototype.waitWhileVisible = function (selector, timeout = null) {
  return this.mainFrame().waitWhileVisible(selector, timeout);
};
