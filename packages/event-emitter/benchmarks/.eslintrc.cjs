
module.exports = {
  extends: "@chyzwar/eslint-config/node",
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
  rules: {
    "no-console": "off",
    "@typescript-eslint/typedef": "off",
    "@typescript-eslint/no-invalid-this": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-magic-numbers": "off",
  },
};