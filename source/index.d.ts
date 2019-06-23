import { Browser, BrowserFetcher, ChromeArgOptions, ConnectOptions, FetcherOptions, LaunchOptions } from 'puppeteer';

export const font: (input: string) => Promise<string>;

export const args: string[];
export const defaultViewport: {
  deviceScaleFactor: number;
  hasTouch: boolean;
  height: number;
  isLandscape: boolean;
  isMobile: boolean;
  width: number;
};

export const executablePath: Promise<string>;
export const headless: boolean;
export const puppeteer: {
  connect(options?: ConnectOptions): Promise<Browser>;
  createBrowserFetcher(options?: FetcherOptions): BrowserFetcher;
  defaultArgs(options?: ChromeArgOptions): string[];
  devices: any;
  errors: any;
  executablePath(): string;
  launch(options?: LaunchOptions): Promise<Browser>;
};
