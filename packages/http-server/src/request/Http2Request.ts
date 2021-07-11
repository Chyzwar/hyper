import {Http2ServerRequest} from "http2";
import type {JSONValue} from "@hyper/utility-types";
import type {ParsedUrlQuery} from "querystring";
import type {UrlWithParsedQuery} from "url";

import Chars from "../enums/Chars.js";

class Http2Request<B = unknown> extends Http2ServerRequest {
  [key: string]: unknown;
  
  public parsedUrl!: Readonly<UrlWithParsedQuery>;
  public body!: B;

  private routeParams?: Record<string, JSONValue>;
  private layerParams?: Record<string, JSONValue>;
  private routerParams?: Record<string, JSONValue>;

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

export default Http2Request;