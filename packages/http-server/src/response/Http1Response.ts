import {HttpError, HeaderName, ContentType, StatusCode} from "@hyper/http";
import {ServerResponse} from "http";
import type {Socket} from "net";
import type {ServerHttp2Stream} from "http2";
import type {TLSSocket} from "tls";

import {defaultResponseOptions} from "../constants/defaultOptions";
import type ResponseOptions from "../types/ResponseOptions";


class Http1Response<B> extends ServerResponse {
  
  public connection!: Socket | TLSSocket;
  public socket!: Socket | TLSSocket;
  public options: Readonly<ResponseOptions> = defaultResponseOptions;

  public get stream(): ServerHttp2Stream {
    throw new Error("http v1 req do not have stream");
  }

  public createPushResponse(): void {
    throw new Error("http v1 req do not have stream");
  }

  public setStatusCode(value: number): this {
    this.statusCode = value;
    return this;
  }

  public error(error: Error | HttpError): void {
    if (error instanceof HttpError) {
      this.statusCode = error.statusCode;
      this.statusMessage = error.statusMessage;
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

export default Http1Response;