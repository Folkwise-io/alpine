require('@babel/register')({ cwd: __dirname, ignore: [] });
require('@babel/polyfill');

const { Alpine } = require('alpine');

module.exports = Alpine();
