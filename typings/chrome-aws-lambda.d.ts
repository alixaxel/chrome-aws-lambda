import { Page } from 'puppeteer-core';

export type Hook = (page: Page) => Promise<Page>;
export type KeysOfType<T, V> = { [K in keyof T]: T[K] extends V ? K : never }[keyof T]
export type Prototype<T = any> = T & { prototype: T };
export type Writeable<T> = { -readonly [P in keyof T]: T[P] };

declare module 'puppeteer-core' {
  interface Browser {
    /**
     * Returns the browser default page.
     *
     * @param hooks - Optional hooks to apply on the page.
     */
    defaultPage(...hooks: Hook[]): Promise<Page>;

    /**
     * Returns a new page overloaded with browser-context methods.
     *
     * @param hooks - Optional hooks to apply on the new page.
     */
    newPage(...hooks: Hook[]): Promise<Page>;
  }

  interface BrowserContext {
    /**
     * Returns the browser context default page.
     *
     * @param hooks - Optional hooks to apply on the page.
     */
    defaultPage(...hooks: Hook[]): Promise<Page>;

    /**
     * Returns a new page overloaded with browser-context methods.
     *
     * @param hooks - Optional hooks to apply on the new page.
     */
    newPage(...hooks: Hook[]): Promise<Page>;
  }

  interface ElementHandle {
    /**
     * Selects all text in a editable element and clears it.
     */
    clear(): Promise<void>;

    /**
     * Clicks an element and waits for navigation to finish.
     *
     * @param options - Options to configure when the navigation is consided finished.
     */
    clickAndWaitForNavigation(options?: WaitForOptions): Promise<HTTPResponse>;

    /**
     * Clicks an element and waits for a request to be initiated.
     *
     * @param predicate - URL pattern to wait for, wildcards `*` are allowed.
     * @param options - Optional waiting parameters.
     */
    clickAndWaitForRequest(predicate: string | RegExp, options?: WaitTimeoutOptions): Promise<HTTPRequest>;

    /**
     * Clicks an element and waits for a request to be initiated.
     *
     * @param predicate - Predicate to wait for.
     * @param options - Optional waiting parameters.
     */
    clickAndWaitForRequest(predicate: ((request: HTTPRequest) => boolean | Promise<boolean>), options?: WaitTimeoutOptions): Promise<HTTPRequest>;

    /**
     * Clicks an element and waits for a request to be finalized.
     *
     * @param predicate - URL pattern to wait for, wildcards `*` are allowed.
     * @param options - Optional waiting parameters.
     */
    clickAndWaitForResponse(predicate: string | RegExp, options?: WaitTimeoutOptions): Promise<HTTPResponse>;

    /**
     * Clicks an element and waits for a request to be finalized.
     *
     * @param predicate - Predicate to wait for.
     * @param options - Optional waiting parameters.
     */
    clickAndWaitForResponse(predicate: ((request: HTTPResponse) => boolean | Promise<boolean>), options?: WaitTimeoutOptions): Promise<HTTPResponse>;

    /**
     * Fills a `form` with a variable number of inputs and returns its actual filled state.
     *
     * @param data - Data to fill the form, as a label-value[s] map.
     */
    fillFormByLabel<T extends Record<string, boolean | string | string[]>>(data: T): Promise<Record<keyof T, string[]>>;

    /**
     * Fills a `form` with a variable number of inputs and returns its actual filled state.
     *
     * @param data - Data to fill the form, as a name-value[s] map.
     */
    fillFormByName<T extends Record<string, boolean | string | string[]>>(data: T): Promise<Record<keyof T, string[]>>;

    /**
     * Fills a `form` with a variable number of inputs and returns its actual filled state.
     *
     * @param data - Data to fill the form, as a selector-value[s] map.
     */
    fillFormBySelector<T extends Record<string, boolean | string | string[]>>(data: T): Promise<Record<keyof T, string[]>>;

    /**
     * Fills a `form` with a variable number of inputs and returns its actual filled state.
     *
     * @param data - Data to fill the form, as a XPath selector-value[s] map.
     */
    fillFormByXPath<T extends Record<string, boolean | string | string[]>>(data: T): Promise<Record<keyof T, string[]>>;

    /**
     * Returns the `innerHTML` property of the element.
     */
    getInnerHTML(): Promise<string>;

