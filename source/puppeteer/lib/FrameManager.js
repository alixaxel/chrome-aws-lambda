let Super = null;

try {
  Super = require('puppeteer/lib/FrameManager').Frame;
} catch (error) {
  Super = require('puppeteer-core/lib/FrameManager').Frame;
}

Super.prototype.count = function (selector) {
  return this.evaluate(
    (selector) => {
      return document.querySelectorAll(selector).length;
    },
    selector
  );
};

Super.prototype.exists = function (selector) {
  return this.evaluate(
    (selector) => {
      return document.querySelector(selector) !== null;
    },
    selector
  );
};

Super.prototype.fill = function (form, data, heuristic = 'name') {
  return this.evaluate(
    (form, data, heuristic = 'name') => {
      form = document.querySelector(form);

      if ((form == null) || (form.nodeName.toLowerCase() !== 'form')) {
        throw new Error(`Element is not a <form> element.`);
      }

      let result = {};

      for (let [key, value] of Object.entries(data)) {
        let selector = key;
        let elements = null;

        if (result.hasOwnProperty(key) !== true) {
          result[key] = [];
        }

        if (['css', 'name'].includes(heuristic) === true) {
          if (heuristic === 'name') {
            selector = `[name="${key}"]`;
          }

          elements = σ.$$(selector, null, form);
        } else if (['label', 'xpath'].includes(heuristic) === true) {
          if (heuristic === 'label') {
            selector = [
              `id(string(//label[normalize-space(.) = "${key}"]/@for))`,
              `//label[normalize-space(.) = "${key}"]//*[self::input or self::select or self::textarea]`,
            ].join(' | ');
          }

          elements = σ.$x(selector, null, form);
        } else {
          throw new Error(`Heuristic '${heuristic}' is unknown.`);
        }

        if (elements.length > 0) {
          let type = (elements[0].getAttribute('type') || elements[0].nodeName).toLowerCase();
          let values = (Array.isArray(value) === true) ? value : [value];

          if (type === 'file') {
            throw new Error(`Input element of type 'file' is not supported.`);
          }

          for (let element of elements) {
            try {
              element.focus(); element.dispatchEvent(new Event('focus'));
            } catch (error) {
            }

            if (['checkbox', 'radio'].includes(type) === true) {
              element.checked = (value === true) || values.includes(element.value);

              if (element.checked === true) {
                result[key].push(element.value);
              }
            } else if (type === 'select') {
              element.value = undefined;

              for (let index of ['value', 'label']) {
                if (result[key].length > 0) {
                  break;
                }

                for (let option of Array.from(element.options)) {
                  option.selected = values.includes(option[index]);

                  if (option.selected === true) {
                    result[key].push(option.value);

                    if (element.multiple !== true) {
                      break;
                    }
                  }
                }
              }
            } else if (element.isContentEditable === true) {
              element.textContent = value;
            } else {
              element.value = value;
            }

            for (let trigger of ['input', 'change']) {
              element.dispatchEvent(new Event(trigger, { 'bubbles': true }));
            }

            try {
              element.blur(); element.dispatchEvent(new Event('blur'));
            } catch (error) {
            }

            if (['checkbox', 'radio'].includes(type) !== true) {
              break;
            }
          }
        } else {
          throw new Error(`No elements match the selector '${selector}' for '${key}'.`);
        }
      }

      return result;
    },
    form, data, heuristic
  );
};

Super.prototype.number = function (selector, decimal = null, index = null, property = 'textContent') {
  return this.$eval(
    selector,
    (element, decimal, index, property) => {
      return σ.$number(element, decimal, index, property);
    },
    decimal, index, property
  );
};

Super.prototype.selectByLabel = function (selector, ...values) {
  for (let value of values) {
    console.assert(typeof value === 'string', `Values must be strings. Found value '${value}' of type '${typeof value}'.`);
  }

  return this.$eval(
    selector,
    (element, values) => {
      if (element.nodeName.toLowerCase() !== 'select') {
        throw new Error('Element is not a <select> element.');
      }

      element.value = undefined;

      let result = [];
      let options = Array.from(element.options);

      for (let option of options) {
        option.selected = values.includes(option.label);

        if (option.selected === true) {
          result.push(option.value);

          if (option.multiple !== true) {
            break;
          }
        }
      }

      for (let trigger of ['input', 'change']) {
        element.dispatchEvent(new Event(trigger, { 'bubbles': true }));
      }

      return result;
    },
    values
  );
};

Super.prototype.string = function (selector, property = 'textContent') {
  return this.$eval(
    selector,
    (element, property) => {
      return σ.$string(element, property);
    },
    property
  );
};

Super.prototype.waitUntilVisible = function (selector, timeout = null) {
  return this.waitFor(selector, {
    visible: true,
    timeout: timeout || this._defaultNavigationTimeout,
  });
};

Super.prototype.waitWhileVisible = function (selector, timeout = null) {
  return this.waitFor(selector, {
    hidden: true,
    timeout: timeout || this._defaultNavigationTimeout,
  });
};
