/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import {Readable} from "stream";
import {Method, HeaderName, ContentType} from "@hyper/http";
import type {JSONValue} from "@hyper/utility-types";
import type {Headers} from "@hyper/http";
import type {UrlWithParsedQuery} from "url";
import type {ParsedUrlQuery} from "querystring";
import type {Socket} from "net";
import type {ServerHttp2Stream} from "node:http2";

import parseURL from "./utils/parseURL.js";
import type Http1Request from "./request/Http1Request.js";

export type MockRequestEvents = 
  | "aborted" 
  | "close" 
  | "error";

export interface MockRequestOptions {
  method?: Method;
  url?: string;
  data?: object | string;
  headers?: Headers;
  trailers?: Headers;
  simulate?: MockRequestEvents[];
}

class MockRequest<B = unknown> extends Readable implements Http1Request<B> {
  [key: string]: unknown;

  public body!: B;
  public url: string;
  public method: Method;
  public parsedUrl: UrlWithParsedQuery;
  public rawHeaders: string[];
  public headers: Headers;
  public rawTrailers: string[];
  public trailers: Headers;
  public socket!: Socket;
  public connection!: Socket;
  public stream!: ServerHttp2Stream;
  public authority!: string;
  public scheme!: string;
  public routeParams?: Record<string, JSONValue>;
  public layerParams?: Record<string, JSONValue>;
  public routerParams?: Record<string, JSONValue>;
  public httpVersion: string;
  public httpVersionMajor: number;
  public httpVersionMinor: number;
  public complete: boolean;
  public aborted: boolean;
  public data?: object | string;
  public simulate?: string[];
  
  public setTimeout!: (msc: number, callback: () => void) => this;


  public constructor({url = "/", method, headers, trailers, data, simulate}: MockRequestOptions = {}) {
    super();  

    this.httpVersion = "1.1";
    this.httpVersionMajor = 1;
    this.httpVersionMinor = 1;
    this.complete = true;
    this.aborted = false;

    this.data = data;

    this.headers = headers ?? {};
    this.rawHeaders = [];
    this.trailers = trailers ?? {};
    this.rawTrailers = [];
    this.simulate = simulate ?? [];

    this.url = url;
    this.parsedUrl = parseURL(this.url);
    this.method = method ?? Method.GET;
    
    if (data && !this.headers[HeaderName.ContentType]) {
      if (typeof data === "object") {
    
        if (!this.headers[HeaderName.ContentType]) {
          this.headers[HeaderName.ContentType] = ContentType.ApplicationJSON;
        }

        if (!this.headers[HeaderName.ContentLength]) {
          this.headers[HeaderName.ContentLength] = `${Buffer.byteLength(JSON.stringify(data))}`;
        }
      }
    }
  }

  public get query(): ParsedUrlQuery {
    return this.parsedUrl.query;
  }

  public get path(): string {
    return this.parsedUrl.path ?? "/";
  }

  public get params(): object {
    return {
      ...this.layerParams,
      ...this.routerParams,
      ...this.routeParams,
    };
  }

  public _read(): void {
    setImmediate(() => {
      const data = JSON.stringify(this.data);
      this.push(data.slice(0, 1));

      if (this.simulate?.includes("aborted")) {
        this.emit("aborted");
      }
      if (this.simulate?.includes("error")) {
        this.emit("error", new Error("Simulated stream error"));
      }
      if (this.simulate?.includes("close")) {
        this.emit("close");
      }

      this.push(data.slice(1));
      this.push(null); 
    });
  }

  public resetRouterParams(): void {
    this.routerParams = undefined;
  }

  public setRouterParams(params: Record<string, string>): this {
    this.routerParams = params;

    return this;
  }

  public resetRouteParams(): void {
    this.routeParams = undefined;
  }

  public setRouteParams(params: Record<string, string>): this {
    this.routeParams = params;
    
    return this;
  }

  public resetLayerParams(): void {
    this.layerParams = undefined;
  }
}

export default MockRequest;