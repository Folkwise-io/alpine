const { Alpine } = require('alpine');

module.exports = Alpine({
  methodsPath: `${__dirname}/methods`,
  testsPath: `${__dirname}/tests`,
});
