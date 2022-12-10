import hasParams from "../hasParams.js";
import {describe, it, expect} from "@jest/globals";

describe("hasParams", () => {
  it("should return false", () => {
    expect(hasParams("/foo/bar")).toBe(false);
  });

  it("should return true", () => {
    expect(hasParams("/foo/:bar")).toBe(true);
  });
});

