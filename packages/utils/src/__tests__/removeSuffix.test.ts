import {describe, it, expect} from "@jest/globals";
import removeSuffix from "../removeSuffix.js";

describe("removeSuffix", () => {
  it("should remove suffix", () => {
    expect(removeSuffix("/bar", "/")).toBe("/bar");
    expect(removeSuffix("/bar", "bar")).toBe("/");
    expect(removeSuffix("/foo/bar", "/bar/")).toBe("/foo/bar");
  });
});