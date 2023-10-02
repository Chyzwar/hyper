import {Writable} from "stream";
import {StatusCode, HeaderName, ContentType, HttpError} from "@hyper/http";
import type {Headers} from "@hyper/http";
import type {Socket} from "net";
import type {ServerHttp2Stream} from "node:http2";

import type Http1Response from "./response/Http1Response.js";
import type ResponseOptions from "./types/ResponseOptions.js";
import type Http1Request from "./request/Http1Request.js";

export type MockResponseEvents = 
  | "error"; 

export interface MockResponseOptions {
  headers?: Headers;
  statusCode?: StatusCode;
  simulate?: MockResponseEvents[];
}

class MockResponse<B = unknown> extends Writable implements Http1Response<B> {
  public options: ResponseOptions = {
    etag: false,
    compression: false,
  };

  public statusCode: StatusCode;
  public headers: Headers;
  public connection!: Socket;
  public socket!: Socket;
  public simulate: string[];
  public statusMessage!: string;
  public shouldKeepAlive!: boolean;
  public chunkedEncoding!: boolean;
  public upgrading!: boolean;
  public finished!: boolean;
  public headersSent!: boolean;
  public sendDate!: boolean;
  public stream!: ServerHttp2Stream;
  public useChunkedEncodingByDefault!: boolean;
  public createPushResponse!: () => void; 
  public assignSocket!: (socket: Socket) => void;
  public detachSocket!: (socket: Socket) => void;
  public addTrailers!: (headers: Headers) => void;
  public writeContinue!: (callback: () => void) => void;
  public writeProcessing!: () => void;
  public flushHeaders!: () => void;
  public getHeaderNames!: () => string[];
  public removeHeader!: (name: string) => void;
  public hasHeader!: (name: string) => boolean;
  public writeEarlyHints!: (hints: Record<string, string[] | string>, callback?: () => void) => void;
  public setTimeout!: (msc: number, callback: () => void) => this;
  public data?: string;
  public req!: Http1Request;

  public constructor({headers, statusCode, simulate}: MockResponseOptions = {}) {
    super();

    this.simulate = simulate ?? [];
    this.headers = headers ?? {};
    this.statusCode = statusCode ?? StatusCode.Ok;
  }

  public getHeaders(): Headers {
    return this.headers;
  }
  
  public getHeader(name: string): string | undefined {
    return this.headers[name];
  }

  public setStatusCode(value: number): this {
    this.statusCode = value;
    return this;
  }
  
  public setHeader(name: string, value: string[] | number | string): this {
    this.headers[name] = `${Array.isArray(value) ? value.join(", ") : value}`;
    return this;
  }
  
  public writeHead(code: StatusCode, ...rest: unknown[]): this {
    this.statusCode = code;

    const [headers]: unknown[] = rest;
    if (headers instanceof Object) {
      Object
        .entries(headers)
        .forEach(([name, value]) => {
          if (typeof value === "string") {
            this.setHeader(name, value);
          }
        });
    }
    return this;
  }

  public _write(chunk: string, _encoding: string, callback: Function): void {
    this.data += chunk;

    if (this.simulate.includes("error")) {
      this.emit("error", new Error("Response simulated error"));
    }
    callback();
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

export default MockResponse;