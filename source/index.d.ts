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
export const puppeteer: typeof import('puppeteer');
