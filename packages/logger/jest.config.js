
export default {
  displayName: "logger",
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(ts?|tsx?)$",
  setupFiles: ["./jest.setup.js"],
  moduleFileExtensions: [
    "ts",
    "tsx",
    "json",
    "js",
    "jsx",
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/examples/",
    "/tmp/",
  ],
  modulePathIgnorePatterns: [
    "/examples/",
    "/tmp/",
  ],
};

