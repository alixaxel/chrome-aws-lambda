import {
  Browser,
  BrowserFetcher,
  ChromeArgOptions,
  ConnectOptions,
  ElementHandle,
  FetcherOptions,
  LaunchOptions,
  NavigationOptions,
  Response,
} from 'puppeteer';

declare namespace Chromium {
  export interface CommonExtraFunctions {
    count: (selector: string) => unknown;
    exists: (selector: string) => unknown;
    fill: (form: unknown, data: unknown, heuristic?: string) => unknown;
    number: (selector: string, decimal?: number | null, index?: number | null, property?: string) => unknown;
    selectByLabel: (selector: string, ...values: unknown[]) => unknown;
    string: (selector: string, property?: string) => unknown;
    waitUntilVisible: (selector: string, timeout?: number | null) => Promise<ElementHandle>;
    waitWhileVisible: (selector: string, timeout?: number | null) => Promise<ElementHandle>;
  }

  export interface σ {
    $: (selector: string, context?: unknown) => void;
    $$: (selector: string, index?: number | null, context?: unknown) => void;
    $x: (expression: unknown, index?: number | null, context?: unknown) => void;
    $number: (data: unknown, decimal?: number | null, index?: number | null, property?: string) => void;
    $string: (data: unknown, property?: string) => void;
    $regexp: (data: unknown, pattern: RegExp, index?: number | null, property?: string) => void;
  }
}

declare class Chromium {
  static font(input: string): Promise<string>;
  static get args(): string[]
  static get defaultViewport(): {
    deviceScaleFactor: number;
    hasTouch: boolean;
    height: number;
    isLandscape: boolean;
    isMobile: boolean;
    width: number;
  }

  static get executablePath(): Promise<string>
  static get headless(): boolean;
  static get puppeteer(): typeof import('puppeteer');
}

export = Chromium;

declare global {
  export interface Window {
    σ: Chromium.σ
  }
}

declare module 'puppeteer' {
  export interface Page extends Chromium.CommonExtraFunctions {
    clickAndWaitForNavigation: (selector: unknown, options?: NavigationOptions) => Promise<Response>;
    go: (url: unknown, options?: unknown | null) => unknown;
  }

  export interface Frame extends Chromium.CommonExtraFunctions {}
}
