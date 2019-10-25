# chrome-aws-lambda

[![chrome-aws-lambda](https://img.shields.io/npm/v/chrome-aws-lambda.svg?style=for-the-badge)](https://www.npmjs.com/package/chrome-aws-lambda)
[![Chromium](https://img.shields.io/badge/chromium-37_MB-brightgreen.svg?style=for-the-badge)](bin/)
[![Donate](https://img.shields.io/badge/donate-paypal-orange.svg?style=for-the-badge)](https://paypal.me/alixaxel)

Chromium Binary for AWS Lambda and Google Cloud Functions

## Install

```shell
npm install chrome-aws-lambda --save-prod
```

This will ship with appropriate binary for the latest stable release of [`puppeteer`](https://github.com/GoogleChrome/puppeteer) (usually updated within a day or two).

You will also need to install the corresponding version of `puppeteer` (or `puppeteer-core`):

```shell
npm install puppeteer-core --save-prod
```

If you wish to install an older version of Chromium, take a look at [Versioning](https://github.com/alixaxel/chrome-aws-lambda#versioning).

## Usage

This package works with the `nodejs8.10` and `nodejs10.x` AWS Lambda runtimes out of the box.

```javascript
const chromium = require('chrome-aws-lambda');

exports.handler = async (event, context) => {
  let result = null;
  let browser = null;

  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
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

You should allocate at least 512 MB of RAM to your Lambda, however 1600 MB (or more) is recommended.

### Running Locally

Please refer to the [Local Development Wiki page](https://github.com/alixaxel/chrome-aws-lambda/wiki/HOWTO:-Local-Development) for instructions and troubleshooting.

## API

| Method / Property | Returns              | Description                                               |
| ----------------- | -------------------- | --------------------------------------------------------- |
| `font(url)`       | `{?Promise<string>}` | Downloads a custom font and returns its basename.         |
| `args`            | `{!Array<string>}`   | Provides a list of recommended additional Chromium flags. |
| `defaultViewport` | `{!Object}`          | Returns more sensible default viewport settings.          |
| `executablePath`  | `{?Promise<string>}` | Returns the path where the Chromium binary was extracted. |
| `headless`        | `{!boolean}`         | Returns `true` if we are running on AWS Lambda or GCF.    |
| `puppeteer`       | `{!Object}`          | Overloads puppeteer and returns the resolved package.     |

## Fonts

Since version `1.12.2`, the `font()` method will download additional fonts and make them discoverable.

To use it, simply pass a **HTTPS** URL to a custom font face _before_ launching Chromium, e.g.:

```javascript
await chromium.font('https://raw.githack.com/googlei18n/noto-emoji/master/fonts/NotoColorEmoji.ttf');
```

> The above font is needed if you want to [render emojis](https://getemoji.com/).

Fonts with the same basename will only be downloaded if they are not already cached.

> On non-serverless environments, the `font()` method is a no-op to avoid polluting the user space.

It's recommended that you use a CDN, like [raw.githack.com](https://raw.githack.com/) or [gitcdn.xyz](https://gitcdn.xyz/).

## Overloading

Since version `1.7.0`, it's also possible to overload `puppeteer` / `puppeteer-core` API with useful methods:

- `Frame`
  - `count(selector)`
  - `exists(selector)`
  - `fill(form, data, heuristic = 'name')`
  - `number(selector, decimal = null, index = null, property = 'textContent')`
  - `selectByLabel(selector, ...values)`
  - `string(selector, property = 'textContent')`
  - `waitUntilVisible(selector, timeout = null)`
  - `waitWhileVisible(selector, timeout = null)`
- `Page`
  - `clickAndWaitForNavigation(selector, options = null)`
  - `count(selector)`
  - `exists(selector)`
  - `fill(form, data, heuristic = 'name')`
  - `go(url, options = null)`
  - `number(selector, decimal = null, index = null, property = 'textContent')`
  - `selectByLabel(selector, ...values)`
  - `string(selector, property = 'textContent')`
  - `waitUntilVisible(selector, timeout = null)`
  - `waitWhileVisible(selector, timeout = null)`

Besides the public API, the following browser-context methods will also be available if `Page.go()` is used:

 - `σ.$(selector, context = document)`
 - `σ.$$(selector, index = null, context = document)`
 - `σ.$x(expression, index = null, context = document)`
 - `σ.$number(data, decimal = null, index = null, property = 'textContent')`
 - `σ.$string(data, property = 'textContent')`
 - `σ.$regexp(data, pattern, index = null, property = 'textContent')`

To enable overloading, simply call the `puppeteer` property exposed by this package.

## Versioning

This package is versioned based on the underlying `puppeteer` minor version:

| `puppeteer` Version | `chrome-aws-lambda` Version       | Chromium Revision                                    |
| ------------------- | --------------------------------- | ---------------------------------------------------- |
| `2.00.*`            | `npm i chrome-aws-lambda@~2.00.0` | [`705776`](https://crrev.com/705776) (`79.0.3945.0`) |
| `1.20.*`            | `npm i chrome-aws-lambda@~1.20.4` | [`686378`](https://crrev.com/686378) (`78.0.3882.0`) |
| `1.19.*`            | `npm i chrome-aws-lambda@~1.19.0` | [`674921`](https://crrev.com/674921) (`77.0.3844.0`) |
| `1.18.*`            | `npm i chrome-aws-lambda@~1.18.1` | [`672088`](https://crrev.com/672088) (`77.0.3835.0`) |
| `1.18.*`            | `npm i chrome-aws-lambda@~1.18.0` | [`669486`](https://crrev.com/669486) (`77.0.3827.0`) |
| `1.17.*`            | `npm i chrome-aws-lambda@~1.17.1` | [`662092`](https://crrev.com/662092) (`76.0.3803.0`) |
| `1.16.*`            | `npm i chrome-aws-lambda@~1.16.1` | [`656675`](https://crrev.com/656675) (`76.0.3786.0`) |
| `1.15.*`            | `npm i chrome-aws-lambda@~1.15.1` | [`650583`](https://crrev.com/650583) (`75.0.3765.0`) |
| `1.14.*`            | `npm i chrome-aws-lambda@~1.14.0` | [`641577`](https://crrev.com/641577) (`75.0.3738.0`) |
| `1.13.*`            | `npm i chrome-aws-lambda@~1.13.0` | [`637110`](https://crrev.com/637110) (`74.0.3723.0`) |
| `1.12.*`            | `npm i chrome-aws-lambda@~1.12.2` | [`624492`](https://crrev.com/624492) (`73.0.3679.0`) |
| `1.11.*`            | `npm i chrome-aws-lambda@~1.11.2` | [`609904`](https://crrev.com/609904) (`72.0.3618.0`) |
| `1.10.*`            | `npm i chrome-aws-lambda@~1.10.1` | [`604907`](https://crrev.com/604907) (`72.0.3582.0`) |
| `1.9.*`             | `npm i chrome-aws-lambda@~1.9.1`  | [`594312`](https://crrev.com/594312) (`71.0.3563.0`) |
| `1.8.*`             | `npm i chrome-aws-lambda@~1.8.0`  | [`588429`](https://crrev.com/588429) (`71.0.3542.0`) |
| `1.7.*`             | `npm i chrome-aws-lambda@~1.7.0`  | [`579032`](https://crrev.com/579032) (`70.0.3508.0`) |
| `1.6.*`             | `npm i chrome-aws-lambda@~1.6.3`  | [`575458`](https://crrev.com/575458) (`69.0.3494.0`) |
| `1.5.*`             | `npm i chrome-aws-lambda@~1.5.0`  | [`564778`](https://crrev.com/564778) (`69.0.3452.0`) |
| `1.4.*`             | `npm i chrome-aws-lambda@~1.4.0`  | [`555668`](https://crrev.com/555668) (`68.0.3419.0`) |
| `1.3.*`             | `npm i chrome-aws-lambda@~1.3.0`  | [`549031`](https://crrev.com/549031) (`67.0.3391.0`) |
| `1.2.*`             | `npm i chrome-aws-lambda@~1.2.0`  | [`543305`](https://crrev.com/543305) (`67.0.3372.0`) |
| `1.1.*`             | `npm i chrome-aws-lambda@~1.1.0`  | [`536395`](https://crrev.com/536395) (`66.0.3347.0`) |
| `1.0.*`             | `npm i chrome-aws-lambda@~1.0.0`  | [`526987`](https://crrev.com/526987) (`65.0.3312.0`) |
| `0.13.*`            | `npm i chrome-aws-lambda@~0.13.0` | [`515411`](https://crrev.com/515411) (`64.0.3264.0`) |

## Compiling

To compile your own version of Chromium check the [Ansible playbook instructions](_/ansible).

## AWS Lambda Layer

[Lambda Layers](https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html) is a new convenient way to manage common dependencies between different Lambda Functions.

The following set of (Linux) commands will create a well-structured layer of this package alongside `puppeteer-core`:

```shell
git clone --depth=1 https://github.com/alixaxel/chrome-aws-lambda.git && \
cd chrome-aws-lambda && \
make chrome_aws_lambda.zip
```

The above will create a `chrome-aws-lambda.zip` file, which can be uploaded to your Layers console.

> The folks at [`shelfio/chrome-aws-lambda-layer`](https://github.com/shelfio/chrome-aws-lambda-layer) also maintain and publish AWS Lambda Layers of this package.

## Google Cloud Functions

Since version `1.11.2`, it's also possible to use this package on Google/Firebase Cloud Functions.

The only additional requirement is that `iltorb` must also be added as a dependency:

```shell
npm install iltorb --save-prod
```

According to our benchmarks, it's 40% to 50% faster than using the off-the-shelf `puppeteer` bundle.

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

## License

MIT
