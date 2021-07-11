import removePrefix from "../removePrefix";

describe("removePrefix", () => {
  it("should remove prefix", () => {
    expect(removePrefix("/bar", "/")).toBe("bar");
    expect(removePrefix("/foo/bar", "/foo/")).toBe("bar");
  });
});
