import prefixWith from "../prefixWith";


describe("prefixWith", () => {
  it("should add prefix", () => {
    expect(prefixWith("bar", "/")).toBe("/bar");
    expect(prefixWith("bar", "/foo/")).toBe("/foo/bar");
  });
});