import { Browser, ChromeArgOptions, ConnectOptions, LaunchOptions } from 'puppeteer';

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
  defaultArgs(options?: ChromeArgOptions): string[];
  executablePath(): string;
  launch(options?: LaunchOptions): Promise<Browser>;
};
