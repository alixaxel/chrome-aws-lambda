import { BrowserOptions, DirectNavigationOptions, ElementHandle, NavigationOptions, ResourceType, Response } from 'puppeteer';

declare namespace Chromium {
  export interface Frame {
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
     * Fills a `form` with a variable number of inputs and returns its filled state.
     *
     * @param form - Selector to query the `form` element for.
     * @param data - Data to fill the form, as a selector-value[s] map.
     * @param heuristic - Heuristic to use for form input selectors.
     */
    fill<T extends Record<string, string | boolean | string[]>>(form: string, data: T, heuristic?: 'css' | 'label' | 'name' | 'xpath'): Promise<Record<keyof T, string[]>>;

    /**
     * Returns normalized number(s) found in the given selector.
     *
     * @param selector - Selector to query for.
     * @param decimal - Decimal separator to use, defaults to `.`.
     * @param index - Element to return.
     * @param property - Element property to extract content from, defaults to `textContent`.
     */
    number(selector: string, decimal?: string, index?: null, property?: string): Promise<number[]>;
    number(selector: string, decimal?: string, index?: number, property?: string): Promise<number>;

    /**
     * Selects multiple `select` options by label and returns the values of the selection.
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
    string(selector: string, property?: string): Promise<string | string[]>;

    /**
     * Waits for element to be present in DOM and to be visible.
     *
     * @param selector - Selector to query for.
     * @param timeout - How long to wait for, in milliseconds.
     */
    waitUntilVisible(selector: string, timeout?: number): Promise<ElementHandle>;

    /**
     * Waits for element to not be found in the DOM or to be hidden.
     *
     * @param selector - Selector to query for.
     * @param timeout - How long to wait for, in milliseconds.
     */
    waitWhileVisible(selector: string, timeout?: number): Promise<ElementHandle>;
  }

  export interface Page extends Frame {
    /**
     * Aborts requests for every other resource type.
     *
     * @param resources Resource types to allow.
     */
    allow(...resources: ResourceType[]): Promise<true>;

    /**
     * Aborts requests for the specified resource types.
     *
     * @param resources Resource types to block.
     */
    block(...resources: ResourceType[]): Promise<true>;

    /**
     * Clicks an element and waits for navigation to finish.
     *
     * @param selector - Selector to query for.
     * @param options - How long to wait for, in milliseconds.
     */
    clickAndWaitForNavigation(selector: string, options?: NavigationOptions): Promise<Response>;

    /**
     * @deprecated Use `page.goto()` instead.
     */
    go(url: string, options?: DirectNavigationOptions): Promise<Response>;
  }

  export interface σ {
    /**
     * Returns the first element that matches the selector.
     *
     * @param selector - Selector to query for.
     * @param context - Context to operate on, defaults to `document`.
     */
    $(selector: string, context?: Node): Element;

    /**
     * Returns all the elements that match the selector.
     *
     * @param selector - Selector to query for.
     * @param index - Element to return.
     * @param context - Context to operate on, defaults to `document`.
     */
    $$(selector: string, index?: null, context?: Node): Element[];
    $$(selector: string, index?: number, context?: Node): Element;

    /**
     * Returns all the nodes that match the XPath expression.
     *
     * @param expression - XPath expression.
     * @param index - Element to return.
     * @param context - Context to operate on, defaults to `document`.
     */
    $x(expression: string, index?: null, context?: Node): Node[];
    $x(expression: string, index?: number, context?: Node): Node;

    /**
     * Returns normalized number(s) found in the provided `data`.
     *
     * @param data - Node or string to extract numbers from.
     * @param decimal - Decimal separator to use, defaults to `.`.
     * @param index - Element to return.
     * @param property - Element property to extract content from, defaults to `textContent`.
     */
    $number(data: string | Node, decimal?: string, index?: null, property?: string): number[];
    $number(data: string | Node, decimal?: string, index?: number, property?: string): number;
    $number(data: null, decimal?: string, index?: null | number, property?: string): null;

    /**
     * Returns normalized text found in the provided `data`.
     *
     * @param data - Node or string (or map of) to extract strings from.
     * @param property - Element property to extract content from, defaults to `textContent`.
     */
    $string<T extends Record<string, string | Node>>(data: T, property?: string): Record<keyof T, string>;
    $string(data: (string | Node)[] | NodeList, property?: string): string[];
    $string(data: string | Node, property?: string): string;
    $string(data: null, property?: string): null;

    /**
     * Returns regex matches found in the provided `data`.
     *
     * @param data - Node or string to extract regex matches from.
     * @param pattern - Regex pattern.
     * @param index - Element to return.
     * @param property - Element property to extract content from, defaults to `textContent`.
     */
    $regexp(data: string | Node, pattern: string | RegExp, index?: null, property?: string): string[] | null;
    $regexp(data: string | Node, pattern: string | RegExp, index?: number, property?: string): string | null;
    $regexp(data: null, pattern: string | RegExp, index?: null | number, property?: string): null;
  }
}

declare class Chromium {
  /**
   * Downloads or symlinks a custom font and returns its basename, patching the environment so that Chromium can find it.
   * If not running on AWS Lambda nor Google Cloud Functions, `null` is returned instead.
   *
   * @param input - URL or file path of font face.
   */
  static font(input: string): Promise<string>;

  /**
   * Returns a list of recommended additional Chromium flags.
   */
  static get args(): string[];

  /**
   * Returns more sensible default viewport settings.
   */
  static get defaultViewport(): Required<BrowserOptions['defaultViewport']>;

  /**
   * Inflates the current version of Chromium and returns the path to the binary.
   * If not running on AWS Lambda nor Google Cloud Functions, `null` is returned instead.
   */
  static get executablePath(): Promise<string>;

  /**
   * Returns a boolean indicating if we are running on AWS Lambda or Google Cloud Functions.
   * Returns false if Serverless environment variable `IS_LOCAL` is set.
   */
  static get headless(): boolean;

  /**
   * Overloads puppeteer with useful methods and returns the resolved package.
   */
  static get puppeteer(): typeof import('puppeteer');
}

declare global {
  export interface Window {
    σ: Chromium.σ
  }
}

declare module 'puppeteer' {
  export interface Browser extends BrowserContext {
    /**
     * Returns a new page overloaded with browser-context methods.
     *
     * @param hooks - Optional hooks to apply on the new page.
     */
    newPage(...hooks: ((page: Page) => Page)[]): Promise<Page>;
    targets(): Target[];
  }

  export interface Page extends Chromium.Page {}
  export interface Frame extends Chromium.Frame {}
}

export = Chromium;
