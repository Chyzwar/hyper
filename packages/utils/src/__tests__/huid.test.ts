import huid from "../huid";


describe("huid", () => {
  it("should generate uuid", () => {
    expect(huid()).toEqual(expect.any(String));
  });
});