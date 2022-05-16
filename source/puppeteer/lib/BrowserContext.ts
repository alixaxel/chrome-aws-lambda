import { BrowserContext, Page } from 'puppeteer-core';
import { Hook, Prototype } from '../../../typings/chrome-aws-lambda';

let Super: Prototype<BrowserContext> = null;

try {
  Super = require('puppeteer/lib/cjs/puppeteer/common/Browser.js').BrowserContext;
} catch (error) {
  Super = require('puppeteer-core/lib/cjs/puppeteer/common/Browser.js').BrowserContext;
}

Super.prototype.defaultPage = async function (...hooks: Hook[]) {
  let page: Page = null;
  let pages: Page[] = await this.pages();

  if (pages.length === 0) {
    pages = [await this.newPage()];
  }

  page = pages.shift();

  if (hooks != null && Array.isArray(hooks) === true) {
    for (let hook of hooks) {
      page = await hook(page);
    }
  }

  return page;
};

let newPage: any = Super.prototype.newPage;

Super.prototype.newPage = async function (...hooks: Hook[]) {
  let page: Page = await newPage.apply(this, arguments);

  if (hooks != null && Array.isArray(hooks) === true) {
    for (let hook of hooks) {
      page = await hook(page);
    }
  }

  return page;
};
