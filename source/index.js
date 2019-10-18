const { createWriteStream, existsSync, mkdirSync, readdirSync, unlinkSync } = require('fs');
const { get } = require('https');
const { inflate } = require('lambdafs');
const { URL } = require('url');

if (process.env.AWS_EXECUTION_ENV === 'AWS_Lambda_nodejs10.x') {
  if (process.env.FONTCONFIG_PATH === undefined) {
    process.env.FONTCONFIG_PATH = '/tmp/aws';
  }

  if (process.env.LD_LIBRARY_PATH.startsWith('/tmp/aws/lib') !== true) {
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
      let url = new URL(input);
      let output = `${process.env.HOME}/.fonts/${url.pathname.split('/').pop()}`;

      if (existsSync(output) === true) {
        return resolve(output);
      }

      get(input, (response) => {
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
    });
  }

  /**
   * Returns a list of recommended additional Chromium flags.
   */
  static get args() {
    let result = [
      '--disable-background-timer-throttling',
      '--disable-breakpad',
      '--disable-client-side-phishing-detection',
      '--disable-cloud-import',
      '--disable-default-apps',
      '--disable-dev-shm-usage',
      '--disable-extensions',
      '--disable-gesture-typing',
      '--disable-hang-monitor',
      '--disable-infobars',
      '--disable-notifications',
      '--disable-offer-store-unmasked-wallet-cards',
      '--disable-offer-upload-credit-cards',
      '--disable-popup-blocking',
      '--disable-print-preview',
      '--disable-prompt-on-repost',
      '--disable-setuid-sandbox',
      '--disable-speech-api',
      '--disable-sync',
      '--disable-tab-for-desktop-share',
      '--disable-translate',
      '--disable-voice-input',
      '--disable-wake-on-wifi',
      '--disk-cache-size=33554432',
      '--enable-async-dns',
      '--enable-simple-cache-backend',
      '--enable-tcp-fast-open',
      '--enable-webgl',
      '--hide-scrollbars',
      '--ignore-gpu-blacklist',
      '--media-cache-size=33554432',
      '--metrics-recording-only',
      '--mute-audio',
      '--no-default-browser-check',
      '--no-first-run',
      '--no-pings',
      '--no-sandbox',
      '--no-zygote',
      '--password-store=basic',
      '--prerender-from-omnibox=disabled',
      '--use-gl=swiftshader',
      '--use-mock-keychain',
    ];

    if (parseInt(process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE || process.env.FUNCTION_MEMORY_MB || '1024', 10) >= 1024) {
      result.push('--memory-pressure-off');
    }

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
      return null;
    }

    if (existsSync('/tmp/chromium') === true) {
      for (let file of readdirSync('/tmp')) {
        if (file.startsWith('core.chromium') === true) {
          unlinkSync(`/tmp/${file}`);
        }
      }

      return '/tmp/chromium';
    }

    let input = `${__dirname}/../bin`;
    let promises = [
      inflate(`${input}/chromium.br`),
      inflate(`${input}/swiftshader.tar.br`),
    ];

    if (process.env.AWS_EXECUTION_ENV === 'AWS_Lambda_nodejs10.x') {
      promises.push(inflate(`${input}/aws.tar.br`));
    }

    return Promise.all(promises).then((result) => {
      return result.shift();
    });
  }

  /**
   * Returns a boolean indicating if we are running on AWS Lambda or Google Cloud Functions.
   */
  static get headless() {
    return ['AWS_LAMBDA_FUNCTION_NAME', 'FUNCTION_NAME', 'FUNCTION_TARGET'].some((key) => process.env[key] !== undefined);
  }

  /**
   * Overloads puppeteer with useful methods and returns the resolved package.
   */
  static get puppeteer() {
    for (let overload of ['FrameManager', 'Page']) {
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
