import isParam from "../isParam.js";
import {describe, it, expect} from "@jest/globals";

describe("isParam", () => {
  it("should return false", () => {
    expect(isParam("bar")).toBe(false);
  });

  it("should return true", () => {
    expect(isParam(":bar")).toBe(true);
  });
});
