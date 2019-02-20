require('@babel/register')({ cwd: __dirname });
require('@babel/polyfill/noConflict');

const Alpine = require('./alpine');
const AlpineLib = require('./common');
const Rollup = require('./rollup');

module.exports = {
  ...Alpine,
  AlpineLib,
  AlpineRollupPlugin: Rollup,
};
