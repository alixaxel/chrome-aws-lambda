---
name: Bug Report
about: Standard Bug Report
title: "[BUG]"
labels: bug
---

<!---
For Chromium-specific bugs, please refer to: https://bugs.chromium.org/p/chromium
For Puppeteer-specific bugs, please refer to: https://github.com/GoogleChrome/puppeteer/issues
-->

## Environment
* `chrome-aws-lambda` Version:
* `puppeteer` / `puppeteer-core` Version:
* OS: <!-- Linux | Mac | Windows -->
* Node.js Version: <!-- 8.x | 10.x | 12.x | 14.x -->
* Lambda / GCF Runtime: <!-- `nodejs8.10` | `nodejs10.x` | `nodejs12.x` -->

## Expected Behavior

<!-- What should have happened. -->

## Current Behavior

<!-- What happened instead. -->

## Steps to Reproduce

<!-- Include code and/or URLs to reproduce this issue. -->

<!--
```js
const chromium = require('chrome-aws-lambda');

exports.handler = async (event, context, callback) => {
  let result = null;
  let browser = null;

  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    let page = await browser.newPage();

    await page.goto(event.url || 'https://example.com');

    result = await page.title();
  } catch (error) {
    return callback(error);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }

  return callback(null, result);
};
```
-->

## Possible Solution

<!-- Not mandatory, but you can suggest a fix or reason for the bug. -->
