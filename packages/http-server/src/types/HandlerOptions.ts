import type ResponseOptions from "./ResponseOptions.js";

interface HandlerOptions {
  responseOptions?: ResponseOptions;
  pathOptions?: {
    sensitive?: boolean;
    strict?: boolean;
  };
}


export default HandlerOptions;