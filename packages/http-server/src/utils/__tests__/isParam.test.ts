import isParam from "../isParam.js";


describe("isParam", () => {
  it("should return false", () => {
    expect(isParam("bar")).toBe(false);
  });

  it("should return true", () => {
    expect(isParam(":bar")).toBe(true);
  });
});
