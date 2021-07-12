import {IncomingMessage} from "http";
import type {Socket} from "net";

import Http1Response from "../Http1Response.js";

describe("Http1Response", () => {
  describe("stream", () => {
    it("should throw as stream is not supported in http1", () => {
      const socket = {} as Socket;
      const incomingMessage = new IncomingMessage(socket);
      const response = new Http1Response(incomingMessage);

      expect(() => response.stream).toThrowError("http v1 res do not have stream");
    });
  });
});