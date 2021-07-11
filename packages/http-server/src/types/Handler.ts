import type Request from "../types/Request.js";
import type Response from "../types/Response.js";
import type HandlerOptions from "./HandlerOptions.js";


interface Handler<Req extends Request = Request, Res extends Response = Response> {
  /**
   * Parent handler mount
   */
  mount: (options: HandlerOptions) => Promise<void> | void;

  /**
   * Http Request Handler
   */
  handler: (req: Req, res: Res, path?: string) => Promise<void> | void;
}

export default Handler;