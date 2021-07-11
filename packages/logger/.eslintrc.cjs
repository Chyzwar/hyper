
module.exports = {
  extends: "@hyper/eslint-config/node",
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
  rules: {
    "no-console": "off",
  },
};