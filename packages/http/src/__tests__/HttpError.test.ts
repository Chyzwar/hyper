import HttpError from "../HttpError.js";

describe("HttpError", () => {
  it("should initialize with message based on statusCode and statusText", () => {
    const code = 403;
    const error = new HttpError(code);
    expect(error.message).toBe("403 - Forbidden");
  });

  it("should add meta properties", () => {
    const code = 403;
    const error = new HttpError(code, "Forbidden", {test: 1});
    
    expect(error.message).toBe("403 - Forbidden");
    expect(error.test).toBe(1);
  });
});