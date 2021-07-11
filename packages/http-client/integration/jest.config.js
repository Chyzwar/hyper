
module.exports = {
  globals: {
    "ts-jest": {
      tsconfig: {
        allowJs: true,
      },
    },
  },
  transform: {
    "^.+\\.(js|jsx)?$": "ts-jest",
    "^.+\\.(ts|tsx)?$": "ts-jest",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(int|spec))\\.(ts?|tsx?)$",
  transformIgnorePatterns: ["/node_modules/(?!@hyper).+\\.js$"],
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

