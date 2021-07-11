
module.exports = {
  extends: "@hyper/eslint-config",
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
  rules: {
    "@typescript-eslint/no-magic-numbers": "off",
  },
};