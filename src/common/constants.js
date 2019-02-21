const TEMPLATES_PATH = `${__dirname}/../../templates`;
const PROJECT_TEMPLATE = `${TEMPLATES_PATH}/project`;
const METHOD_TEMPLATE = `${TEMPLATES_PATH}/method.js`;
const TEST_TEMPLATE = `${TEMPLATES_PATH}/test.js`;

const CONF_FILENAME = 'alpine.conf.js';
const PACKAGE_JSON = 'package.json';
const LIBRARY_ROOT = 'index.js';

const VARIABLE_REGEX = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/;

const META = Symbol('META');

export {
  TEMPLATES_PATH,
  PROJECT_TEMPLATE,
  METHOD_TEMPLATE,
  TEST_TEMPLATE,
  CONF_FILENAME,
  PACKAGE_JSON,
  LIBRARY_ROOT,
  VARIABLE_REGEX,
  META,
};
