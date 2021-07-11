import StatusMessage from "./StatusMessage.js";
import type StatusCode from "./StatusCode.js";

class HttpError extends Error {
  [key: string]: unknown;

  public statusCode: number;
  public statusMessage: string;

  public constructor(statusCode: StatusCode | number, statusMessage: string = StatusMessage[statusCode], meta?: Record<string, unknown>) {
    super(`${statusCode} - ${statusMessage}`);

    this.statusCode = statusCode;
    this.statusMessage = statusMessage;

    if (meta) {
      for (const key in meta) {
        this[key] = meta[key];
      }
    }
  }
}

export default HttpError;
