import fs from "fs";
import path from "path";
import chalk from "chalk";

const LOG_FILE_PATH = path.join(process.cwd(), "logs", "server.log");

if (!fs.existsSync(path.dirname(LOG_FILE_PATH))) {
  fs.mkdirSync(path.dirname(LOG_FILE_PATH), { recursive: true });
}

class Logger {
  private environment: string;
  private writeToFile: boolean;

  constructor() {
    this.environment = process.env.NODE_ENV || "development";
    this.writeToFile = this.environment === "production";
  }

  private formatMessage(level: string, message: string, meta?: object) {
    const timestamp = new Date().toLocaleString();
    return `[${timestamp}] [${level.toUpperCase()}] ${message} ${
      meta ? JSON.stringify(meta, null, 2) : ""
    }`;
  }

  private writeToLogFile(message: string) {
    if (this.writeToFile) {
      fs.appendFileSync(LOG_FILE_PATH, message + "\n");
    }
  }

  info(message: string, meta?: object) {
    const logMessage = this.formatMessage("info", message, meta);
    console.log(chalk.green(logMessage));
    this.writeToLogFile(logMessage);
  }

  warn(message: string, meta?: object) {
    const logMessage = this.formatMessage("warn", message, meta);
    console.log(chalk.yellow(logMessage));
    this.writeToLogFile(logMessage);
  }

  error(message: string, meta?: object) {
    const logMessage = this.formatMessage("error", message, meta);
    console.error(chalk.red.bold(logMessage));
    this.writeToLogFile(logMessage);
  }

  debug(message: string, meta?: object) {
    if (this.environment === "development") {
      const logMessage = this.formatMessage("debug", message, meta);
      console.log(chalk.blue(logMessage));
    }
  }
}

export const logger = new Logger();
