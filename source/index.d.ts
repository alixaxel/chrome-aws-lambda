declare module 'chrome-aws-lambda' {
  export default class Chromium {
    static args : Array<string>;
    static defaultViewport : {
      width : number,
      height : number,
      deviceScaleFactor : number,
      isMobile : boolean,
      hasTouch : boolean,
      isLandscape : boolean
    };
    static executablePath : Promise<string>;
    static headless : boolean;
    static puppeteer : Object;
  }
}
