// https://docs.microsoft.com/en-us/azure/azure-monitor/app/nodejs
const appInsights = require("applicationinsights");
import config from "./config.json";

class Logger {
  logAI: boolean = false;
  client = undefined;

  constructor() {
    appInsights.setup().start();
    this.client = appInsights.defaultClient;

    this.logAI = process.env.NODE_ENV === "production";
  }

  trackTrace(message: string, properties = {}) {
    console.log(">>", message, properties);
    if (this.logAI) {
      this.client.trackTrace({
        message: message,
        properties: { ...config, ...properties },
      });
    }
  }

  trackNodeHttpRequest(para: object) {
    console.log(">> httpRequest");
    if (this.logAI) {
      this.client.trackNodeHttpRequest(para);
    }
  }
}

export const logger = new Logger();
