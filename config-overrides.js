const { override } = require('customize-cra');
const eslintConfigOverrides = require('customize-cra-eslint');

module.exports = override(eslintConfigOverrides());
