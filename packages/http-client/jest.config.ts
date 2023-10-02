import type {Config} from 'jest';

const config: Config = {
  displayName: "@hyper/http-client",
  testEnvironment: "jsdom",
  transform: {},
  roots: ["<rootDir>/src/"],
};

export default config