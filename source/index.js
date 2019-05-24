const { createReadStream, createWriteStream, existsSync, mkdirSync, readdirSync, unlinkSync } = require('fs');
const { get } = require('https');
const { URL } = require('url');

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

        response.on('data', (chunk) => {
          stream.write(chunk);
        });

        response.on('end', () => {
          stream.end(() => {
            return resolve(url.pathname.split('/').pop());
          });
        });

        stream.on('error', (error) => {
          return reject(error);
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

    if (existsSync('/tmp/swiftshader') !== true) {
      mkdirSync('/tmp/swiftshader');
    }

    const input = `${__dirname}/../bin`;
    const binary = readdirSync(input).find((file) => {
      return file.startsWith('chromium-');
    });

    const promises = [
      inflate(`${input}/${binary}`, '/tmp/chromium'),
      inflate(`${input}/swiftshader/libEGL.so.br`, '/tmp/swiftshader/libEGL.so'),
      inflate(`${input}/swiftshader/libGLESv2.so.br`, '/tmp/swiftshader/libGLESv2.so'),
    ];

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

let iltorb = null;

function inflate(input, output, mode = 0o755) {
  if (iltorb == null) {
    iltorb = require(process.env.AWS_EXECUTION_ENV !== 'AWS_Lambda_nodejs8.10' ? 'iltorb' : `${__dirname}/iltorb`);
  }

  return new Promise((resolve, reject) => {
    const source = createReadStream(input, { highWaterMark: 8 * 1024 * 1024 });
    const target = createWriteStream(output, { mode: mode });

    source.on('error', (error) => {
      return reject(error);
    });

    target.on('error', (error) => {
      return reject(error);
    });

    target.on('close', () => {
      return resolve(output);
    });

    if (input.endsWith('.br') === true) {
      source.pipe(iltorb.decompressStream()).pipe(target);
    } else {
      source.pipe(target);
    }
  });
}

module.exports = Chromium;
