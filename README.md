# chrome-aws-lambda

[![npm](https://img.shields.io/npm/v/chrome-aws-lambda.svg?style=for-the-badge)](https://www.npmjs.com/package/chrome-aws-lambda)
[![puppeteer](https://img.shields.io/badge/puppeteer-v1.3.0-blue.svg?style=for-the-badge)](https://github.com/GoogleChrome/puppeteer)
[![Chromium](https://img.shields.io/badge/chromium-31_MB-brightgreen.svg?style=for-the-badge)](bin/chromium.br)

Chromium Binary for AWS Lambda

## Install

```shell
$ npm i chrome-aws-lambda
```

This will ship with appropriate binary for the latest stable release of [`puppeteer`](https://github.com/GoogleChrome/puppeteer) (usually updated within a day).

If you wish to install an older version of Chromium, take a look at [Versioning](https://github.com/alixaxel/chrome-aws-lambda#versioning).

## API

| Method             | Returns              | Description                                               |
| ------------------ | -------------------- | --------------------------------------------------------- |
| `defaultArgs()`    | `{!Array<string>}`   | Provides a list of recommended additional Chromium flags. |
| `executablePath()` | `{?Promise<string>}` | Returns the path where the Chromium binary was extracted. |

## Usage

```javascript
const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer');

exports.handler = async (event, context) => {
  let result = null;
  let browser = null;

  try {
    browser = await puppeteer.launch({
      args: chromium.defaultArgs(),
      executablePath: await chromium.executablePath(),
    });

    let page = await browser.newPage();

    await page.goto(event.url || 'https://example.com');

    result = await page.title();
  } catch (error) {
    return context.fail(error);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }

  return context.succeed(result);
};
```

## Compiling

To compile your own version of Chromium take a look at the instructions in the [Ansible playbook](_/ansible).

## Compression

The Chromium binary is compressed using the Brotli algorithm.

This allows us to get the best compression ratio and faster decompression times.

| File        | Algorithm | Level | Bytes     | MiB       | %          | Inflation  |
| ----------- | --------- | ----- | --------- | --------- | ---------- | ---------- |
| chromium    | -         | -     | 136964856 | 130.62    | -          | -          |
| chromium.gz | Gzip      | 1     | 51662087  | 49.27     | 62.28%     | 1.035s     |
| chromium.gz | Gzip      | 2     | 50438352  | 48.10     | 63.17%     | 1.016s     |
| chromium.gz | Gzip      | 3     | 49428459  | 47.14     | 63.91%     | 0.968s     |
| chromium.gz | Gzip      | 4     | 47873978  | 45.66     | 65.05%     | 0.950s     |
| chromium.gz | Gzip      | 5     | 46929422  | 44.76     | 65.74%     | 0.938s     |
| chromium.gz | Gzip      | 6     | 46522529  | 44.37     | 66.03%     | 0.919s     |
| chromium.gz | Gzip      | 7     | 46406406  | 44.26     | 66.12%     | 0.917s     |
| chromium.gz | Gzip      | 8     | 46297917  | 44.15     | 66.20%     | 0.916s     |
| chromium.gz | Gzip      | 9     | 46270972  | 44.13     | 66.22%     | 0.968s     |
| chromium.gz | Zopfli    | 10    | 45089161  | 43.00     | 67.08%     | 0.919s     |
| chromium.gz | Zopfli    | 20    | 45085868  | 43.00     | 67.08%     | 0.919s     |
| chromium.gz | Zopfli    | 30    | 45085003  | 43.00     | 67.08%     | 0.925s     |
| chromium.gz | Zopfli    | 40    | 45084328  | 43.00     | 67.08%     | 0.921s     |
| chromium.gz | Zopfli    | 50    | 45084098  | 43.00     | 67.08%     | 0.935s     |
| chromium.br | Brotli    | 0     | 55401211  | 52.83     | 59.55%     | 0.778s     |
| chromium.br | Brotli    | 1     | 54429523  | 51.91     | 60.26%     | 0.757s     |
| chromium.br | Brotli    | 2     | 46436126  | 44.28     | 66.10%     | 0.659s     |
| chromium.br | Brotli    | 3     | 46122033  | 43.99     | 66.33%     | 0.616s     |
| chromium.br | Brotli    | 4     | 45050239  | 42.96     | 67.11%     | 0.692s     |
| chromium.br | Brotli    | 5     | 40813510  | 38.92     | 70.20%     | **0.598s** |
| chromium.br | Brotli    | 6     | 40116951  | 38.26     | 70.71%     | 0.601s     |
| chromium.br | Brotli    | 7     | 39302281  | 37.48     | 71.30%     | 0.615s     |
| chromium.br | Brotli    | 8     | 39038303  | 37.23     | 71.50%     | 0.668s     |
| chromium.br | Brotli    | 9     | 38853994  | 37.05     | 71.63%     | 0.673s     |
| chromium.br | Brotli    | 10    | 36090087  | 34.42     | 73.65%     | 0.765s     |
| chromium.br | Brotli    | 11    | 34820408  | **33.21** | **74.58%** | 0.712s     |

For this reason, a stripped-down version of [`iltorb`](https://github.com/MayhemYDG/iltorb) is bundled as a dependency.

## Versioning

This package is versioned based on the underlying Chromium version:

| `puppeteer` Version | Chromium Revision                                    | `chrome-aws-lambda` Version         |
| ------------------- | ---------------------------------------------------- | ----------------------------------- |
| `1.2.0`             | [`543305`](https://crrev.com/543305) (`67.0.3372.0`) | `npm i chrome-aws-lambda@67.0.3372` |
| `1.1.0`             | [`536395`](https://crrev.com/536395) (`66.0.3347.0`) | `npm i chrome-aws-lambda@66.0.3347` |
| `1.0.0`             | [`526987`](https://crrev.com/526987) (`65.0.3312.0`) | `npm i chrome-aws-lambda@65.0.3312` |
| `0.13.0`            | [`515411`](https://crrev.com/515411) (`64.0.3264.0`) | `npm i chrome-aws-lambda@64.0.3264` |

## License

MIT
