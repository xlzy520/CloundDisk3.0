// https://eslint.org/docs/user-guide/configuring
// const rules = require('./eslint/rules');
module.exports = {
  root: true,
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    browser: true,
    // mocha: true,
    es6: true,
    node: true,
    amd: true,
    // jasmine: false
  },
  globals: {
    describe: false,
    it: false,
    afterEach:false
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    // 'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'eslint:recommended',
    'djcps'
  ],
  // required to lint *.vue files
  plugins: [
    "html",
    "import",
    "json",
    "node",
    "promise",
    "vue"
  ],
  // add your custom rules here
  rules: {
    'radix': 0,
    'comma-dangle': 0
  }
};
