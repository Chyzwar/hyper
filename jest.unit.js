

process.env.NODE_OPTIONS = "--experimental-vm-modules --no-warnings";

export default {
  verbose: false,
  transform: {},
  projects: [
    "<rootDir>/packages/*/jest.config.ts",
  ],
};
