require('@babel/register')({ ignore: [] });
require('@babel/polyfill');

const { Alpine } = require('alpine');

module.exports = Alpine();
