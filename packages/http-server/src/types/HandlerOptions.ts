import type ResponseOptions from "./ResponseOptions";

interface HandlerOptions {
  responseOptions?: ResponseOptions;
  pathOptions?: {
    sensitive?: boolean;
    strict?: boolean;
  };
}


export default HandlerOptions;