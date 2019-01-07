const dot = require('dot');
const fs = require('fs');
const path = require('path');
const { PROJECT_TEMPLATE, CONF_FILENAME } = require('./constants');

// disable stripping whitespaces
dot.templateSettings.strip = false;

const utils = {
  readFileAsString: (file, dirname = PROJECT_TEMPLATE) => {
    const filePath = path.resolve(dirname, file);
    return fs.readFileSync(filePath).toString('utf8');
  },
  processTemplate: (file, it, dirname = PROJECT_TEMPLATE) => {
    const srcContent = utils.readFileAsString(file, dirname);
    const tempFn = dot.template(srcContent);
    const dstContent = tempFn(it);
    return dstContent;
  },
  isRoot: (localPath = process.cwd()) => fs.existsSync(`${localPath}/${CONF_FILENAME}`),
  getConfiguration: (localPath = process.cwd()) => {
    if (fs.existsSync(`${localPath}/${CONF_FILENAME}`)) {
      return require(`${localPath}/${CONF_FILENAME}`);
    }
    return null;
  },
};

module.exports = utils;
