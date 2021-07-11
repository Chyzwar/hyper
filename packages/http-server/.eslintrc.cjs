
module.exports = {
  extends: "@hyper/eslint-config",
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
  rules: {
    "@typescript-eslint/unbound-method": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
  },
};