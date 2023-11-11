/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */

import {Logger} from "@hyper/logger";
import {HeaderName, StatusCode} from "@hyper/http";

import Layer from "./Layer.js";
import type Request from "./types/Request.js";
import type Response from "./types/Response.js";
import type {LayerOptions} from "./Layer.js";


export interface RequestLoggerOptions extends LayerOptions {
  successMessage?: string;
  errorMessage?: string;
  abortedMessage?: string;
  serializers?: {
    error?: (
      req: Request, 
      res: Response, 
      responseTime: number, 
      error?: Error
    ) => object;
    success?: (
      req: Request, 
      res: Response, 
      responseTime: number
    ) => object;
    abort?: (
      req: Request, 
      res: Response, 
      responseTime: number
    ) => object;
  };
  logger?: {
    info: (message: string, meta: object) => void;
    warn: (message: string, meta: object) => void;
    error: (message: string, meta: object) => void;
  };
}


function baseSerializer(req: Request, res: Response, responseTime: number): object {
  return {
    responseTime,
    req: {
      method: req.method,
      url: req.path,
      query: req.query,
      headers: {
        [HeaderName.UserAgent]: req.headers[HeaderName.UserAgent], 
        [HeaderName.ContentType]: req.headers[HeaderName.ContentType],
      },
    },
    res: {
      statusCode: res.statusCode,
    },
  };
}

const defaults = {
  logger: new Logger(),
  successMessage: "request completed",
  errorMessage: "request error",
  abortedMessage: "request aborted",
  serializers: {
    error: (req: Request, res: Response, responseTime: number, error?: Error): object => {
      const meta = baseSerializer(req, res, responseTime);
      
      if (error) {
        return {
          ...meta,
          error,
        };
      }
      else {
        return meta;
      }
    },
    success: (req: Request, res: Response, responseTime: number): object => {
      const meta = baseSerializer(req, res, responseTime);
      return meta;
    },
    abort: (req: Request, res: Response, responseTime: number): object => {
      const meta = baseSerializer(req, res, responseTime);
      return meta;
    },
  },
};

class RequestLogger extends Layer {
  private readonly successMessage: string;
  private readonly errorMessage: string;
  private readonly abortedMessage: string;

  private readonly logger: {
    info: (message: string, meta: object) => void;
    warn: (message: string, meta: object) => void;
    error: (message: string, meta: object) => void;
  };

  private readonly serializers: {
    success: (req: Request, res: Response, responseTime: number) => object;
    abort: (req: Request, res: Response, responseTime: number) => object;
    error: (req: Request, res: Response, responseTime: number, error?: Error) => object;
  };

  public constructor(options?: RequestLoggerOptions) {
    super(options);
    
    this.successMessage = options?.successMessage ?? defaults.successMessage;
    this.errorMessage = options?.errorMessage ?? defaults.errorMessage;
    this.abortedMessage = options?.abortedMessage ?? defaults.abortedMessage;

    this.logger = options?.logger ?? defaults.logger;
    this.serializers = {
      ...defaults.serializers,
      ...options?.serializers,
    };
  }

  public handler(req: Request, res: Response): void {
    const start = Date.now();

    const onError = (error: Error): void => {
      const end = Date.now();

      this.logger.error(
        this.errorMessage, 
        this.serializers.error(req, res, end - start, error)
      );
    };
  
    const onAborted = (): void => {
      const end = Date.now();

      this.logger.warn(
        this.abortedMessage, 
        this.serializers.abort(req, res, end - start)
      );
    };

    const onFinished = (): void => {
      req.removeListener("error", onError);
      req.removeListener("aborted", onAborted);
      req.removeListener("finish", onFinished);
      
      const end = Date.now();

      if (res.statusCode < StatusCode.BadRequest) {
        this.logger.info(
          this.successMessage, 
          this.serializers.success(req, res, end - start)
        );
      }
      else {
        this.logger.error(
          this.errorMessage, 
          this.serializers.error(req, res, end - start)
        );
      }
    };

    res.on("finish", onFinished);
    res.on("error", onError);
    req.on("aborted", onAborted);
  }
}

export default RequestLogger;