    /**
     * Returns the `innerText` property of the element.
     */
    getInnerText(): Promise<string>;

    /**
     * Returns normalized number(s) found in the given element.
     *
     * @param decimal - Decimal separator to use, defaults to `.`.
     * @param property - Element property to extract content from, defaults to `textContent`.
     */
    number(decimal?: string, property?: any): Promise<number[]>;

    /**
     * Selects multiple `select` options by label and returns the values of the actual selection.
     *
     * @param values - Option labels to select.
     */
    selectByLabel(...values: string[]): Promise<string[]>;

    /**
     * Returns normalized text found in the given element.
     *
     * @param property - Element property to extract content from, defaults to `textContent`.
     */
    string(property?: any): Promise<string>;
  }

  interface Frame {
    /**
     * Selects all text in a editable element and clears it.
     *
     * @param selector - Selector to query for.
     */
    clear(selector: string): Promise<void>;

    /**
     * Clicks an element and waits for navigation to finish.
     *
     * @param selector - Selector to query for.
     * @param options - Options to configure when the navigation is consided finished.
     */
    clickAndWaitForNavigation(selector: string, options?: WaitForOptions): Promise<HTTPResponse>;

    /**
     * Clicks an element and waits for a request to be initiated.
     *
     * @param selector - Selector to query for.
     * @param pattern - URL pattern to wait for, wildcards `*` are allowed.
     * @param options - Optional waiting parameters.
     */
    clickAndWaitForRequest(selector: string, predicate: string | RegExp, options?: WaitTimeoutOptions): Promise<HTTPRequest>;

    /**
     * Clicks an element and waits for a request to be initiated.
     *
     * @param selector - Selector to query for.
     * @param pattern - Predicate to wait for.
     * @param options - Optional waiting parameters.
     */
    clickAndWaitForRequest(selector: string, predicate: ((request: HTTPRequest) => boolean | Promise<boolean>), options?: WaitTimeoutOptions): Promise<HTTPRequest>;

    /**
     * Clicks an element and waits for a request to be finalized.
     *
     * @param selector - Selector to query for.
     * @param predicate - URL pattern to wait for, wildcards `*` are allowed.
     * @param options - Optional waiting parameters.
     */
    clickAndWaitForResponse(selector: string, predicate: string | RegExp, options?: WaitTimeoutOptions): Promise<HTTPResponse>;

    /**
     * Clicks an element and waits for a request to be finalized.
     *
     * @param selector - Selector to query for.
     * @param predicate - Predicate to wait for.
     * @param options - Optional waiting parameters.
     */
    clickAndWaitForResponse(selector: string, predicate: ((request: HTTPResponse) => boolean | Promise<boolean>), options?: WaitTimeoutOptions): Promise<HTTPResponse>;

    /**
     * Returns the total number of elements that match the selector.
     *
     * @param selector - Selector to query for.
     */
    count(selector: string): Promise<number>;

    /**
     * Checks whether at least one element matching the selector exists.
     *
     * @param selector - Selector to query for.
     */
    exists(selector: string): Promise<boolean>;

    /**
     * Fills a `form` with a variable number of inputs and returns its actual filled state.
     *
     * @param selector - Selector to query the `form` element for.
     * @param data - Data to fill the form, as a label-value[s] map.
     */
    fillFormByLabel<T extends Record<string, boolean | string | string[]>>(selector: string, data: T): Promise<Record<keyof T, string[]>>;

    /**
     * Fills a `form` with a variable number of inputs and returns its actual filled state.
     *
     * @param selector - Selector to query the `form` element for.
     * @param data - Data to fill the form, as a name-value[s] map.
     */
    fillFormByName<T extends Record<string, boolean | string | string[]>>(selector: string, data: T): Promise<Record<keyof T, string[]>>;

    /**
     * Fills a `form` with a variable number of inputs and returns its actual filled state.
     *
     * @param selector - Selector to query the `form` element for.
     * @param data - Data to fill the form, as a selector-value[s] map.
     */
    fillFormBySelector<T extends Record<string, boolean | string | string[]>>(selector: string, data: T): Promise<Record<keyof T, string[]>>;

    /**
     * Fills a `form` with a variable number of inputs and returns its actual filled state.
     *
     * @param selector - Selector to query the `form` element for.
     * @param data - Data to fill the form, as a XPath selector-value[s] map.
     */
    fillFormByXPath<T extends Record<string, boolean | string | string[]>>(selector: string, data: T): Promise<Record<keyof T, string[]>>;

