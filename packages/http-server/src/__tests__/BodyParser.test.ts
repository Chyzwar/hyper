import {stringToBytes} from "@hyper/utils";
import {describe, it, expect} from "@jest/globals";
import {
  ContentEncoding, 
  HeaderName, 
  Method, 
  ContentType, 
  StatusCode,
} from "@hyper/http";

import Server from "../Server.js";
import BodyParser from "../BodyParser.js";
import MockRequest from "../MockRequest.js";
import MockResponse from "../MockResponse.js";
import Route from "../Route.js";

describe("Body Parser", () => {
  const server = new Server({port: 0});
  server.add(new BodyParser());
  server.add(new Route({
    path: "/", 
    method: Method.GET,
    handler: (req, res): void => {
      res.json(req.body); 
    },
  }));
  const data = {
    foo: [1, 2],
    bar: {
      baz: "foo",
    },
  };

  it("should error 413 if content-length header is above limit", async() => {
    const req = new MockRequest({
      headers: {
        [HeaderName.ContentLength]: `${stringToBytes("3mb")}`,
      },
    });
    const res = new MockResponse();
    
    await server.inject(req, res);

    expect(res.statusCode).toBe(StatusCode.PayloadTooLarge);
  });

  it("should error 400 if content do not match content length - more", async() => {
    const string = JSON.stringify(data);

    const req = new MockRequest({
      data,
      headers: {
        [HeaderName.ContentLength]: `${Buffer.byteLength(string) - 1}`,
        [HeaderName.ContentEncoding]: ContentEncoding.Identity,
        [HeaderName.ContentType]: ContentType.ApplicationJSON,
      },
    });
    const res = new MockResponse();
    
    await server.inject(req, res);

    expect(res.statusCode).toBe(StatusCode.BadRequest);
  });

  it("should error 400 if content size do no match body - less", async() => {

    const string = JSON.stringify(data);

    const req = new MockRequest({
      data,
      headers: {
        [HeaderName.ContentLength]: `${Buffer.byteLength(string) + 1}`,
        [HeaderName.ContentEncoding]: ContentEncoding.Identity,
        [HeaderName.ContentType]: ContentType.ApplicationJSON,
      },
    });
    const res = new MockResponse();

    await server.inject(req, res);

    expect(res.statusCode).toBe(StatusCode.BadRequest);
  });

  it("should error 400 if stream is aborted", async() => {
    const string = JSON.stringify(data);

    const req = new MockRequest({
      data,
      headers: {
        [HeaderName.ContentLength]: `${Buffer.byteLength(string) + 1}`,
        [HeaderName.ContentEncoding]: ContentEncoding.Identity,
        [HeaderName.ContentType]: ContentType.ApplicationJSON,
      },
      simulate: ["aborted"],
    });
    const res = new MockResponse();

    await server.inject(req, res);

    expect(res.statusCode).toBe(StatusCode.BadRequest);
  });

  it("should error 500 if stream has error", async() => {
    const string = JSON.stringify(data);

    const req = new MockRequest({
      data,
      headers: {
        [HeaderName.ContentLength]: `${Buffer.byteLength(string) + 1}`,
        [HeaderName.ContentEncoding]: ContentEncoding.Identity,
        [HeaderName.ContentType]: ContentType.ApplicationJSON,
      },
      simulate: ["error"],
    });
    const res = new MockResponse();

    await server.inject(req, res);

    expect(res.statusCode).toBe(StatusCode.InternalServerError);
  });
  
  it("should parse json identity stream", async() => {
    const string = JSON.stringify(data);
    const req = new MockRequest({
      url: "/",
      data,
      headers: {
        [HeaderName.ContentLength]: `${Buffer.byteLength(string)}`,
        [HeaderName.ContentEncoding]: ContentEncoding.Identity,
        [HeaderName.ContentType]: ContentType.ApplicationJSON,
      },
      
    });
    const res = new MockResponse();
    
    await server.inject(req, res);

    expect(req.body).toEqual(data);
  });
});