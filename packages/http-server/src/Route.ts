/* eslint-disable @typescript-eslint/no-misused-promises */
import {EventEmitter} from "@hyper/event-emitter";
import type {Method} from "@hyper/http";

import createPath from "./utils/createPath.js";
import PathString from "./path/PathString.js";
import PathParams from "./path/PathParams.js";
import PathRegExp from "./path/PathRegExp.js";
import type Request from "./types/Request.js";
import type Response from "./types/Response.js";
import type Handle from "./types/Handle.js";
import type Handler from "./types/Handler.js";
import type HandlerOptions from "./types/HandlerOptions.js";
import type MatchParams from "./path/types/MatchParams.js";
import type Match from "./path/types/Match.js";
import type Path from "./path/types/Path.js";
import type PathSource from "./path/types/PathSource.js";


export interface RouteOptions<Req extends Request = Request, Res extends Response = Response> extends HandlerOptions {
  method: Method;
  path: PathSource;
  handler: Handle<Req, Res>;
}

const defaults = {
  pathOptions: {
    sensitive: false,
    strict: false,
    end: true,
    start: true,
  },
};

type EventMap = {
  error: (error: Error) => void;
  mount: (server: HandlerOptions) => void;
  request: (
    req: Request,
    res: Response,
    path?: string
  ) => void;
};

class Route<Req extends Request = Request, Res extends Response = Response> implements Handler<Req, Res> {
  private parentOptions?: HandlerOptions;
  private options!: RouteOptions<Req, Res>;
  private emitter?: EventEmitter<EventMap>;
  private path!: Path;

  /**
   * Route constructor
   */
  public constructor(options: RouteOptions<Req, Res>) {
    this.setOptions(options);
  }

  /**
   * Get or initialize EventEmitter
   */
  private getEmitter(): EventEmitter<EventMap> {
    return this.emitter ?? (this.emitter = new EventEmitter<EventMap>());
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
   * Register event handler
   */
  public on<E extends keyof EventMap>(event: E, handler: EventMap[E]): this {
    this
      .getEmitter()
      .on(event, handler);

    return this;
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
    return this.path;
  }

  /**
   * Set router options
   */
  public setOptions(options: RouteOptions<Req, Res>): this {
    this.options = options;

    if (this.options.path) {
      this.setPath(this.options.path);
    }

    return this;
  }

  /**
   * Get options
   */
  public getOptions(): RouteOptions<Req, Res> {
    const {
      options,
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
   * Set Parent for route
   */
  public setParentOptions(parentOptions: HandlerOptions): this {
    this.parentOptions = parentOptions;

    return this;
  }

  /**
   * Mount parent, freeze parent
   */
  public mount(parentOptions: HandlerOptions): void {
    this.emit("mount", parentOptions);
    this.setParentOptions(parentOptions);

    const path = this.getPath();
    const options = this.getOptions();

    path.mount({
      ...defaults.pathOptions,
      ...options.pathOptions,
    });

    this.selectHandle();
    Object.freeze(this);
  }

  /**
   * Default handle function will throw
   * @throws {Error} if not mounted
   */
  public handler(req: Req, res: Res, path?: string): void {
    this.emit("request", req, res, path);

    throw new Error("Route.handle(..): route is not mounted");
  }

  /**
   * Use Handler for incoming req, res
   * Catch any handler errors
   */
  private async handling(req: Req, res: Res): Promise<void> {
    try {
      await this.options.handler(req, res);
    }
    catch (error: unknown) {
      this.emit("error", error as Error);
      throw error;
    }
  }

  /**
   * Match Route
   */
  private match(req: Request, res: Response, path?: string): Match {
    if (res.writableEnded || this.options.method !== req.method) {
      return false;
    }
    else {
      return this.path.match(path);
    }
  }

  /**
   * Handle incoming request
   * Set Params if matched
   */
  private async handlePathParams(req: Req, res: Res, path?: string): Promise<void> {
    const match = this.match(req, res, path) as MatchParams | false;

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
    const match = this.match(req, res, path) as MatchParams | false;

    if (match) {
      this.emit("request", req, res);

      req.setRouteParams(match.params);
      req.resetLayerParams();

      await this.handling(req, res);
    }
  }

  /**
   * Handle incoming request
   */
  private async handlePathString(req: Req, res: Res, path?: string): Promise<void> {
    const match = this.match(req, res, path);

    if (match) {
      this.emit("request", req, res);

      req.resetRouteParams();
      req.resetLayerParams();

      await this.handling(req, res);
    }
  }
  
  /**
   * Set handle function for route
   */
  private selectHandle(): void {
    const path = this.getPath();

    if (path instanceof PathString) {
      this.handler = this.handlePathString;
    }
    if (path instanceof PathParams) {
      this.handler = this.handlePathParams;
    }
    if (path instanceof PathRegExp) {
      this.handler = this.handlePathRegExp;
    }
  }
}

export default Route;
