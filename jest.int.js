process.env.NODE_OPTIONS = "--experimental-vm-modules";

export default {
  verbose: false,
  maxWorkers: 8,
  projects: [
    "<rootDir>/packages/*/integration/jest.config.ts",
  ],
};