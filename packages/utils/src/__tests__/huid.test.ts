import huid from "../huid.js";
import {describe, it, expect} from "@jest/globals";

describe("huid", () => {
  it("should generate uuid", () => {
    expect(huid()).toEqual(expect.any(String));
  });
});