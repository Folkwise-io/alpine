import dot from 'dot';
import fs from 'fs';
import path from 'path';
import pkgUp from 'pkg-up';
import { messages } from '../config';
import {
  PROJECT_TEMPLATE, CONF_FILENAME, PACKAGE_JSON, LIBRARY_ROOT,
} from './constants';

const {
  MISSING_PROJECT_ROOT, MISSING_ALPINE_ROOT, INVALID_TYPE, UNSUPPORTED_TYPE,
} = messages;

// disable stripping whitespaces
dot.templateSettings.strip = false;

// Will get the root of the running script
export function getRoot() {
  let currentScript = require.main.filename;
  if (currentScript.indexOf('node_modules') >= 0) {
    [currentScript] = currentScript.split('/node_modules');
  } else {
    currentScript = path.dirname(currentScript);
  }
  return currentScript;
}

// Will get the root of the current project directory
export async function getProjectRoot() {
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
export function getProjectRootSync() {
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

export function importDir(path) {
  if (!fs.existsSync(path)) {
    throw new Error(`Path ${path} does not exist.`);
  }
  
  return new Promise((resolve, reject) => {
    fs.readdir(path, async (err, files) => {
      if (err) {
        return reject(err);
      }

      const jsFiles = files.filter((filename) => {
        return filename.indexOf('.js') === filename.length - '.js'.length;
      });

      let modules = [];
      try {
        modules = await Promise.all(jsFiles.map(file => import(`${path}/${file}`)));
      } catch (e) {
        return reject(e);
      }

      return resolve(modules);
    });
  });
}

export function readFileAsString(file, dirname = PROJECT_TEMPLATE) {
  const filePath = path.resolve(dirname, file);
  return fs.readFileSync(filePath).toString('utf8');
}

export function processTemplate(file, it, dirname = PROJECT_TEMPLATE) {
  const srcContent = readFileAsString(file, dirname);
  const tempFn = dot.template(srcContent);
  const dstContent = tempFn(it);
  return dstContent;
}

export async function getLibrary(localPath = getRoot()) {
  if (fs.existsSync(`${localPath}/${LIBRARY_ROOT}`)) {
    return await import(`${localPath}/${LIBRARY_ROOT}`);
  }
  return null;
}

export async function getPackage(localPath = getRoot()) {
  if (fs.existsSync(`${localPath}/${PACKAGE_JSON}`)) {
    return await import(`${localPath}/${PACKAGE_JSON}`);
  }
  return null;
}

export async function getConfiguration(localPath = getRoot()) {
  if (fs.existsSync(`${localPath}/${CONF_FILENAME}`)) {
    return await import(`${localPath}/${CONF_FILENAME}`);
  }
  return null;
}

export function cast(val, type) {
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
}

export function env(prod, dev) {
  return process.env.NODE_ENV === 'production' ? prod : dev;
};
