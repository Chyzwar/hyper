import type {JSONValue} from "@hyper/utility-types";

import type RequestOptions from "./RequestOptions";

abstract class BaseClient {
  /**
   * Perform HTTP POST request
   */
  public abstract post: (path?: string, options?: Partial<RequestOptions>) => Promise<JSONValue>;

  /**
   *  Perform HTTP GET request
   */
  public abstract get: (path?: string, options?: Partial<RequestOptions>) => Promise<JSONValue>;

  /**
   *  Perform HTTP DELETE request
   */
  public abstract delete: (path?: string, options?: Partial<RequestOptions>) => Promise<JSONValue>;

  /**
   *  Perform HTTP PUT request
   */
  public abstract put: (path?: string, options?: Partial<RequestOptions>) => Promise<JSONValue>;

  /**
   *  Perform HTTP PATH request
   */
  public abstract path: (path?: string, options?: Partial<RequestOptions>) => Promise<JSONValue>;
}


export default BaseClient;
