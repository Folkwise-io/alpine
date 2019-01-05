const path = require('path');

const TEMPLATES_PATH = path.resolve(__dirname, '../templates');
const PROJECT_TEMPLATE = path.resolve(TEMPLATES_PATH, 'project');
const METHOD_TEMPLATE = path.resolve(TEMPLATES_PATH, 'method.js');
const TEST_TEMPLATE = path.resolve(TEMPLATES_PATH, 'test.js');

const CONF_FILENAME = 'alpine.conf.js';

module.exports = {
  TEMPLATES_PATH,
  PROJECT_TEMPLATE,
  METHOD_TEMPLATE,
  TEST_TEMPLATE,
  CONF_FILENAME,
};
