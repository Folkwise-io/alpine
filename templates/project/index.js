require('@babel/register')({ cwd: __dirname });
require('@babel/polyfill');

const { Alpine } = require('alpine');

module.exports = Alpine();
