import hasParams from "../hasParams.js";


describe("hasParams", () => {
  it("should return false", () => {
    expect(hasParams("/foo/bar")).toBe(false);
  });

  it("should return true", () => {
    expect(hasParams("/foo/:bar")).toBe(true);
  });
});