    /**
     * Returns normalized number(s) found in the given element.
     *
     * @param selector - Selector to query for.
     * @param decimal - Decimal separator to use, defaults to `.`.
     * @param property - Element property to extract content from, defaults to `textContent`.
     */
    number<T = HTMLElement>(selector: string, decimal?: string, property?: KeysOfType<T, string>): Promise<number[]>;

    /**
     * Selects multiple `select` options by label and returns the values of the actual selection.
     *
     * @param selector - Selector to query the `select` element for.
     * @param values - Option labels to select.
     */
    selectByLabel(selector: string, ...values: string[]): Promise<string[]>;

    /**
     * Returns normalized text found in the given selector.
     *
     * @param selector - Selector to query for.
     * @param property - Element property to extract content from, defaults to `textContent`.
     */
    string<T = HTMLElement>(selector: string, property?: KeysOfType<T, string>): Promise<string>;

    /**
     * Wait for a string to be present and visible.
     *
     * @param predicate - String to wait for.
     * @param options - Optional waiting parameters.
     */
    waitForText(predicate: string, options?: WaitTimeoutOptions): Promise<ElementHandle<Node>>;

    /**
     * Waits for element to be present in DOM and to be visible.
     *
     * @param selector - Selector to query for.
     * @param options - Optional waiting parameters.
     */
    waitUntilVisible(selector: string, options?: WaitTimeoutOptions): Promise<ElementHandle<Node>>;

    /**
     * Waits for element to not be found in the DOM or to be hidden.
     *
     * @param selector - Selector to query for.
     * @param options - Optional waiting parameters.
     */
    waitWhileVisible(selector: string, options?: WaitTimeoutOptions): Promise<ElementHandle<Node>>;
  }

  interface Page {
    /**
     * Blocks URLs from loading without initializing request interception.
     * Experimental: https://chromedevtools.github.io/devtools-protocol/tot/Network/#method-setBlockedURLs
     *
     * @param patterns - URL patterns to block, wildcards `*` are allowed.
     */
    block(patterns: string[]): Promise<void>;

    /**
     * Selects all text in a editable element and clears it.
     *
     * @param selector - Selector to query for.
     */
    clear(selector: string): Promise<void>;

    /**
     * Clicks an element and waits for navigation to finish.
     *
     * @param selector - Selector to query for.
     * @param options - Options to configure when the navigation is consided finished.
     */
    clickAndWaitForNavigation(selector: string, options?: WaitForOptions): Promise<HTTPResponse>;

    /**
     * Clicks an element and waits for a request to be initiated.
     *
     * @param selector - Selector to query for.
     * @param predicate - URL pattern to wait for, wildcards `*` are allowed.
     * @param options - Optional waiting parameters.
     */
    clickAndWaitForRequest(selector: string, predicate: string | RegExp, options?: WaitTimeoutOptions): Promise<HTTPRequest>;

    /**
     * Clicks an element and waits for a request to be initiated.
     *
     * @param selector - Selector to query for.
     * @param predicate - Predicate to wait for.
     * @param options - Optional waiting parameters.
     */
    clickAndWaitForRequest(selector: string, predicate: ((request: HTTPRequest) => boolean | Promise<boolean>), options?: WaitTimeoutOptions): Promise<HTTPRequest>;

    /**
     * Clicks an element and waits for a request to be finalized.
     *
     * @param selector - Selector to query for.
     * @param predicate - URL pattern to wait for, wildcards `*` are allowed.
     * @param options - Optional waiting parameters.
     */
    clickAndWaitForResponse(selector: string, predicate: string | RegExp, options?: WaitTimeoutOptions): Promise<HTTPResponse>;

    /**
     * Clicks an element and waits for a request to be finalized.
     *
     * @param selector - Selector to query for.
     * @param predicate - Predicate to wait for.
     * @param options - Optional waiting parameters.
     */
    clickAndWaitForResponse(selector: string, predicate: ((request: HTTPResponse) => boolean | Promise<boolean>), options?: WaitTimeoutOptions): Promise<HTTPResponse>;

    /**
     * Returns the total number of elements that match the selector.
     *
     * @param selector - Selector to query for.
     */
    count(selector: string): Promise<number>;

