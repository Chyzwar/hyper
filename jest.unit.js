
export default {
  verbose: false,
  maxWorkers: 8,
  projects: [
    "<rootDir>/packages/*/jest.config.js",
  ],
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
};
