import { Page, PuppeteerNode, Viewport } from 'puppeteer-core';

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
    clickAndWaitForRequest(predicate: ((request: HTTPRequest) => boolean), options?: WaitTimeoutOptions): Promise<HTTPRequest>;

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
    clickAndWaitForResponse(predicate: ((request: HTTPResponse) => boolean), options?: WaitTimeoutOptions): Promise<HTTPResponse>;

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
    number<T = HTMLElement>(decimal?: string, property?: KeysOfType<T, string>): Promise<number[]>;

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
    string<T = HTMLElement>(property?: KeysOfType<T, string>): Promise<string>;
  }

  interface Frame {
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
    clickAndWaitForRequest(selector: string, predicate: ((request: HTTPRequest) => boolean), options?: WaitTimeoutOptions): Promise<HTTPRequest>;

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
    clickAndWaitForResponse(selector: string, predicate: ((request: HTTPResponse) => boolean), options?: WaitTimeoutOptions): Promise<HTTPResponse>;

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
    waitForText(predicate: string, options?: WaitTimeoutOptions): Promise<ElementHandle>;

    /**
     * Waits for element to be present in DOM and to be visible.
     *
     * @param selector - Selector to query for.
     * @param options - Optional waiting parameters.
     */
    waitUntilVisible(selector: string, options?: WaitTimeoutOptions): Promise<ElementHandle>;

    /**
     * Waits for element to not be found in the DOM or to be hidden.
     *
     * @param selector - Selector to query for.
     * @param options - Optional waiting parameters.
     */
    waitWhileVisible(selector: string, options?: WaitTimeoutOptions): Promise<ElementHandle>;
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
    clickAndWaitForRequest(selector: string, predicate: ((request: HTTPRequest) => boolean), options?: WaitTimeoutOptions): Promise<HTTPRequest>;

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
    clickAndWaitForResponse(selector: string, predicate: ((request: HTTPResponse) => boolean), options?: WaitTimeoutOptions): Promise<HTTPResponse>;

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
    waitForText(predicate: string, options?: WaitTimeoutOptions): Promise<ElementHandle>;

    /**
     * Waits for element to be present in DOM and to be visible.
     *
     * @param selector - Selector to query for.
     * @param options - Optional waiting parameters.
     */
    waitUntilVisible(selector: string, options?: WaitTimeoutOptions): Promise<ElementHandle>;

    /**
     * Waits for element to not be found in the DOM or to be hidden.
     *
     * @param selector - Selector to query for.
     * @param options - Optional waiting parameters.
     */
    waitWhileVisible(selector: string, options?: WaitTimeoutOptions): Promise<ElementHandle>;

    /**
     * Encapsulates the callback execution in a tracing session.
     *
     * @param options Tracing options.
     * @param callback Callback to execute.
     */
    withTracing(options: TracingOptions, callback: (page: Page) => Promise<any>): Promise<Buffer>;
  }
}
