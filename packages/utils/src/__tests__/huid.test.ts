import huid from "../huid.js";


describe("huid", () => {
  it("should generate uuid", () => {
    expect(huid()).toEqual(expect.any(String));
  });
});