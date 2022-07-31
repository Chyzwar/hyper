/* eslint-disable @typescript-eslint/no-misused-promises */

import {EventEmitter} from "@hyper/event-emitter";
import {HttpError, StatusCode} from "@hyper/http";
import {createServer as createHttp1Server} from "http";
import {createServer as createHttp1SecureServer} from "https";
import {
  createServer as createHttp2Server,
  createSecureServer as createHttp2SecureServer,
} from "http2";
import type { 
  RequestListener, 
  Server as Htt1Server,
  ServerOptions as Http1ServerOptions,
} from "http";
import type { 
  Server as Htt1SecureServer,     
  ServerOptions as Http1SecureServerOptions,
} from "https";
import type { 
  Http2Server, 
  Http2SecureServer, 
  Http2ServerRequest, 
  Http2ServerResponse,
  ServerOptions as Http2ServerOptions,
  SecureServerOptions as Http2SecureServerOptions,
} from "http2";
import type {AddressInfo} from "net";

import Http1Response from "./response/Http1Response.js";
import Http2Request from "./request/Http2Request.js";
import Http2Response from "./response/Http2Response.js";
import Http1Request from "./request/Http1Request.js";
import Chain from "./Chain.js";
import MockResponse from "./MockResponse.js";
import MockRequest from "./MockRequest.js";
import parseURL from "./utils/parseURL.js";
import type Request from "./types/Request.js";
import type Response from "./types/Response.js";
import type Router from "./Router.js";
import type Layer from "./Layer.js";
import type Handler from "./types/Handler.js";
import type HandlerOptions from "./types/HandlerOptions.js";
import type ResponseOptions from "./types/ResponseOptions.js";

type NativeOptions = Http1SecureServerOptions & Http1ServerOptions & Http2SecureServerOptions & Http2ServerOptions;

export interface ServerOptions extends NativeOptions {
  port: number;
  http2?: boolean;
  pathOptions?: {
    sensitive?: boolean;
    strict?: boolean;
  };
  requestOptions?: {
    freshness?: boolean;
  };
  responseOptions?: ResponseOptions;
}

enum NativeEventNames {
  checkContinue = "checkContinue",
  request = "request",
  session = "session",
  sessionError = "sessionError",
  stream = "stream",
  timeout = "timeout",
  unknownProtocol = "unknownProtocol",
}

type EventMap = {
  checkContinue: (
    req: Request,
    res: Response,
  ) => void;
  request: (
    req: Request,
    res: Response,
    path?: string
  ) => void;
  chain: (chain: Chain) => void;
  handler: (handler: Handler) => void;
  layer: (layer: Layer) => void;
  router: (router: Router) => void;
  mount: (server: Server) => void;
};

type NativeServer = Htt1SecureServer | Htt1Server | Http2SecureServer | Http2Server;

const defaults: Omit<ServerOptions, "port"> = {
  allowHTTP1: true,
  minVersion: "TLSv1.3",
  IncomingMessage: Http1Request,
  ServerResponse: Http1Response,
  Http1IncomingMessage: Http1Request,
  Http1ServerResponse: Http1Response,
  Http2ServerRequest: Http2Request,
  Http2ServerResponse: Http2Response,
};

class Server implements Handler {
  private readonly options: ServerOptions;
  private readonly server: NativeServer;

  private chain: Chain;
  private emitter?: EventEmitter<EventMap>;

  public constructor(options: ServerOptions) {
    this.options = {
      ...defaults,
      ...options,
    };

    this.chain = new Chain();

    if (this.isSecure()) {
      if (this.options.http2) {
        this.server = createHttp2SecureServer(
          this.options,
          this.handler as unknown as (req: Http2ServerRequest, res: Http2ServerResponse) => void
        );
      }
      else {
        this.server = createHttp1SecureServer(
          this.options,
          this.handler as unknown as RequestListener
        );
      }
    }
    else {
      if (this.options.http2) {
        this.server = createHttp2Server(
          this.options,
          this.handler as unknown as (req: Http2ServerRequest, res: Http2ServerResponse) => void
        );
      }
      else {
        this.server = createHttp1Server(
          this.options,
          this.handler as unknown as RequestListener
        );
      }
    }
  }

  /**
   * Server is secure if key and cert are provided
   */
  public isSecure(): boolean {
    const {
      key,
      cert,
    } = this.options;

    return Buffer.isBuffer(cert) && Buffer.isBuffer(key);
  }

  /**
   * Get instance of underlying server
   */
  public getServer(): NativeServer {
    return this.server;
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
    if (event in NativeEventNames) {
      this
        .getServer()
        .on(event, handler);
    }
    else {
      this
        .getEmitter()
        .on(event, handler);
    }

    return this;
  }

  public getOptions(): ServerOptions {
    return this.options;
  }

  /**
   * Set Application chain
   *
   */
  public setChain(chain: Chain): this {
    this.chain = chain;
    this.emit("chain", chain);

    return this;
  }

  /**
   * Get Application chain
   */
  public getChain(): Chain {
    return this.chain;
  }

  /**
   * Add middleware: Layer
   */
  public addLayer(layer: Layer): this {
    this
      .getChain()
      .add(layer);

    this.emit("layer", layer);

    return this;
  }

  /**
   * Add middleware: Router
   */
  public addRouter(router: Router): this {
    this
      .getChain()
      .add(router);

    this.emit("router", router);

    return this;
  }

  /**
   * Add middleware: Handler
   */
  public add<Req extends Request = Request, Res extends Response = Response>(handler: Handler<Req, Res>): this {
    this
      .getChain()
      .add(handler as Handler);

    this
      .emit("handler", handler as Handler);

    return this;
  }

  public async inject(req: MockRequest = new MockRequest(), res: MockResponse = new MockResponse()): Promise<void> {
    await this.mount(this.getOptions());
    
    return new Promise((resolve, reject) => {
      res.on("close", resolve);

      this.handler(
        req, 
        res
      ).then(() => {
        req.destroy();
        res.destroy();
      }).catch(reject);
    });
  }

  /**
   * Mount application, freeze chain
   */
  public async mount(options: HandlerOptions): Promise<void> {
    if (Object.isFrozen(this.chain)) return;

    this.emit("mount", this);
    const chain = this.getChain();

    await chain.mount(options);
    Object.freeze(chain);
  }

  /**
   * Server request handler, start request pipeline
   */
  public handler: (request: Request, response: Response) => Promise<void> = async(req: Request, res: Response): Promise<void> => {
    try {
      /**
       * Parse url, this cannot be done in constructor because
       * IncomingMessage do not have url parsed in constructor
       */
      req.parsedUrl = parseURL(req.url);

      await this.chain.handler(
        req,
        res,
        req.path
      );
    }

    catch (error: unknown) {
      res.error(error as Error);
    }
    finally {
      if (!res.writableEnded) {
        res.error(new HttpError(StatusCode.NotFound));
      }
    }
  };

  /**
   * Mount and start listening for requests
   */
  public async listen(): Promise<AddressInfo> {
    await this.mount(this.getOptions());
    Object.freeze(this);
    
    return new Promise<AddressInfo>((resolve) => {
      this.server.listen(this.options.port, () => {
        resolve(this.server.address() as AddressInfo); 
      });
    });
  }
}

export default Server;