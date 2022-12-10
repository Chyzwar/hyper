import type {Socket} from "net";
import {describe, it, expect} from "@jest/globals";
import Http1Request from "../Http1Request.js";

describe("Http1Request", () => {
  describe("stream", () => {
    it("should throw as stream is not supported in http1", () => {
      const socket = {} as Socket;
      const request = new Http1Request(socket);

      expect(() => request.stream).toThrowError("http v1 req do not have stream");
    });
  });

  describe("authority", () => {
    it("should use host header instead", () => {
      const socket = {} as Socket;
      const request = new Http1Request(socket);
      request.headers.host = "host.invalid";

      expect(request.authority).toBe("host.invalid");
    });

    it("should use return empty string of no host", () => {
      const socket = {} as Socket;
      const request = new Http1Request(socket);

      expect(request.authority).toBe("");
    });
  });
});