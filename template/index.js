const { Alpine } = require('alpine');
const cfg = require('./alpine.conf');

module.exports = Alpine(cfg);
