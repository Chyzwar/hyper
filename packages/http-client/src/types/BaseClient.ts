import type RequestOptions from "./RequestOptions.js";
import type ResponseType from "./ResponseType.js";

abstract class BaseClient {
  /**
   * Perform HTTP POST request
   */
  public abstract post: (path?: string, options?: Partial<RequestOptions>) => Promise<ResponseType>;

  /**
   *  Perform HTTP GET request
   */
  public abstract get: (path?: string, options?: Partial<RequestOptions>) => Promise<ResponseType>;

  /**
   *  Perform HTTP DELETE request
   */
  public abstract delete: (path?: string, options?: Partial<RequestOptions>) => Promise<ResponseType>;

  /**
   *  Perform HTTP PUT request
   */
  public abstract put: (path?: string, options?: Partial<RequestOptions>) => Promise<ResponseType>;

  /**
   *  Perform HTTP PATH request
   */
  public abstract path: (path?: string, options?: Partial<RequestOptions>) => Promise<ResponseType>;
}


export default BaseClient;
