import type JSONValue from "../JSONValue";
import {describe, it, expect} from "@jest/globals";

describe("JSONValue", () => {
  it("should typecheck", () => {
    const test1  = "string";
    const test2 = true;
    const test3  = 123;
    const test4   = [test1, test2, test3];

    const value1: JSONValue = {
      test4,
      test2: {
        test1,
        test2,
        test3,
        test4,
      },
    };
    expect(value1).toBeDefined();

    const value2: JSONValue = test4;
    expect(value2).toBeDefined();
  });
});