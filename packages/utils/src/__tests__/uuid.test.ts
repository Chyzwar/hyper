import {jest} from "@jest/globals";
import {randomBytes} from "crypto";
import uuid from "../uuid";

jest.mock("crypto");

describe.skip("uuid", () => {
  const randomBytesFixture = [
    0x10,
    0x91,
    0x56,
    0xbe,
    0xc4,
    0xfb,
    0xc1,
    0xea,
    0x71,
    0xb4,
    0xef,
    0xe1,
    0x67,
    0x1c,
    0x58,
    0x36,
  ];

 

  it("generate uuid", () => {
    (randomBytes as jest.Mock).mockReturnValue(randomBytesFixture);
    expect(uuid()).toEqual("109156be-c4fb-41ea-b1b4-efe1671c5836");
  });

  it("should include version", () => {
    (randomBytes as jest.Mock).mockReturnValue(randomBytesFixture);
    expect(uuid()[14]).toBe("4");
  });
});