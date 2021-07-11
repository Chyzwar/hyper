import removeSuffix from "../removeSuffix";

describe("removeSuffix", () => {
  it("should remove suffix", () => {
    expect(removeSuffix("/bar", "/")).toBe("/bar");
    expect(removeSuffix("/bar", "bar")).toBe("/");
    expect(removeSuffix("/foo/bar", "/bar/")).toBe("/foo/bar");
  });
});