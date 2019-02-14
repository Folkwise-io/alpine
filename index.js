require('@babel/register')({ cwd: __dirname });
require('@babel/polyfill');

const Alpine = require('./alpine');
const AlpineLib = require('./common');

module.exports = {
  ...Alpine,
  AlpineLib,
};
