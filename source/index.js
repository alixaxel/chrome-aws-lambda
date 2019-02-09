const { chmod, createReadStream, createWriteStream, existsSync, readdirSync, unlinkSync } = require('fs');

class Chromium {
  /**
   * Returns a list of recommended additional Chromium flags.
   */
  static get args() {
    let result = [
      '--disable-accelerated-2d-canvas',
      '--disable-background-timer-throttling',
      '--disable-breakpad',
      '--disable-client-side-phishing-detection',
      '--disable-cloud-import',
      '--disable-default-apps',
      '--disable-dev-shm-usage',
      '--disable-extensions',
      '--disable-gesture-typing',
      '--disable-gpu',
      '--disable-hang-monitor',
      '--disable-infobars',
      '--disable-notifications',
      '--disable-offer-store-unmasked-wallet-cards',
      '--disable-offer-upload-credit-cards',
      '--disable-popup-blocking',
      '--disable-print-preview',
      '--disable-prompt-on-repost',
      '--disable-setuid-sandbox',
      '--disable-software-rasterizer',
      '--disable-speech-api',
      '--disable-sync',
      '--disable-tab-for-desktop-share',
      '--disable-translate',
      '--disable-voice-input',
      '--disable-wake-on-wifi',
      '--enable-async-dns',
      '--enable-simple-cache-backend',
      '--enable-tcp-fast-open',
      '--hide-scrollbars',
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
      '--use-mock-keychain',
    ];

    if (parseInt(process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE || process.env.FUNCTION_MEMORY_MB || '512', 10) >= 1024) {
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

    return new Promise((resolve, reject) => {
      let input = `${__dirname}/../bin`;
      let output = '/tmp/chromium';

      if (existsSync(output) === true) {
        for (let file of readdirSync(`/tmp`)) {
          if (file.startsWith('core.chromium') === true) {
            unlinkSync(`/tmp/${file}`);
          }
        }

        return resolve(output);
      }

      for (let file of readdirSync(input)) {
        if (file.endsWith('.br') === true) {
          input = `${input}/${file}`;
        }
      }

      const source = createReadStream(input);
      const target = createWriteStream(output);

      source.on('error', (error) => {
        return reject(error);
      });

      target.on('error', (error) => {
        return reject(error);
      });

      target.on('close', () => {
        chmod(output, '0755', (error) => {
          if (error) {
            return reject(error);
          }

          return resolve(output);
        });
      });

      if (process.env.AWS_EXECUTION_ENV === 'AWS_Lambda_nodejs8.10') {
        source.pipe(require(`${__dirname}/iltorb`).decompressStream()).pipe(target);
      } else {
        source.pipe(require('iltorb').decompressStream()).pipe(target);
      }
    });
  }

  /**
   * Returns a boolean indicating if we are running on AWS Lambda or Google Cloud Functions.
   */
  static get headless() {
    return process.env.AWS_LAMBDA_FUNCTION_NAME !== undefined || process.env.FUNCTION_NAME !== undefined;
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
      return require('puppeteer-core');
    }
  }
}

module.exports = Chromium;
