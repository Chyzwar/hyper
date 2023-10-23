

process.env.NODE_OPTIONS = "--experimental-vm-modules";

export default {
  verbose: false,
  transform: {},
  projects: [
    "<rootDir>/packages/*/jest.config.js",
    "<rootDir>/packages/*/jest.config.ts",
  ],
};
