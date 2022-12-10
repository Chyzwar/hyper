import prefixWith from "../prefixWith.js";
import {describe, it, expect} from "@jest/globals";

describe("prefixWith", () => {
  it("should add prefix", () => {
    expect(prefixWith("bar", "/")).toBe("/bar");
    expect(prefixWith("bar", "/foo/")).toBe("/foo/bar");
  });
});