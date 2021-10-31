import {EventEmitter} from "@hyper/event-emitter";

import createPath from "./utils/createPath.js";
import PathString from "./path/PathString.js";
import PathParams from "./path/PathParams.js";
import PathRegExp from "./path/PathRegExp.js";
import type Handler from "./types/Handler.js";
import type HandlerOptions from "./types/HandlerOptions.js";
import type Request from "./types/Request.js";
import type Response from "./types/Response.js";
import type Path from "./path/types/Path.js";
import type PathSource from "./path/types/PathSource.js";
import type MatchParams from "./path/types/MatchParams.js";

export interface LayerOptions extends HandlerOptions{
  path?: PathSource;
}

type EventMap = {
  error: (error: Error) => void;
  mount: (server: Handler) => void;
  handler: (options: HandlerOptions) => void;
  request: (
    req: Request, 
    res: Response, 
    path?: string
  ) => void;
};


class Layer<Req extends Request = Request, Res extends Response = Response> implements Handler<Req, Res> {
  private path?: Path;
  private options!: LayerOptions;
  private emitter?: EventEmitter<EventMap>;

  private readonly parentOptions!: HandlerOptions;

  /**
   * Layer constructor
   */
  public constructor(options: LayerOptions = {}) {
    this.setOptions(options);
  }

  /**
   * Set path for Route
   */
  public setPath(path: PathSource): this {
    this.path = createPath(path);

    return this;
  }

  /**
   * Get path
   */
  public getPath(): Path {
    return this.path!;
  }

  /**
   * Get or initialize EventEmitter
   */
  private getEmitter(): EventEmitter<EventMap> {
    return this.emitter ?? (this.emitter = new EventEmitter<EventMap>());
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
  private emit<E extends keyof EventMap>(eventName: E, ...args: Parameters<EventMap[E]>): void {
    if (this.emitter) {
      this
        .emitter
        .emit(eventName, ...args);
    }
  }
  
  /**
   * Set router options, merge with defaults
   */
  public setOptions(options: LayerOptions): this {
    this.options = options;

    if (this.options.path) {
      this.setPath(this.options.path);
    }

    return this;
  }

  /**
   * Get options
   */
  public getOptions(): LayerOptions {
    const {
      options,
      parentOptions,
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
   * Set parent
   */
  public setParentOptions(options: HandlerOptions): this {
    this.options = options;

    return this;
  }

  /**
   * Default handler impl
   */
  public handler(req: Req, res: Res): Promise<void> | void {
    this.emit("request", req, res);

    throw new Error("Layer.handler not implemented");
  }

  /**
   * Mount parent, freeze layer
   */
  public mount(parentOptions: HandlerOptions): void {
    this.setParentOptions(parentOptions);

    if (this.path) {
      const inheritedOwnOptions = this.getOptions();

      this.path.mount({
        end: true,
        start: true,
        sensitive: true,
        strict: true,
        ...inheritedOwnOptions.pathOptions,
      });
    }

    this.selectHandle();
    Object.freeze(this);
  }
  
  /**
   * Use Handler for incoming req, res
   * Catch any handler errors
   */
  private async handling(req: Req, res: Res): Promise<void> {
    try {
      await this.handler(req, res);
    }
    catch (error: unknown) {
      this.emit("error", error as Error);
      throw error;
    }
  }

  /**
   * Default request handle.
   * @throws if not mounted
   */
  public handle(req: Req, res: Res, path?: string): void {
    this.emit("request", req, res, path);

    throw new Error("Layer.handle(..) layer was not mounted");
  }
  
  /**
   * Handle incoming request
   * Set Params if matched
   */
  private async handlePathParams(req: Req, res: Res, path?: string): Promise<void> {
    const match = this.path!.match(path) as MatchParams | false;

    if (match) {
      this.emit("request", req, res);

      req.setRouteParams(match.params);
      req.resetLayerParams();

      await this.handling(req, res);
    }
  }

  /**
   * Handle incoming request
   * Set Params if matched
   */
  private async handlePathRegExp(req: Req, res: Res, path?: string): Promise<void> {
    const match = this.path!.match(path);

    if (match) {
      this.emit("request", req, res, path);

      req.resetRouteParams();
      req.resetLayerParams();

      await this.handling(req, res);
    }
  }

  /**
   * Handle incoming request
   */
  private async handlePathString(req: Req, res: Res, path?: string): Promise<void> {
    const match = this.path!.match(path);

    if (match) {
      this.emit("request", req, res, path);

      req.resetRouteParams();
      req.resetLayerParams();

      await this.handling(req, res);
    }
  }
  
  /**
   * Handle incoming request when layer do not have path
   */
  private async handleNoPath(req: Req, res: Res): Promise<void> {
    this.emit("request", req, res);

    await this.handling(req, res);
  }

  /**
   * Set handle function for route
   */
  private selectHandle(): void {
    const path = this.getPath();

    if (path instanceof PathString) {
      this.handle = this.handlePathString.bind(this);
    }
    else if (path instanceof PathParams) {
      this.handle = this.handlePathParams.bind(this);
    }
    else if (path instanceof PathRegExp) {
      this.handle = this.handlePathRegExp.bind(this);
    }
    else {
      this.handle = this.handleNoPath.bind(this);
    }
  }
}

export default Layer;