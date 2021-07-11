
module.exports = {
  extends: "@hyper/eslint-config/node",
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
  rules: {
    "@typescript-eslint/no-magic-numbers": "off",
  },
};