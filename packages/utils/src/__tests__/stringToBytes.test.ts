import stringToBytes from "../stringToBytes.js";

describe("stringToBytes", () => {
  describe("stringToBytes", () => {
    it("should throw on missing unit", () => {
      expect(() => stringToBytes("1" as unknown as "1B")).toThrowError("Invalid value: 1");
    });

    it("should throw on missing amount", () => {

      expect(() =>  stringToBytes("kb" as unknown as "1kB")).toThrowError("Invalid value: kb");
    });

    it("should parse KB", () => {
      expect(stringToBytes("1kb")).toBe(Math.pow(1024, 1) * 1);
      expect(stringToBytes("1KB")).toBe(Math.pow(1024, 1) * 1);
      expect(stringToBytes("1Kb")).toBe(Math.pow(1024, 1) * 1);
      expect(stringToBytes("1kB")).toBe(Math.pow(1024, 1) * 1);

      expect(stringToBytes("0.5kb")).toBe(Math.pow(1024, 1) * 0.5);
      expect(stringToBytes("0.5KB")).toBe(Math.pow(1024, 1) * 0.5);
      expect(stringToBytes("0.5Kb")).toBe(Math.pow(1024, 1) * 0.5);
      expect(stringToBytes("0.5kB")).toBe(Math.pow(1024, 1) * 0.5);

      expect(stringToBytes("1.5kb")).toBe(Math.pow(1024, 1) * 1.5);
      expect(stringToBytes("1.5KB")).toBe(Math.pow(1024, 1) * 1.5);
      expect(stringToBytes("1.5Kb")).toBe(Math.pow(1024, 1) * 1.5);
      expect(stringToBytes("1.5kB")).toBe(Math.pow(1024, 1) * 1.5);
    });

    it("should parse MB", () => {
      expect(stringToBytes("1mb")).toBe(Math.pow(1024, 2) * 1);
      expect(stringToBytes("1MB")).toBe(Math.pow(1024, 2) * 1);
      expect(stringToBytes("1Mb")).toBe(Math.pow(1024, 2) * 1);
      expect(stringToBytes("1mB")).toBe(Math.pow(1024, 2) * 1);
    });

    it("should parse GB", () => {
      expect(stringToBytes("1gb")).toBe(Math.pow(1024, 3) * 1);
      expect(stringToBytes("1GB")).toBe(Math.pow(1024, 3) * 1);
      expect(stringToBytes("1Gb")).toBe(Math.pow(1024, 3) * 1);
      expect(stringToBytes("1gB")).toBe(Math.pow(1024, 3) * 1);
    });

    it("should parse TB", () => {
      expect(stringToBytes("1tb")).toBe(Math.pow(1024, 4) * 1);
      expect(stringToBytes("1TB")).toBe(Math.pow(1024, 4) * 1);
      expect(stringToBytes("1Tb")).toBe(Math.pow(1024, 4) * 1);
      expect(stringToBytes("1tB")).toBe(Math.pow(1024, 4) * 1);

      expect(stringToBytes("0.5tb")).toBe(Math.pow(1024, 4) * 0.5);
      expect(stringToBytes("0.5TB")).toBe(Math.pow(1024, 4) * 0.5);
      expect(stringToBytes("0.5Tb")).toBe(Math.pow(1024, 4) * 0.5);
      expect(stringToBytes("0.5tB")).toBe(Math.pow(1024, 4) * 0.5);

      expect(stringToBytes("1.5tb")).toBe(Math.pow(1024, 4) * 1.5);
      expect(stringToBytes("1.5TB")).toBe(Math.pow(1024, 4) * 1.5);
      expect(stringToBytes("1.5Tb")).toBe(Math.pow(1024, 4) * 1.5);
      expect(stringToBytes("1.5tB")).toBe(Math.pow(1024, 4) * 1.5);
    });

    it("should parse PB", () => {
      expect(stringToBytes("1pb")).toBe(Math.pow(1024, 5) * 1);
      expect(stringToBytes("1PB")).toBe(Math.pow(1024, 5) * 1);
      expect(stringToBytes("1Pb")).toBe(Math.pow(1024, 5) * 1);
      expect(stringToBytes("1pB")).toBe(Math.pow(1024, 5) * 1);

      expect(stringToBytes("0.5pb")).toBe(Math.pow(1024, 5) * 0.5);
      expect(stringToBytes("0.5PB")).toBe(Math.pow(1024, 5) * 0.5);
      expect(stringToBytes("0.5Pb")).toBe(Math.pow(1024, 5) * 0.5);
      expect(stringToBytes("0.5pB")).toBe(Math.pow(1024, 5) * 0.5);

      expect(stringToBytes("1.5pb")).toBe(Math.pow(1024, 5) * 1.5);
      expect(stringToBytes("1.5PB")).toBe(Math.pow(1024, 5) * 1.5);
      expect(stringToBytes("1.5Pb")).toBe(Math.pow(1024, 5) * 1.5);
      expect(stringToBytes("1.5pB")).toBe(Math.pow(1024, 5) * 1.5);
    });

    it("should accept negative values", () => {
      expect(stringToBytes("-1b")).toBe(-1);
      expect(stringToBytes("-1024b")).toBe(-1024);

      expect(stringToBytes("-1.5TB")).toBe(-Math.pow(1024, 4) * 1.5);
      expect(stringToBytes("-1.5PB")).toBe(-Math.pow(1024, 5) * 1.5);
    });

    it("should allow whitespace", () => {
      expect(stringToBytes("1 TB")).toBe(Math.pow(1024, 4) * 1);
      expect(stringToBytes("1 pB")).toBe(Math.pow(1024, 5) * 1);
    });
  });
});