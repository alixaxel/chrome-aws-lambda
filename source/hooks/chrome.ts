import { Page } from 'puppeteer-core';
import { Writeable } from '../../typings/chrome-aws-lambda';

/**
 * Mocks the global `chrome` property to mimic headful Chrome.
 *
 * @param page - Page to hook to.
 */
export = async function (page: Page): Promise<Page> {
  const handler = () => {
    let alpha = Date.now();
    let delta = Math.floor(500 * Math.random());

    if ((window as any).chrome === undefined) {
      Object.defineProperty(window, 'chrome', {
        configurable: false,
        enumerable: true,
        value: {},
        writable: true,
      });
    }

    /**
     * https://github.com/berstend/puppeteer-extra/blob/master/packages/puppeteer-extra-plugin-stealth/evasions/chrome.app/index.js
     */
    if ((window as any).chrome.app === undefined) {
      const InvocationError = (callback: string) => {
        /**
         * Truncates every line of the stack trace (with the exception of the first), until `search` is found.
         */
        const truncateStackTrace = (error: Error, search: string) => {
          const stack = error.stack.split('\n');
          const index = stack.findIndex((value: string) => value.trim().startsWith(search));

          if (index > 0) {
            error.stack = [stack[0], ...stack.slice(index + 1)].join('\n');
          }

          return error;
        };

        return truncateStackTrace(new TypeError(`Error in invocation of app.${callback}()`), `at ${callback} (eval at <anonymous>`);
      };

      Object.defineProperty((window as any).chrome, 'app', {
        value: {
          InstallState: {
            DISABLED: 'disabled',
            INSTALLED: 'installed',
            NOT_INSTALLED: 'not_installed',
          },
          RunningState: {
            CANNOT_RUN: 'cannot_run',
            READY_TO_RUN: 'ready_to_run',
            RUNNING: 'running',
          },
          get isInstalled() {
            return false;
          },
          getDetails: function getDetails(): null {
            if (arguments.length > 0) {
              throw InvocationError('getDetails');
            }

            return null;
          },
          getIsInstalled: function getIsInstalled() {
            if (arguments.length > 0) {
              throw InvocationError('getIsInstalled');
            }

            return false;
          },
          runningState: function runningState() {
            if (arguments.length > 0) {
              throw InvocationError('runningState');
            }

            return 'cannot_run';
          },
        },
      });
    }

    let timing: Partial<PerformanceTiming> = {
      navigationStart: alpha + 1 * delta,
      domContentLoadedEventEnd: alpha + 4 * delta,
      responseStart: alpha + 2 * delta,
      loadEventEnd: alpha + 5 * delta,
    };

    if (window.performance?.timing !== undefined) {
      timing = window.performance.timing;
    }

    /**
     * https://github.com/berstend/puppeteer-extra/tree/master/packages/puppeteer-extra-plugin-stealth/evasions/chrome.csi
     */
    if ((window as any).chrome.csi === undefined) {
      Object.defineProperty((window as any).chrome, 'csi', {
        value: function csi() {
          return {
            startE: timing.navigationStart,
            onloadT: timing.domContentLoadedEventEnd,
            pageT: Date.now() - timing.navigationStart + Math.random().toFixed(3),
            tran: 15,
          };
        },
      });
    }

    /**
     * https://github.com/berstend/puppeteer-extra/tree/master/packages/puppeteer-extra-plugin-stealth/evasions/chrome.loadTimes
     */
    if ((window as any).chrome.loadTimes === undefined) {
      let navigation: Writeable<Partial<PerformanceNavigationTiming>> = {
        nextHopProtocol: 'h2',
        startTime: 3 * delta,
        type: 'other' as any,
      };

      if (typeof window.performance?.getEntriesByType === 'function') {
        let entries = {
          navigation: window.performance.getEntriesByType('navigation') as PerformanceNavigationTiming[],
          paint: window.performance.getEntriesByType('paint') as PerformanceNavigationTiming[],
        };

        if (entries.navigation.length > 0) {
          navigation = entries.navigation.shift();
        }

        if (entries.paint.length > 0) {
          navigation.startTime = entries.paint.shift().startTime;
        }
      }

      Object.defineProperty((window as any).chrome, 'loadTimes', {
        value: function loadTimes() {
          return {
            get commitLoadTime() {
              return timing.responseStart / 1000;
            },
            get connectionInfo() {
              return navigation.nextHopProtocol;
            },
            get finishDocumentLoadTime() {
              return timing.domContentLoadedEventEnd / 1000;
            },
            get finishLoadTime() {
              return timing.loadEventEnd / 1000;
            },
            get firstPaintAfterLoadTime() {
              return 0;
            },
            get firstPaintTime() {
              return parseFloat(((navigation.startTime + (window.performance?.timeOrigin ?? timing.navigationStart)) / 1000).toFixed(3));
            },
            get navigationType() {
              return navigation.type;
            },
            get npnNegotiatedProtocol() {
              return ['h2', 'hq'].includes(navigation.nextHopProtocol) ? navigation.nextHopProtocol : 'unknown';
            },
            get requestTime() {
              return timing.navigationStart / 1000;
            },
            get startLoadTime() {
              return timing.navigationStart / 1000;
            },
            get wasAlternateProtocolAvailable() {
              return false;
            },
            get wasFetchedViaSpdy() {
              return ['h2', 'hq'].includes(navigation.nextHopProtocol);
            },
            get wasNpnNegotiated() {
              return ['h2', 'hq'].includes(navigation.nextHopProtocol);
            },
          };
        },
      });
    };
  }

  await page.evaluate(handler);
  await page.evaluateOnNewDocument(handler);

  return page;
}
