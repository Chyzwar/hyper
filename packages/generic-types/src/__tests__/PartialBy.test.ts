import type PartialBy from "../PartialBy.js";

describe("Generic Type: PartialBy", () => {
  it("should make property optional", () => {
    interface Test {
      a: string;
      b: string;
    }
    const a: PartialBy<Test, "a"> = {b: "test"};
    const b: PartialBy<Test, "b"> = {a: "test"};

    expect({...a, ...b} as Test).toBeDefined();
  });
});
