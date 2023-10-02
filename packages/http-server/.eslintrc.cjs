
module.exports = {
  extends: "@chyzwar/eslint-config/node.js",
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
  rules: {
    "@typescript-eslint/class-methods-use-this": "off",
    "@typescript-eslint/unbound-method": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
  },
};