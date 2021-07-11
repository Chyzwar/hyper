
export default {
  displayName: "utils",
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(ts?|tsx?)$",
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
  globals: {
    "ts-jest": {
      "diagnostics": true,
    },
  },
};

