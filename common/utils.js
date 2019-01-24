const dot = require('dot');
const fs = require('fs');
const path = require('path');
const pkgUp = require('pkg-up');
const {
  PROJECT_TEMPLATE, CONF_FILENAME, PACKAGE_JSON, LIBRARY_ROOT,
} = require('./constants');

// disable stripping whitespaces
dot.templateSettings.strip = false;

// Will get the root of the running script
function getRoot() {
  return path.dirname(require.main.filename);
}

// Will get the root of the current project directory
async function getProjectRoot() {
  const projectRoot = await pkgUp();
  if (!projectRoot) {
    throw new Error('Could not find the project root.');
  }

  const projectPackageJson = require(projectRoot);
  const projectDependencies = Object.keys(projectPackageJson.dependencies || {});
  const alpineDependency = projectDependencies.find(dependency => dependency === 'alpine');
  if (!alpineDependency) {
    throw new Error('Could not find an Alpine project root.');
  }

  return path.dirname(projectRoot);
}

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
  getRoot,
  getProjectRoot,
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
      default:
        return val;
    }
  },
};

module.exports = utils;
