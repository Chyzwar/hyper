import {IncomingMessage} from "http";
import type {JSONValue} from "@hyper/utility-types";
import type {ParsedUrlQuery} from "querystring";
import type {UrlWithParsedQuery} from "url";
import type {ServerHttp2Stream} from "http2";

import Chars from "../enums/Chars.js";

class Http1Request<B = unknown> extends IncomingMessage {
  [key: string]: unknown;
  
  public parsedUrl!: Readonly<UrlWithParsedQuery>;
  public body!: B;
  public scheme!: string;
  
  public routeParams?: Record<string, JSONValue>;
  public layerParams?: Record<string, JSONValue>;
  public routerParams?: Record<string, JSONValue>;

  public get authority(): string {
    return this.headers.host ?? "";
  }

  public get stream(): ServerHttp2Stream {
    throw new Error("http v1 req do not have stream");
  }

  public get query(): ParsedUrlQuery {
    return this.parsedUrl.query;
  }

  public get path(): string {
    return this.parsedUrl.path ?? Chars.Slash;
  }

  public get params(): object {
    return {
      ...this.layerParams,
      ...this.routerParams,
      ...this.routeParams,
    };
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

export default Http1Request;