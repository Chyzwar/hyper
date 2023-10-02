import type {Config} from "jest";

const config: Config = {
  testRegex: "(/__tests__/.*|(\\.|/)(int|spec))\\.(ts?|tsx?)$",
  transformIgnorePatterns: ["/node_modules/(?!@hyper).+\\.js$"],
};

export default config;