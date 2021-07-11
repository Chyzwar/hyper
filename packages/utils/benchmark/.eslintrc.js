
module.exports = {
  extends: "@hyper/eslint-config/node",
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
  rules: {
    "no-console": "off",
    "@typescript-eslint/typedef": "off",
    "@typescript-eslint/no-invalid-this": "off",
    "@typescript-eslint/prefer-for-of": "off",
    "@typescript-eslint/restrict-plus-operands": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
  },
};