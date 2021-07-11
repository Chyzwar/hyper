import {uuid} from "@hyper/utils";

import Layer from "./Layer";
import type {LayerOptions} from "./Layer";
import type Request from "./types/Request.js";

export interface RequestIdOptions extends LayerOptions{
  generateId: Function;
}

export class RequestId extends Layer {
  public constructor(options: RequestIdOptions) {
    super(options);
  }

  public handler(req: Request): void {
    req.requestId = req.headers["x-request-id"] ?? req.headers["request-id"] ?? uuid();
  }
}