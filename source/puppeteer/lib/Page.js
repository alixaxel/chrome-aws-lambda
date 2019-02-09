let Super = null;

try {
  Super = require('puppeteer/lib/Page').Page;
} catch (error) {
  Super = require('puppeteer-core/lib/Page').Page;
}

Super.prototype.clickAndWaitForNavigation = function (selector, options = null) {
  if (options == null) {
    options = {
      timeout: this._defaultNavigationTimeout,
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

Super.prototype.count = function (selector) {
  return this.mainFrame().count(selector);
};

Super.prototype.exists = function (selector) {
  return this.mainFrame().exists(selector);
};

Super.prototype.fill = function (form, data, heuristic = 'name') {
  return this.mainFrame().fill(form, data, heuristic);
};

Super.prototype.go = async function (url, options = null) {
  await this.browser().userAgent().then((agent) => {
    return this.setUserAgent(agent.replace('Headless', ''));
  });

  await this.evaluateOnNewDocument(
    () => {
      window.chrome = {
        app: {},
        runtime: {},
      };

      Object.defineProperty(navigator, 'plugins', {
        get: () => [
          null,
        ],
      });

      Object.defineProperty(navigator, 'languages', {
        get: () => [
          'en-US',
          'en',
        ],
      });

      Object.defineProperty(navigator, 'webdriver', {
        get: () => false,
      });

      window.σ = {
        $: function (selector, context = document) {
          return context.querySelector(selector);
        },
        $$: function (selector, index = null, context = document) {
          if ((index == null) || (index > 0)) {
            let result = Array.from(context.querySelectorAll(selector));

            if (index != null) {
              return result[index] || null;
            }

            return result;
          }

          return context.querySelector(selector);
        },
        $x: function (expression, index = null, context = document) {
          let node = null;
          let nodes = document.evaluate(expression, context, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
          let result = [];

          while ((node = nodes.iterateNext()) != null) {
            result.push(node);
          }

          if (index != null) {
            return result[index] || null;
          }

          return result;
        },
        $number: function (data, decimal = null, index = null, property = 'textContent') {
          data = σ.$string(data, property);

          if (typeof data === 'string') {
            if (decimal === null) {
              decimal = '.';
            }

            if (typeof decimal === 'string') {
              decimal = decimal.replace(/[.]/g, '\\$&');
            }

            let result = data.match(/((?:[-+]|\b)[0-9]+(?:[ ,.'`´]*[0-9]+)*)\b/g);

            if (result != null) {
              result = result.map(
                (value) => {
                  return parseFloat(value.replace(new RegExp(`[^-+0-9${decimal}]+`, 'g'), '').replace(decimal, '.'));
                }
              );

              if (index != null) {
                return result[index] || null;
              }
            }

            return result;
          }

          return null;
        },
        $string: function (data, property = 'textContent') {
          if (data == null) {
            return null;
          }

          if (typeof data === 'object') {
            if (data instanceof NodeList) {
              data = Array.from(data);
            }

            if (Array.isArray(data) === true) {
              return data.map(
                (value) => {
                  return σ.$string(value, property);
                }
              );
            }

            if (property in data) {
              return σ.$string(data[property]);
            }

            for (let key in data) {
              data[key] = σ.$string(data[key], property);
            }

            return data;
          }

          if (typeof data === 'string') {
            let patterns = {
              ' ':    /[\u00A0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000]/g,
              '-':    /[\u2013\u2014]/g,
              '...':  /[\u2026]/g,
              '':     /[\u200B\uFEFF]/g,
              '"':    /[\u201C\u201D]/g,
              '<':    /[\u00AB\u2039]/g,
              '>':    /[\u00BB\u203A]/g,
              '|':    /[\u007C\u00A6\u01C0\u2223\u2758]/g,
              "'":    /[\u2018\u2019\u201A\u201B\u2032]/g,
            };

            for (let [key, value] of Object.entries(patterns)) {
              data = data.replace(value, key);
            }

            return data.replace(/[\s]+/g, ' ').trim();
          }

          return null;
        },
        $regexp: function (data, pattern, index = null, property = 'textContent') {
          data = σ.$string(data, property);

          if (typeof data === 'string') {
            let result = data.match(pattern);

            if ((result != null) && (index != null)) {
              return result[index] || null;
            }

            return result;
          }

          return null;
        },
      };
    }
  );

  if (options == null) {
    options = {
      timeout: this._defaultNavigationTimeout,
      waitUntil: [
        'domcontentloaded',
        'load',
      ],
    };
  }

  return await this.goto(url, options);
};

Super.prototype.number = function (selector, decimal = null, index = null, property = 'textContent') {
  return this.mainFrame().number(selector, decimal, index, property);
};

Super.prototype.selectByLabel = function (selector, ...values) {
  return this.mainFrame().selectByLabel(selector, ...values);
};

Super.prototype.string = function (selector, property = 'textContent') {
  return this.mainFrame().string(selector, property);
};

Super.prototype.waitUntilVisible = function (selector, timeout = null) {
  return this.mainFrame().waitUntilVisible(selector, timeout);
};

Super.prototype.waitWhileVisible = function (selector, timeout = null) {
  return this.mainFrame().waitWhileVisible(selector, timeout);
};
