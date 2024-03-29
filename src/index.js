require('@babel/polyfill/noConflict');

const Alpine = require('./alpine');
const AlpineLib = require('./common');
const Rollup = require('./rollup').default;

module.exports = {
  ...Alpine,
  AlpineLib,
  AlpineRollupPlugin: Rollup,
};
