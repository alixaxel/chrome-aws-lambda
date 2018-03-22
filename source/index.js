'use strict';

const debug = require('debug')('chrome-aws-lambda');

const fs = require('fs');
const os = require('os');
const path = require('path');

class Chromium {
  /**
   * Returns a list of recommended additional Chromium flags.
   *
   * @returns {!Array<string>}
   */
  static defaultArgs() {
    return [
      '--disable-dev-shm-usage',
      '--disable-notifications',
      '--disable-offer-store-unmasked-wallet-cards',
      '--disable-offer-upload-credit-cards',
      '--disable-setuid-sandbox',
      '--media-cache-size=33554432',
      '--no-default-browser-check',
      '--no-first-run',
      '--no-pings',
      '--no-sandbox',
      '--no-zygote',
      '--prerender-from-omnibox=disabled',
      '--single-process',
      '--start-maximized',
    ];
  }

  /**
   * Inflates the current version of Chromium and returns the path to the binary.
   * If not running on AWS Lambda, `null` is returned instead.
   *
   * @returns {?Promise<string>}
   */
  static executablePath() {
    if (process.env['AWS_LAMBDA_FUNCTION_NAME'] === undefined) {
      return null;
    }

    const input = path.join(__dirname, '../bin/chromium.br');
    const output = path.join(os.tmpdir(), 'chromium');

    if (fs.existsSync(output) === true) {
      return output;
    }

    return new Promise(
      (resolve, reject) => {
        if (process.env.DEBUG !== undefined) {
          debug(`Inflating '${path.basename(input)}'.`);
        }

        const source = fs.createReadStream(input);
        const target = fs.createWriteStream(output);

        source.on('error',
          (error) => {
            return reject(error);
          }
        );

        target.on('error',
          (error) => {
            return reject(error);
          }
        );

        target.on('close',
          () => {
            try {
              fs.chmod(output, '0755', () => {
                if (process.env.DEBUG !== undefined) {
                  debug(`Finished inflating '${path.basename(input)}' into '${output}'.`);
                }

                return resolve(output);
              });
            } catch (error) {
              return reject(error);
            }
          }
        );

        source.pipe(require(`${__dirname}/iltorb`).decompressStream()).pipe(target);
      }
    );
  }
}

module.exports = Chromium;
