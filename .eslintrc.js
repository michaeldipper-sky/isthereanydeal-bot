module.exports = {
  env: {
    es6: true,
    node: true
  },
  extends: ["airbnb-base"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },
  rules: {},
  plugins: ["jest"],
  overrides: [
    {
      "files": ["*.test.js", "jest.config.js"],
      "rules": {
        "max-len": "off",
        "no-undef": "off"
      }
    }
  ]
};