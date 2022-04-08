/// <reference path="../typings/chrome-aws-lambda.d.ts" />

import { promises as fs } from 'fs';
import { join } from 'path';
import { PuppeteerNode, Viewport } from 'puppeteer-core';
import { inflate, fileExists, fontConfig } from './util';

class Chromium {
  /**
   * Returns a list of additional Chromium flags recommended for serverless environments.
   * The canonical list of flags can be found on https://peter.sh/experiments/chromium-command-line-switches/.
   */
  static get args(): string[] {
    const result = [
      '--allow-running-insecure-content', // https://source.chromium.org/search?q=lang:cpp+symbol:kAllowRunningInsecureContent&ss=chromium
      '--autoplay-policy=user-gesture-required', // https://source.chromium.org/search?q=lang:cpp+symbol:kAutoplayPolicy&ss=chromium
      '--disable-component-update', // https://source.chromium.org/search?q=lang:cpp+symbol:kDisableComponentUpdate&ss=chromium
      '--disable-domain-reliability', // https://source.chromium.org/search?q=lang:cpp+symbol:kDisableDomainReliability&ss=chromium
      '--disable-features=AudioServiceOutOfProcess,IsolateOrigins,site-per-process', // https://source.chromium.org/search?q=file:content_features.cc&ss=chromium
      '--disable-print-preview', // https://source.chromium.org/search?q=lang:cpp+symbol:kDisablePrintPreview&ss=chromium
      '--disable-setuid-sandbox', // https://source.chromium.org/search?q=lang:cpp+symbol:kDisableSetuidSandbox&ss=chromium
      '--disable-site-isolation-trials', // https://source.chromium.org/search?q=lang:cpp+symbol:kDisableSiteIsolation&ss=chromium
      '--disable-speech-api', // https://source.chromium.org/search?q=lang:cpp+symbol:kDisableSpeechAPI&ss=chromium
      '--disable-web-security', // https://source.chromium.org/search?q=lang:cpp+symbol:kDisableWebSecurity&ss=chromium
      '--disk-cache-size=33554432', // https://source.chromium.org/search?q=lang:cpp+symbol:kDiskCacheSize&ss=chromium
      '--enable-features=SharedArrayBuffer', // https://source.chromium.org/search?q=file:content_features.cc&ss=chromium
      '--hide-scrollbars', // https://source.chromium.org/search?q=lang:cpp+symbol:kHideScrollbars&ss=chromium
      '--ignore-gpu-blocklist', // https://source.chromium.org/search?q=lang:cpp+symbol:kIgnoreGpuBlocklist&ss=chromium
      '--in-process-gpu', // https://source.chromium.org/search?q=lang:cpp+symbol:kInProcessGPU&ss=chromium
      '--mute-audio', // https://source.chromium.org/search?q=lang:cpp+symbol:kMuteAudio&ss=chromium
      '--no-default-browser-check', // https://source.chromium.org/search?q=lang:cpp+symbol:kNoDefaultBrowserCheck&ss=chromium
      '--no-pings', // https://source.chromium.org/search?q=lang:cpp+symbol:kNoPings&ss=chromium
      '--no-sandbox', // https://source.chromium.org/search?q=lang:cpp+symbol:kNoSandbox&ss=chromium
      '--no-zygote', // https://source.chromium.org/search?q=lang:cpp+symbol:kNoZygote&ss=chromium
      '--use-gl=swiftshader', // https://source.chromium.org/search?q=lang:cpp+symbol:kUseGl&ss=chromium
      '--window-size=1920,1080', // https://source.chromium.org/search?q=lang:cpp+symbol:kWindowSize&ss=chromium
    ];

    if (Chromium.headless === true) {
      result.push('--single-process'); // https://source.chromium.org/search?q=lang:cpp+symbol:kSingleProcess&ss=chromium
    } else {
      result.push('--start-maximized'); // https://source.chromium.org/search?q=lang:cpp+symbol:kStartMaximized&ss=chromium
    }

    return result;
  }

  /**
   * Returns sensible default viewport settings.
   */
  static get defaultViewport(): Required<Viewport> {
    return {
      deviceScaleFactor: 1,
      hasTouch: false,
      height: 1080,
      isLandscape: true,
      isMobile: false,
      width: 1920,
    };
  }

  static async prepare(folder: string) {
    await fs.mkdir(folder, { recursive: true, mode: 0o777 })
    const chromiumExpectedPath = join(folder, 'chromium')
    if (await fileExists(chromiumExpectedPath)) {
      const files = await fs.readdir(folder)
      for (const file of files) {
        if (file.startsWith('core.chromium') === true) {
          await fs.unlink(join(folder, file));
        }
      }
    } else {
      const input = join(__dirname, '..', 'bin');
      const promises = [
        inflate(folder, `${input}/chromium.br`),
        inflate(folder, `${input}/swiftshader.tar.br`),
        inflate(folder, `${input}/aws.tar.br`),
      ];

      const awsFolder = join(folder, 'aws')

      await Promise.all(promises);
      await fs.writeFile(join(awsFolder, 'fonts.conf'), fontConfig(awsFolder), { encoding: 'utf8', mode: 0o700})
    }
    return {
      config: {
        fontConfigPath: join(folder, 'aws'),
        awsLibrarPath: join(folder, 'aws', 'lib'),
      },
      chromium: {
        path: chromiumExpectedPath
      }
    }
  }

  /**
   * Returns a boolean indicating if we are running on AWS Lambda or Google Cloud Functions.
   * False is returned if Serverless environment variables `IS_LOCAL` or `IS_OFFLINE` are set.
   */
  static get headless() {
    if (process.env.IS_LOCAL !== undefined || process.env.IS_OFFLINE !== undefined) {
      return false;
    }

    const environments = [
      'AWS_LAMBDA_FUNCTION_NAME',
      'FUNCTION_NAME',
      'FUNCTION_TARGET',
      'FUNCTIONS_EMULATOR',
    ];

    return environments.some((key) => process.env[key] !== undefined);
  }

  /**
   * Overloads puppeteer with useful methods and returns the resolved package.
   */
  static get puppeteer(): PuppeteerNode {
    for (const overload of ['Browser', 'BrowserContext', 'ElementHandle', 'FrameManager', 'Page']) {
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

export = Chromium;
