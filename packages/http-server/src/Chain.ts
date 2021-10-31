import {EventEmitter} from "@hyper/event-emitter";

import type Handler from "./types/Handler.js";
import type HandlerOptions from "./types/HandlerOptions.js";
import type Request from "./types/Request.js";
import type Response from "./types/Response.js";

export interface ChainOptions extends HandlerOptions{
  chain?: Handler[];
}

type EventMap = {
  mount: (server: HandlerOptions) => void;
  handler: (handler: Handler) => void;
  parent: (parent: Handler) => void;
  request: (
    req: Request, 
    res: Response,
    path?: string,
  ) => void;
};

class Chain extends Array<Handler> implements Handler {
  private options?: ChainOptions;
  private parentOptions?: HandlerOptions;
  private emitter?: EventEmitter<EventMap>;

  public constructor(chain?: Handler[]) {
    super();

    if (chain) {
      chain.forEach((handler: Handler) => this.push(handler));
    }
  }

  /**
   * Get or initialize EventEmitter
   */
  private getEmitter(): EventEmitter<EventMap> {
    return this.emitter ?? (this.emitter = new EventEmitter<EventMap>());
  }

  /**
   * Set parent
   */
  private setParentOptions(parentOptions: HandlerOptions): this {
    this.parentOptions = parentOptions;

    return this;
  }

  /**
   * Register event handler
   */
  public on<E extends keyof EventMap>(event: E, handler: EventMap[E]): this {
    this
      .getEmitter()
      .on(event, handler);

    return this;
  }

  /**
   * Emit event using emitter
   */
  public emit<E extends keyof EventMap>(eventName: E, ...args: Parameters<EventMap[E]>): void {
    if (this.emitter) {
      this
        .emitter
        .emit(eventName, ...args);
    }
  }

  /**
   * Set router options, merge with defaults
   */
  public setOptions(options: ChainOptions): this {
    this.options = options;

    return this;
  }

  /**
   * Get options, combine with parent options and defaults
   */
  public getOptions(): ChainOptions {
    const {
      options = {},
      parentOptions = {},
    } = this;

    return {
      ...options,
      pathOptions: {
        ...parentOptions.pathOptions,
        ...options.pathOptions,
      },
    };
  }

  /**
   * Add Handler to chain
   * @throws if chain is mounted
   */
  public add(handler: Handler): this {
    if (this.parentOptions) {
      throw new Error("Chain is already mounted");
    }
    this.push(handler);
    this.emit("handler", handler);

    return this;
  }

  /**
   * Throw until mounted
   * @throws if chain is not mounted
   */
  public handler(req: Request, res: Response, path?: string): Promise<void> | void {
    this.emit("request", req, res, path);

    throw new Error("Chain is not mounted");
  }

  /**
   * Mount each layer to parent, freeze chain
   */
  public async mount(parentOptions: HandlerOptions): Promise<void> {
    this.emit("mount", parentOptions);

    this.setParentOptions(parentOptions);
    this.selectHandle();
    
    for (const handler of this) {
      await handler.mount(this.getOptions());
    }
    Object.freeze(this);
  }
  
  /**
   * Decide on handle function
   */
  private selectHandle(): void {
    switch (this.length) {
      case 0:
        this.handler = this.handleNone.bind(this);
        break;
      default:
        this.handler = this.handleChain.bind(this);
    }
  }

  /**
   * Handler incoming request,
   * Empty chain, no layers
   *
   */
  private handleNone(req: Request, res: Response): void {
    this.emit("request", req, res);
  }

  /**
   * Handler incoming request,
   * Iterate over all layers
   */
  private async handleChain(req: Request, res: Response, path?: string): Promise<void> {
    this.emit("request", req, res);
      
    for (const layer of this) {
      await layer
        .handler(
          req, 
          res, 
          path
        );
    }
  }
}

export default Chain;
