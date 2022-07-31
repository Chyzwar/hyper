import {EventEmitter} from "@hyper/event-emitter";
import {Method} from "@hyper/http";

import Chain from "./Chain.js";
import Route from "./Route.js";
import PathRegExp from "./path/PathRegExp.js";
import PathParams from "./path/PathParams.js";
import PathString from "./path/PathString.js";
import createPath from "./utils/createPath.js";
import type Request from "./types/Request.js";
import type Response from "./types/Response.js";
import type Handle from "./types/Handle.js";
import type Handler from "./types/Handler.js";
import type HandlerOptions from "./types/HandlerOptions.js";
import type MatchPartial from "./path/types/MatchPartial.js";
import type MatchParams from "./path/types/MatchParams.js";
import type Path from "./path/types/Path.js";
import type PathSource from "./path/types/PathSource.js";
import type {RouteOptions} from "./Route.js";

export interface RouterOptions extends HandlerOptions {
  path?: PathSource;
}

type EventMap = {
  mount: (server: HandlerOptions) => void;
  route: (route: Route) => void;
  handler: (handler: Handler) => void;
  request: <Req extends Request, Res extends Response>(
    req: Req,
    res: Res,
    path?: string
  ) => void;
};

const defaults = {
  pathOptions: {
    start: true,
    end:  false,
    strict: false,
    sensitive: true,
  },
}; 

type AddRouteOptions = Omit<RouteOptions, "handle" | "method">;

class Router implements Handler {
  private parentOptions!: HandlerOptions;
  private emitter?: EventEmitter<EventMap>;
  private path?: Path;
  private options?: RouterOptions;
  private before?: Chain;
  private routes?: Chain;
  private chain?: Chain;
  private after?: Chain;

  public constructor(options?: RouterOptions) {
    if (options) {
      this.setOptions(options);
    }
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
   * Set and mount path
   */
  public setPath(path: PathSource): this {
    this.path = createPath(path);

    return this;
  }

  /**
   * Set router options, merge with defaults
   */
  public setOptions(options: RouterOptions): this {
    this.options = options;

    if (this.options.path) {
      this.setPath(this.options.path);
    }

    return this;
  }

  /**
   * Get options
   */
  public getOptions(): RouterOptions {
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
   * Set parent
   */
  public setParentOptions(parentOptions: HandlerOptions): this {
    this.parentOptions = parentOptions;

    return this;
  }

  /**
   * Set After Chain
   */
  public setRoutes(chain: Handler[]): void {
    this.routes = new Chain(chain);
  }

  /**
   * Set After Chain
   */
  public setAfter(chain: Handler[]): void {
    this.after = new Chain(chain);
  }

  /**
   * Set After Chain
   */
  public setBefore(chain: Handler[]): void {
    this.before = new Chain(chain);
  }

  /**
   * Get Router Chain
   */
  public getChain(): Chain {
    return this.chain ?? (this.chain = new Chain(
      [...this.before ?? [], ...this.routes ?? [], ...this.after ?? []]
    ));
  }


  /**
   * Mount router, freezes router
   */
  public async mount(parentOptions: HandlerOptions): Promise<void> {
    this.setParentOptions(parentOptions);
    this.emit("mount", parentOptions);

    await this
      .getChain()
      .mount(this.getOptions());
    
    if (this.path) {
      const options = this.getOptions();

      this.path.mount({
        ...defaults.pathOptions,
        ...options.pathOptions,
      });
    }

    this.selectHandle();
    Object.freeze(this);
  }

  /**
   * Default handle method
   * @throws if not mounted
   */
  public handler(req: Request, res: Response, path?: string): void {
    this.emit("request", req, res, path);

    throw new Error(
      "Router.handle(..) router was not mounted"
    );
  }

  /**
   * Get or initialize Routes Chain
   *
   */
  public getRoutes(): Chain {
    return this.routes ?? (this.routes = new Chain());
  }

  /**
   * Add HTTP Route handler,
   */
  public addRoute<Req extends Request = Request, Res extends Response = Response>(method: Method, path: PathSource, handler: Handle<Req, Res>, config?: AddRouteOptions): this {
    const route = new Route<Req, Res>(
      {path, handler, method, ...config}
    );

    this
      .getRoutes()
      .add(route as unknown as Handler); 
    
    this.emit("route", route as Route);

    return this;
  }

  /**
   * Add HTTP OPTIONS Route
   */
  public options2(path: PathSource, handler: Handle, options?: AddRouteOptions): this {
    return this
      .addRoute(Method.OPTIONS, path, handler, options);
  }

  /**
   * Add HTTP GET Route
   */
  public get<Req extends Request = Request, Res extends Response = Response>(path: PathSource, handler: Handle<Req, Res>, options?: AddRouteOptions): this {
    return this
      .addRoute(Method.GET, path, handler, options);
  }

  /**
   * Add HEAD OPTIONS Route
   */
  public head(path: PathSource, handler: Handle, options?: AddRouteOptions): this {
    return this
      .addRoute(Method.HEAD, path, handler, options);
  }

  /**
   * Add POST OPTIONS Route
   */
  public post<Req extends Request = Request, Res extends Response = Response>(path: PathSource, handler: Handle<Req, Res>, options?: AddRouteOptions): this {
    return this
      .addRoute(Method.POST, path, handler, options);
  }

  /**
   * Add HTTP PUT Route
   */
  public put(path: PathSource, handler: Handle, options?: AddRouteOptions): this {
    return this
      .addRoute(Method.PUT, path, handler, options);
  }

  /**
   * Add HTTP DELETE Route
   */
  public delete(path: PathSource, handler: Handle, options?: AddRouteOptions): this {
    return this
      .addRoute(Method.DELETE, path, handler, options);
  }

  /**
   * Add HTTP TRACE Route
   */
  public trace(path: PathSource, handler: Handle, options?: AddRouteOptions): this {
    return this
      .addRoute(Method.TRACE, path, handler, options);
  }

  /**
   * Add HTTP CONNECT Route
   */
  public connect(path: PathSource, handler: Handle, options?: AddRouteOptions): this {
    return this
      .addRoute(Method.CONNECT, path, handler, options);
  }

  /**
   * Handle incoming request,
   * String path, no params
   */
  private async handlePathString(req: Request, res: Response, path: string): Promise<void> {
    const match = this.path!.match(path) as MatchPartial | false;

    if (match) {
      this.emit("request", req, res, path);
      req.resetRouterParams();
        
      await this
        .chain!
        .handler(
          req,
          res,
          match.rest
        );
    }
  }

  /**
   * Handle incoming request,
   * Capture params in path
   */
  private async handlePathParams(req: Request, res: Response, path: string): Promise<void> {
    const match = this.path!.match(path) as MatchParams | false;

    if (match) {
      this.emit("request", req, res, path);
      req.setRouterParams(match.params);

      await this
        .chain!
        .handler(
          req,
          res,
          match.rest ?? "/"
        );
    }
  }

  /**
   * Handle incoming request,
   * No path only chain
   */
  private async handleChainOnly(req: Request, res: Response, path: string): Promise<void> {
    this.emit("request", req, res, path);

    await this
      .chain!
      .handler(
        req,
        res,
        path
      );
  }

  /**
   * Select handle for Router
   */
  private selectHandle(): void {
    const path = this.path;

    if (path instanceof PathString) {
      this.handler = this.handlePathString;
    }
    else if (path instanceof PathParams) {
      this.handler = this.handlePathParams;
    }
    else if (path instanceof PathRegExp) {
      this.handler = this.handlePathParams;
    }
    else {
      this.handler = this.handleChainOnly;
    }
  }  
}

export default Router;