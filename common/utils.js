const dot = require('dot');
const fs = require('fs');
const path = require('path');
const {
  PROJECT_TEMPLATE, CONF_FILENAME, PACKAGE_JSON, LIBRARY_ROOT,
} = require('./constants');

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
  getLibrary: (localPath = process.cwd()) => {
    if (fs.existsSync(`${localPath}/${LIBRARY_ROOT}`)) {
      return require(`${localPath}/${LIBRARY_ROOT}`);
    }
    return null;
  },
  getPackage: (localPath = process.cwd()) => {
    if (fs.existsSync(`${localPath}/${PACKAGE_JSON}`)) {
      return require(`${localPath}/${PACKAGE_JSON}`);
    }
    return null;
  },
  getConfiguration: (localPath = process.cwd()) => {
    if (fs.existsSync(`${localPath}/${CONF_FILENAME}`)) {
      return require(`${localPath}/${CONF_FILENAME}`);
    }
    return null;
  },
  cast: (val, type) => {
    switch (type.toLowerCase()) {
      case 'number':
        return Number.parseFloat(val);
      case 'string':
        return `${val}`;
      case 'boolean':
        return val.toLowerCase() === 'true';
      default:
        return val;
    }
  },
};

module.exports = utils;
