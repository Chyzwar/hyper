
export default {
  displayName: "@hyper/logger",
  testEnvironment: "node",
  transform: {},
  transformIgnorePatterns: [".*"],
  roots: ["<rootDir>/src/"],
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(js?|jsx?)$",
  setupFiles: ["./jest.setup.js"],
};

