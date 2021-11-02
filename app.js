const playwright = require('playwright-core')
const chromium = require('./build')

async function runTest(args) {
  const options = {
    headless: true, // Always true
    args,
    executablePath: await chromium.executablePath || undefined,
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
    await page.goto('https://www.nytimes.com/')
    await page.screenshot({ path: 'nytimes.png', fullPage: true })
    await browser.close()
}

exports.handler = async function(event, context) {
    await runTest(chromium.args)
    return context.logStreamName
  }