module.exports = {
  root: true,
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  parser: 'babel-eslint',
  'parserOptions': {
    'ecmaVersion': 7,
    'sourceType': 'module',
    'ecmaFeatures': {}
  },
  extends: [
    'standard'
  ],
  plugins: [
    'babel',
    'html'
  ],
  env: {
    'browser': true,
    'es6': true,
    'node': true
  },
  globals: {
    'location': false
  },
  // add your custom rules here
  rules: {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    'camelcase': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
