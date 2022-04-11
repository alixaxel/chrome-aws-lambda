const playwright = require('playwright-core')
const chromium = require('./build')

async function runTest(args) {
  const { fontConfigPath, ldLibraryPath, chromiumPath } = await chromium.prepare(`/tmp/random`)

  const FONTCONFIG_PATH = fontConfigPath
  const LD_LIBRARY_PATH = [...new Set([ldLibraryPath, ...process.env.LD_LIBRARY_PATH.split(':')])].join(':')

  const options = {
    headless: true, // Always true
    env: {
      LD_LIBRARY_PATH,
      FONTCONFIG_PATH
    },
    args,
    executablePath: chromiumPath,
    logger: {      
        isEnabled: (name, severity) => true,
        log: (name, severity, message, args) => console.log(`${name} ${message}`)    
      }
  }
    const browser = await playwright.chromium.launch(options)
    const page = await browser.newPage()
    page.on("console", (message) => {
        console.log(message.text())
      })
      page.on("pageerror", (err) => {
        console.log(err.message)
      })

    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('https://www.google.com/')
    await page.screenshot({ path: 'google.png', fullPage: true })
    await page.close()
    await browser.close()
}

exports.handler = async function(event, context) {
    await runTest(chromium.args)
    return context.logStreamName
  }
