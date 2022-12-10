import parseURL from "../parseURL.js";
import {describe, it, expect} from "@jest/globals";

describe("parseUrl", () => {
  it("should parse url", () => {
    const url = "/foo/bar";
    expect(parseURL(url)).toEqual({
      auth: null,
      hash: null,
      host: null,
      hostname: null,
      href: "/foo/bar",
      path: "/foo/bar",
      pathname: "/foo/bar",
      port: null,
      protocol: null,
      query: {},
      search: null,
      slashes: null,
    });
  });

  it("should decode url", () => {
    const url = "%2Ffoo%2Fbar";
    expect(parseURL(url)).toEqual({
      auth: null,
      hash: null,
      host: null,
      hostname: null,
      href: "/foo/bar",
      path: "/foo/bar",
      pathname: "/foo/bar",
      port: null,
      protocol: null,
      query: {},
      search: null,
      slashes: null,
    });
  });

  it("should parse query", () => {
    const url = "/foo/bar?test=1";
    expect(parseURL(url)).toEqual({
      auth: null,
      hash: null,
      host: null,
      hostname: null,
      href: "/foo/bar?test=1",
      path: "/foo/bar?test=1",
      pathname: "/foo/bar",
      port: null,
      protocol: null,
      query: {
        test: "1",
      },
      search: "?test=1",
      slashes: null,
    });
  });

  it("return undefined on invalid encoding", () => {
    const url = "'%E0%A4%A'";
    expect(parseURL(url)).toEqual({
      "auth": null, 
      "hash": null, 
      "host": null, 
      "hostname": null, 
      "href": "/", 
      "path": "/", 
      "pathname": "/", 
      "port": null, 
      "protocol": null, 
      "query": {}, 
      "search": null, 
      "slashes": null,
    });
  });
});
