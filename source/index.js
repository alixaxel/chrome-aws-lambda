const { createWriteStream, existsSync, mkdirSync, readdirSync, symlink, unlinkSync } = require('fs');
const { inflate } = require('lambdafs');
const { join } = require('path');
const { URL } = require('url');

if (['AWS_Lambda_nodejs10.x', 'AWS_Lambda_nodejs12.x'].includes(process.env.AWS_EXECUTION_ENV) === true) {
  if (process.env.FONTCONFIG_PATH === undefined) {
    process.env.FONTCONFIG_PATH = '/tmp/aws';
  }

  if (process.env.LD_LIBRARY_PATH === undefined) {
    process.env.LD_LIBRARY_PATH = '/tmp/aws/lib';
  } else if (process.env.LD_LIBRARY_PATH.startsWith('/tmp/aws/lib') !== true) {
    process.env.LD_LIBRARY_PATH = [...new Set(['/tmp/aws/lib', ...process.env.LD_LIBRARY_PATH.split(':')])].join(':');
  }
}

class Chromium {
  /**
   * Downloads a custom font and returns its basename, patching the environment so that Chromium can find it.
   * If not running on AWS Lambda nor Google Cloud Functions, `null` is returned instead.
   */
  static async font(input) {
    if (this.headless !== true) {
      return null;
    }

    if (process.env.HOME === undefined) {
      process.env.HOME = '/tmp';
    }

    if (existsSync(`${process.env.HOME}/.fonts`) !== true) {
      mkdirSync(`${process.env.HOME}/.fonts`);
    }

    return new Promise((resolve, reject) => {
      if (/^https?:[/][/]/i.test(input) !== true) {
        input = `file://${input}`;
      }

      const url = new URL(input);
      const output = `${process.env.HOME}/.fonts/${url.pathname.split('/').pop()}`;

      if (existsSync(output) === true) {
        return resolve(output);
      }

      if (url.protocol === 'file:') {
        symlink(url.pathname, output, (error) => {
          return error != null ? reject(error) : resolve(url.pathname.split('/').pop());
        });
      } else {
        let handler = url.protocol === 'http:' ? require('http').get : require('https').get;

        handler(input, (response) => {
          if (response.statusCode !== 200) {
            return reject(`Unexpected status code: ${response.statusCode}.`);
          }

          const stream = createWriteStream(output);

          stream.once('error', (error) => {
            return reject(error);
          });

          response.on('data', (chunk) => {
            stream.write(chunk);
          });

          response.once('end', () => {
            stream.end(() => {
              return resolve(url.pathname.split('/').pop());
            });
          });
        });
      }
    });
  }

  /**
   * Returns a list of recommended additional Chromium flags.
   */
  static get args() {
    const result = [
      '--autoplay-policy=user-gesture-required',
      '--disable-background-networking',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-breakpad',
      '--disable-client-side-phishing-detection',
      '--disable-component-update',
      '--disable-default-apps',
      '--disable-dev-shm-usage',
      '--disable-domain-reliability',
      '--disable-extensions',
      '--disable-features=AudioServiceOutOfProcess',
      '--disable-hang-monitor',
      '--disable-ipc-flooding-protection',
      '--disable-notifications',
      '--disable-offer-store-unmasked-wallet-cards',
      '--disable-popup-blocking',
      '--disable-print-preview',
      '--disable-prompt-on-repost',
      '--disable-renderer-backgrounding',
      '--disable-setuid-sandbox',
      '--disable-speech-api',
      '--disable-sync',
      '--disk-cache-size=33554432',
      '--hide-scrollbars',
      '--ignore-gpu-blacklist',
      '--metrics-recording-only',
      '--mute-audio',
      '--no-default-browser-check',
      '--no-first-run',
      '--no-pings',
      '--no-sandbox',
      '--no-zygote',
      '--password-store=basic',
      '--use-gl=swiftshader',
      '--use-mock-keychain',
    ];

    if (this.headless === true) {
      result.push('--single-process');
    } else {
      result.push('--start-maximized');
    }

    return result;
  }

  /**
   * Returns more sensible default viewport settings.
   */
  static get defaultViewport() {
    return {
      deviceScaleFactor: 1,
      hasTouch: false,
      height: Chromium.headless === true ? 1080 : 0,
      isLandscape: true,
      isMobile: false,
      width: Chromium.headless === true ? 1920 : 0,
    };
  }

  /**
   * Inflates the current version of Chromium and returns the path to the binary.
   * If not running on AWS Lambda nor Google Cloud Functions, `null` is returned instead.
   */
  static get executablePath() {
    if (this.headless !== true) {
      return Promise.resolve(null);
    }

    if (existsSync('/tmp/chromium') === true) {
      for (const file of readdirSync('/tmp')) {
        if (file.startsWith('core.chromium') === true) {
          unlinkSync(`/tmp/${file}`);
        }
      }

      return Promise.resolve('/tmp/chromium');
    }

    const input = join(__dirname, '..', 'bin');
    const promises = [
      inflate(`${input}/chromium.br`),
      inflate(`${input}/swiftshader.tar.br`),
    ];

    if (['AWS_Lambda_nodejs10.x', 'AWS_Lambda_nodejs12.x'].includes(process.env.AWS_EXECUTION_ENV) === true) {
      promises.push(inflate(`${input}/aws.tar.br`));
    }

    return Promise.all(promises).then((result) => result.shift());
  }

  /**
   * Returns a boolean indicating if we are running on AWS Lambda or Google Cloud Functions.
   * Returns false if Serverless environment variable `IS_LOCAL` is set.
   */
  static get headless() {
    if (process.env.IS_LOCAL !== undefined) {
      return false;
    }

    return ['AWS_LAMBDA_FUNCTION_NAME', 'FUNCTION_NAME', 'FUNCTION_TARGET'].some((key) => process.env[key] !== undefined);
  }

  /**
   * Overloads puppeteer with useful methods and returns the resolved package.
   */
  static get puppeteer() {
    for (const overload of ['Browser', 'FrameManager', 'Page']) {
      require(`${__dirname}/puppeteer/lib/${overload}`);
    }

    try {
      return require('puppeteer');
    } catch (error) {
      if (error.code !== 'MODULE_NOT_FOUND') {
        throw error;
      }

      return require('puppeteer-core');
    }
  }
}

module.exports = Chromium;
