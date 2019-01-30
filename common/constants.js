const TEMPLATES_PATH = `${__dirname}/../templates`;
const PROJECT_TEMPLATE = `${TEMPLATES_PATH}/project`;
const METHOD_TEMPLATE = `${TEMPLATES_PATH}/method.js`;
const TEST_TEMPLATE = `${TEMPLATES_PATH}/test.js`;

const CONF_FILENAME = 'alpine.conf.js';
const PACKAGE_JSON = 'package.json';
const LIBRARY_ROOT = 'index.js';

const META = Symbol('META');

module.exports = {
  TEMPLATES_PATH,
  PROJECT_TEMPLATE,
  METHOD_TEMPLATE,
  TEST_TEMPLATE,
  CONF_FILENAME,
  PACKAGE_JSON,
  LIBRARY_ROOT,
  META,
};
