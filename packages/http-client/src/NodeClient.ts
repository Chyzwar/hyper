import {Method, Localhost} from "@hyper/http";
import {connect} from "http2";
import type {Headers} from "@hyper/http";
import type {JSONValue} from "@hyper/utility-types";
import type {ClientHttp2Session} from "http2";

import type BaseClient from "./types/BaseClient.js";
import type RequestOptions from "./types/RequestOptions.js";

type MethodOptions = Omit<RequestOptions, "method">;

class NodeHttp implements BaseClient {
  private readonly baseUrl: URL;

  private baseOptions?: RequestOptions;

  private session?: ClientHttp2Session;

  public constructor(baseUrl: URL = Localhost, baseOptions?: RequestOptions) {
    this.baseUrl = baseUrl;
    this.baseOptions = baseOptions;
  }

  /**
   * Set Options
   */
  public setOptions(options: RequestOptions): this {
    this.baseOptions = options;
    return this;
  }

  /**
   * HTTP GET
   */
  public async get(path?: string, options?: MethodOptions): Promise<JSONValue> {
    return this.makeRequest(Method.GET, path, options);
  }

  /**
   * HTTP POST
   */
  public async post(path?: string, options?: MethodOptions): Promise<JSONValue> {
    return this.makeRequest(Method.POST, path, options);
  }

  /**
   * HTTP PUT
   */
  public async put(path?: string, options?: MethodOptions): Promise<JSONValue> {
    return this.makeRequest(Method.PUT, path, options);
  }

  /**
   * HTTP PATH
   */
  public async path(path?: string, options?: MethodOptions): Promise<JSONValue> {
    return this.makeRequest(Method.PATH, path, options);
  }

  /**
   * HTTP DELETE
   */
  public async delete(path?: string, options?: MethodOptions): Promise<JSONValue> {
    return this.makeRequest(Method.DELETE, path, options);
  }

  /**
   * Get of initialize nw session
   */
  private getSession(): ClientHttp2Session {
    return this.session ?? (this.session = connect(this.baseUrl));
  }

  /**
   * Construct options for request
   */
  private getOptions(method: Method, path?: string, requestOptions?: MethodOptions): Headers {
    const {baseOptions} = this;
 
    return {
      ":path": path,
      ":method": method,
      ...baseOptions
        ? baseOptions.headers
        : null
      ,
      ...requestOptions
        ? requestOptions.headers
        : null
      ,
    };
  }

  private async makeRequest(method: Method, path?: string, options?: MethodOptions): Promise<JSONValue> {
    const session = this.getSession();

    return new Promise<string>((resolve: Function, reject: Function) => {
      const request = session.request(
        this.getOptions(method, path, options)
      );

      let data = "";
      request.on("data", (chunk: Buffer) => {
        data += chunk;
      });
      request.on("error", (error: Error) => {
        reject(error);
      });
      request.on("end", () => {
        resolve(data);
      });
    }).then(JSON.parse as (value: string) => JSONValue);
  }
}

export default NodeHttp;