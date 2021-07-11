import {HttpError, HeaderName, ContentType, StatusCode} from "@hyper/http";
import {Http2ServerResponse} from "http2";

import {defaultResponseOptions} from "../constants/defaultOptions";
import type ResponseOptions from "../types/ResponseOptions";

class Http2Response<B = unknown> extends Http2ServerResponse {
  public writableEnded!: boolean;
  
  public options: Readonly<ResponseOptions> = defaultResponseOptions;

  public readonly statusMessage = "";

  public setStatusCode(value: number): this {
    this.statusCode = value;
    return this;
  }
  
  public error(error: Error | HttpError): void {
    if (error instanceof HttpError) {
      this.statusCode = error.statusCode;
    }
    else {
      this.statusCode = StatusCode.InternalServerError;
    }

    if (process.env.NODE_ENV === "development") {
      this.write(`Error: ${String(error)}`);
      this.write(`Stack: ${String(error.stack)}`);  
    }
    this.end();
  }

  public json(object: B): void {
    const body = JSON.stringify(object);

    this.writeHead(StatusCode.Ok, {
      [HeaderName.ContentType]: ContentType.ApplicationJSON,
      [HeaderName.ContentLength]: `${Buffer.byteLength(body)}`,
    });
    this.end(body);
  }

  public text(text: string): void {
    this.writeHead(StatusCode.Ok, {
      [HeaderName.ContentType]: ContentType.TextPlain,
      [HeaderName.ContentLength]: `${Buffer.byteLength(text)}`,
    });
    this.end(text);
  }
}

export default Http2Response;