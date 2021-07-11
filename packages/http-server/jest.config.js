
export default {
  displayName: "http-server",
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  testEnvironment: "node",
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(ts?|tsx?)$",
  extensionsToTreatAsEsm: [".ts"],
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
    "/lib/",
  ],
  modulePathIgnorePatterns: [
    "/examples/",
    "/lib/",
  ],
};

