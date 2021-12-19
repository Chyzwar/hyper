import { 
  HttpError, 
  Method, 
  HeaderName, 
  ContentType, 
  Localhost, 
  UserAgent,
} from "@hyper/http";

import {
  removeSuffix, 
  prefixWith,
} from "@hyper/utils";

import OptionsKey from "./enums/OptionsKey.js";
import type BaseClient from "./types/BaseClient.js";
import type RequestOptions from "./types/RequestOptions.js";
import type ResponseType from "./types/ResponseType.js";


type MethodOptions = Omit<Partial<RequestOptions>, "method">;

const slash = "/";

const defaultOptions = {
  headers: {
    [HeaderName.UserAgent]: UserAgent.Hyper,
    [HeaderName.ContentType]: ContentType.ApplicationJSON,
    [HeaderName.Accept]: ContentType.ApplicationJSON,
  },
};

class BrowserHttp implements BaseClient {
  private readonly baseUrl: URL;

  private readonly baseOptions: RequestOptions;

  public constructor(baseUrl: URL = Localhost, baseOptions?: RequestOptions) {
    this.baseUrl = baseUrl;

    this.baseOptions = {
      ...defaultOptions,
      ...baseOptions,
    };
  }

  /**
   * Build request options.
   * Use request options with fallback to base options
   */
  private addOption<K extends keyof RequestOptions>(options: RequestOptions, key: K, requestOptions?: RequestOptions): void {
    if (requestOptions?.[key]) {
      options[key] = requestOptions[key];
    }
    else if (this.baseOptions[key]) {
      options[key] = this.baseOptions[key];
    }
  }

  /**
   * Create options object based on method, requestOptions and base options of client
   * Use addOptions as micro optimization over object spread,
   * Ensure that only valid options is created based on options Key
   * Stringify any object if content type is JSON
   */
  private getOptions(method: Method, requestOptions?: MethodOptions): RequestInit {
    const options: RequestOptions = {method};

    this.addOption(options, OptionsKey.Credentials, requestOptions);
    this.addOption(options, OptionsKey.Headers, requestOptions);
    this.addOption(options, OptionsKey.Body, requestOptions);
    this.addOption(options, OptionsKey.Mode, requestOptions);
    this.addOption(options, OptionsKey.Redirect, requestOptions);

    if (requestOptions?.body) {
      if (options.headers && options.headers[HeaderName.ContentType] === ContentType.ApplicationJSON) {
        options.body = JSON.stringify(requestOptions.body);
      }
    }

    return options as RequestInit;
  }

  /**
   * Get request address
   * TODO: memoize this function
   */
  private getAddress(path?: string): string {
    if (!path) {
      return this.baseUrl.toString();
    }

    const {
      href,
    } = this.baseUrl;

    return new URL(
      `${removeSuffix(href, slash)}${prefixWith(path, slash)}`
    ).toString();
  }

  /**
   * Handle response unpack response to JSON.
   * If request status code 4xx or 5xx throw exception
  */
  private static async handleResponse<R extends  ResponseType>(response: Response): Promise<R> {
    if (response.ok) {
      if (response.headers.get(HeaderName.ContentType)?.startsWith(ContentType.ApplicationJSON)) {
        return response.json() as Promise<R>;
      }
      else if (response.headers.get(HeaderName.ContentType)?.startsWith(ContentType.TextPlain)) {
        return response.text() as Promise<R>;
      } 
      else if (response.headers.get(HeaderName.ContentType)?.startsWith(ContentType.ApplicationUrlEncoded)) {
        return response.formData() as Promise<R>;
      } 
      else if (response.headers.get(HeaderName.ContentType)?.startsWith(ContentType.ApplicationOctetStream)) {
        return response.arrayBuffer() as Promise<R>;
      }
      else {
        return response.blob() as Promise<R>;
      }
    }
    else {
      throw new HttpError(
        response.status,
        response.statusText
      );
    }
  }

  /**
   * Create and execute fetch request.
   */
  private async makeRequest<R extends ResponseType>(method: Method, path?: string, options?: MethodOptions): Promise<R> {
    return fetch(
      this.getAddress(path),
      this.getOptions(method, options)
    ).then<R>(BrowserHttp.handleResponse);
  }

  /**
   * HTTP GET
   */
  public async get<R extends ResponseType>(path?: string, options?: MethodOptions): Promise<R> {
    return this.makeRequest<R>(Method.GET, path, options);
  }

  /**
   * HTTP POST
   */
  public async post<R extends ResponseType>(path?: string, options?: MethodOptions): Promise<R> {
    return this.makeRequest(Method.POST, path, options);
  }

  /**
   * HTTP PUT
   */
  public async put<R extends ResponseType>(path?: string, options?: MethodOptions): Promise<R> {
    return this.makeRequest(Method.PUT, path, options);
  }

  /**
   * HTTP PATH
   */
  public async path<R extends ResponseType>(path?: string, options?: MethodOptions): Promise<R> {
    return this.makeRequest(Method.PATH, path, options);
  }

  /**
   * HTTP DELETE
   */
  public async delete<R extends ResponseType>(path?: string, options?: MethodOptions): Promise<R> {
    return this.makeRequest(Method.DELETE, path, options);
  }
}

export default BrowserHttp;