    /**
     * Checks whether at least one element matching the selector exists.
     *
     * @param selector - Selector to query for.
     */
    exists(selector: string): Promise<boolean>;

    /**
     * Fills a `form` with a variable number of inputs and returns its actual filled state.
     *
     * @param selector - Selector to query the `form` element for.
     * @param data - Data to fill the form, as a label-value[s] map.
     */
    fillFormByLabel<T extends Record<string, boolean | string | string[]>>(selector: string, data: T): Promise<Record<keyof T, string[]>>;

    /**
     * Fills a `form` with a variable number of inputs and returns its actual filled state.
     *
     * @param selector - Selector to query the `form` element for.
     * @param data - Data to fill the form, as a name-value[s] map.
     */
    fillFormByName<T extends Record<string, boolean | string | string[]>>(selector: string, data: T): Promise<Record<keyof T, string[]>>;

    /**
     * Fills a `form` with a variable number of inputs and returns its actual filled state.
     *
     * @param selector - Selector to query the `form` element for.
     * @param data - Data to fill the form, as a selector-value[s] map.
     */
    fillFormBySelector<T extends Record<string, boolean | string | string[]>>(selector: string, data: T): Promise<Record<keyof T, string[]>>;

    /**
     * Fills a `form` with a variable number of inputs and returns its actual filled state.
     *
     * @param selector - Selector to query the `form` element for.
     * @param data - Data to fill the form, as a XPath selector-value[s] map.
     */
    fillFormByXPath<T extends Record<string, boolean | string | string[]>>(selector: string, data: T): Promise<Record<keyof T, string[]>>;

    /**
     * Returns normalized number(s) found in the given element.
     *
     * @param selector - Selector to query for.
     * @param decimal - Decimal separator to use, defaults to `.`.
     * @param property - Element property to extract content from, defaults to `textContent`.
     */
    number<T = HTMLElement>(selector: string, decimal?: string, property?: KeysOfType<T, string>): Promise<number[]>;

    /**
     * Selects multiple `select` options by label and returns the values of the actual selection.
     *
     * @param selector - Selector to query the `select` element for.
     * @param values - Option labels to select.
     */
    selectByLabel(selector: string, ...values: string[]): Promise<string[]>;

    /**
     * Returns normalized text found in the given selector.
     *
     * @param selector - Selector to query for.
     * @param property - Element property to extract content from, defaults to `textContent`.
     */
    string<T = HTMLElement>(selector: string, property?: KeysOfType<T, string>): Promise<string>;

    /**
     * Wait for the total number of inflight requests to not exceed a specific threshold.
     *
     * @param requests Maximum number of inflight requests, defaults to 0.
     * @param alpha The number of milliseconds to wait for any requests to be issued, defaults to `500` ms.
     * @param omega The number of milliseconds to wait for any outstanding inflight requests to settle, defaults to `500` ms.
     * @param options Optional waiting parameters. Defaults to the navigation timeout, pass 0 to disable.
     *
     * @author [mifi](https://github.com/puppeteer/puppeteer/issues/1353#issuecomment-629271737)
     * @author [DevBrent](https://github.com/puppeteer/puppeteer/issues/1353#issuecomment-648299486)
     */
    waitForInflightRequests(requests?: number, alpha?: number, omega?: number, options?: WaitTimeoutOptions): Promise<void>;

    /**
     * Wait for a string to be present and visible.
     *
     * @param predicate - String to wait for.
     * @param options - Optional waiting parameters.
     */
    waitForText(predicate: string, options?: WaitTimeoutOptions): Promise<ElementHandle<Node>>;

    /**
     * Waits for element to be present in DOM and to be visible.
     *
     * @param selector - Selector to query for.
     * @param options - Optional waiting parameters.
     */
    waitUntilVisible(selector: string, options?: WaitTimeoutOptions): Promise<ElementHandle<Node>>;

    /**
     * Waits for element to not be found in the DOM or to be hidden.
     *
     * @param selector - Selector to query for.
     * @param options - Optional waiting parameters.
     */
    waitWhileVisible(selector: string, options?: WaitTimeoutOptions): Promise<ElementHandle<Node>>;

    /**
     * Encapsulates the callback execution in a tracing session.
     *
     * @param options Tracing options.
     * @param callback Callback to execute.
     */
    withTracing(options: TracingOptions, callback: (page: Page) => Promise<any>): Promise<Buffer>;
  }
}
