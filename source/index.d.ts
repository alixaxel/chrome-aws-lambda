import { Browser, BrowserFetcher, ChromeArgOptions, ConnectOptions, FetcherOptions, LaunchOptions } from 'puppeteer';

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
