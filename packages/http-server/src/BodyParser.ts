/* eslint-disable @typescript-eslint/no-use-before-define */

import {StringDecoder} from "string_decoder";
import {createInflate, createGunzip, createBrotliDecompress} from "zlib";
import {stringToBytes} from "@hyper/utils";
import {
  HttpError, 
  ContentEncoding, 
  HeaderName, 
  Charset, 
  ContentType, 
  getContentType,
  StatusCode,
} from "@hyper/http";
import type {Readable} from "stream";
import type {Bytes} from "@hyper/utils";
import type {Headers} from "@hyper/http";
import type {JSONValue} from "@hyper/utility-types";

import Layer from "./Layer.js";
import ErrorCodes from "./enums/ErrorCodes.js";
import type Request from "./types/Request.js";
import type {LayerOptions} from "./Layer.js";

export interface BodyParserOptions extends LayerOptions {
  limit: Bytes;
}

export class BodyParser extends Layer {
  private readonly limit: number;

  public constructor(options: BodyParserOptions = {limit: "2MB"}) {
    super(options);
    this.limit = stringToBytes(options.limit);
  }

  public getContentStream(req: Request, encoding: ContentEncoding | string = ContentEncoding.Identity): Readable {
    let stream = null;

    switch (encoding) {
      case ContentEncoding.Deflate:
        stream = createInflate();
        req.pipe(stream);
        break;
      case ContentEncoding.Gzip:
        stream = createGunzip();
        req.pipe(stream);
        break;
      case ContentEncoding.Br:
        stream = createBrotliDecompress();
        req.pipe(stream);
        break;
      case ContentEncoding.Identity:
        stream = req;
        break;
      default:
        throw new HttpError(StatusCode.UnsupportedMediaType, `Content encoding unsupported: ${encoding}`);
    }

    return stream;
  }

  public async getJSONBody(stream: Readable, charset: Charset, length: number, limit: number): Promise<JSONValue> {
    if (charset !== Charset.UTF8) {
      throw new HttpError(StatusCode.PayloadTooLarge, "Specified charset is unsupported", {
        charset,
      });
    }
    const decoder = new StringDecoder("utf8");
    
    return new Promise((resolve, reject) => {
      let complete = false;
      let received = 0;
      let data = "";

      function onClose(): void {
        data = "";

        stream.removeListener("aborted", onAborted);
        stream.removeListener("data", onData);
        stream.removeListener("end", onEnd);
        stream.removeListener("error", onEnd);
        stream.removeListener("close", onClose);
      }

      function onError(error: Error): void {
        complete = true;
        onClose();
        stream.unpipe();
        stream.pause();
        reject(error);
      }

      function onAborted(): void {
        if (complete) return;
        
        onError(
          new HttpError(StatusCode.BadRequest, "Request aborted", {
            code: ErrorCodes.REQUEST_STREAM_ABORTED,
          })
        );
      }

      function onData(chunk: Buffer): void {
        if (complete) return;
        received += chunk.length;

        if (received > limit) {
          onError(
            new HttpError(StatusCode.PayloadTooLarge, "Content entity above limit", {
              received,
              limit,
              code: ErrorCodes.REQUEST_ENTITY_TOO_LARGE,
            })
          );
        }
        else {
          data += decoder.write(chunk);
        }
      }
      
      function onEnd(): void {
        if (complete) return;
        
        if (received !== length) {
          onError(
            new HttpError(StatusCode.BadRequest, "Request size did not match content length", {
              received,
              length,
              code: ErrorCodes.REQUEST_ENTITY_SIZE_MISMATCH,
            })
          );
        }
        else {
          data += decoder.end();
          complete = true;
          resolve(JSON.parse(data) as JSONValue);
        }
      }
      
      stream.on("aborted", onAborted);
      stream.on("close", onClose);
      stream.on("data", onData);
      stream.on("end", onEnd);
      stream.on("error", onError);      
    });
  }

  public async handler(req: Request): Promise<void> {
    if (req.body) {
      return;
    }
    
    const {
      headers,
    } = req;
    
    const { 
      limit, 
    } = this;
    
    const encoding: ContentEncoding = (headers as Headers)[HeaderName.ContentEncoding] 
      ?? ContentEncoding.Identity;

    const contentType: ContentType = (headers as Headers)[HeaderName.ContentType] 
      ?? ContentType.ApplicationJSON;

    const contentLength = (headers as Headers)[HeaderName.ContentLength];

    if (contentLength) {
      const length = Number(contentLength);

      if (length > limit) {
        throw new HttpError(StatusCode.PayloadTooLarge, "Content entity above limit", {
          limit,
          length,
          code: ErrorCodes.REQUEST_ENTITY_TOO_LARGE,
        });
      }
      
      const { 
        type, 
        params: {
          charset,
        }, 
      } = getContentType(contentType);
  
      if (type === "application/json") {
        const stream = this.getContentStream(req, encoding);
          
        req.body = await this.getJSONBody(
          stream,
          charset,
          length,
          limit 
        );
      }    
    }
  }
}

export default BodyParser;