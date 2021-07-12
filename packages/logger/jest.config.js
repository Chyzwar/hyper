
export default {
  displayName: "@hyper/logger",
  testEnvironment: "jsdom",
  transform: {},
  roots: ["<rootDir>/lib/"],
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(js?|jsx?)$",
  setupFiles: ["./jest.setup.js"],
};

