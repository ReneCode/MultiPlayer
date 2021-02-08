// https://docs.microsoft.com/en-us/azure/azure-monitor/app/nodejs
const appInsights = require("applicationinsights");

class Logger {
  logAI: boolean = false;
  client = undefined;

  constructor() {
    appInsights.setup().start();
    this.client = appInsights.defaultClient;

    this.logAI = process.env.NODE_ENV === "production";
    this.logAI = true;
  }

  trackTrace(message: string) {
    console.log(">>", message);
    if (this.logAI) {
      this.client.trackTrace({ message: message });
    }
  }

  trackNodeHttpRequest(para: object) {
    if (this.logAI) {
      this.client.trackNodeHttpRequest(para);
    }
  }
}

export const logger = new Logger();
