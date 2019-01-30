const dot = require('dot');
const fs = require('fs');
const path = require('path');
const pkgUp = require('pkg-up');
const { messages } = require('../config');
const {
  PROJECT_TEMPLATE, CONF_FILENAME, PACKAGE_JSON, LIBRARY_ROOT,
} = require('./constants');

const {
  MISSING_PROJECT_ROOT, MISSING_ALPINE_ROOT, INVALID_TYPE, UNSUPPORTED_TYPE,
} = messages;

// disable stripping whitespaces
dot.templateSettings.strip = false;

// Will get the root of the running script
function getRoot() {
  let currentScript = require.main.filename;
  if (currentScript.indexOf('node_modules') >= 0) {
    [currentScript] = currentScript.split('/node_modules');
  } else {
    currentScript = path.dirname(currentScript);
  }
  return currentScript;
}

// Will get the root of the current project directory
async function getProjectRoot() {
  const projectRoot = await pkgUp();
  if (!projectRoot) {
    throw new Error(MISSING_PROJECT_ROOT());
  }

  const projectPackageJson = require(projectRoot);
  const projectDependencies = Object.keys(projectPackageJson.dependencies || {});
  const alpineDependency = projectDependencies.find(dependency => dependency === 'alpine');
  if (!alpineDependency) {
    throw new Error(MISSING_ALPINE_ROOT());
  }

  return path.dirname(projectRoot);
}

// Synchronous version of `getProjectRoot`
function getProjectRootSync() {
  const projectRoot = pkgUp.sync();
  if (!projectRoot) {
    throw new Error(MISSING_PROJECT_ROOT());
  }

  const projectPackageJson = require(projectRoot);
  const projectDependencies = Object.keys(projectPackageJson.dependencies || {});
  const alpineDependency = projectDependencies.find(dependency => dependency === 'alpine');
  if (!alpineDependency) {
    throw new Error(MISSING_ALPINE_ROOT());
  }

  return path.dirname(projectRoot);
}

const utils = {
  getRoot,
  getProjectRoot,
  getProjectRootSync,
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
  getLibrary: (localPath = getRoot()) => {
    if (fs.existsSync(`${localPath}/${LIBRARY_ROOT}`)) {
      return require(`${localPath}/${LIBRARY_ROOT}`);
    }
    return null;
  },
  getPackage: (localPath = getRoot()) => {
    if (fs.existsSync(`${localPath}/${PACKAGE_JSON}`)) {
      return require(`${localPath}/${PACKAGE_JSON}`);
    }
    return null;
  },
  getConfiguration: (localPath = getRoot()) => {
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
      case 'object':
        throw new TypeError(UNSUPPORTED_TYPE(type));
      default:
        throw new TypeError(INVALID_TYPE(type));
    }
  },
  env: (prod, dev) => (process.env.NODE_ENV === 'production' ? prod : dev),
};

module.exports = utils;
