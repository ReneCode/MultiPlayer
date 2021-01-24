// https://docs.microsoft.com/en-us/azure/azure-monitor/app/nodejs
const appInsights = require("applicationinsights");

class Logger {
  production: boolean = false;
  client = undefined;

  constructor() {
    appInsights.setup().start();
    this.client = appInsights.defaultClient;

    this.production = process.env.NODE_ENV === "production";
  }

  trackTrace(message: string) {
    console.log(">>", message);
    if (this.production) {
      this.client.trackTrace({ message: message });
    }
  }

  trackNodeHttpRequest(para: object) {
    if (this.production) {
      this.client.trackNodeHttpRequest(para);
    }
  }
}

export const logger = new Logger();
