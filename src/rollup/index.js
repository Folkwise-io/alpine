/**
 * rollup-plugin-alpine
 *
 * A Rollup plugin that is used by alpine to replace the dynamic hook
 * with one that explicitly requires each method.
 */

const fs = require('fs-extra');
const { processTemplate, getProjectRootSync } = require('../common/utils');
const { CONF_FILENAME } = require('../common/constants');

const getMethodName = filename => filename.split('.')[0];

module.exports = () => {
  const projectDir = getProjectRootSync();

  // Check to see if project configuration exists
  if (!fs.existsSync(`${projectDir}/${CONF_FILENAME}`)) {
    throw new Error('Could not find the Alpine configuration.');
  }

  // Require the project configuration
  const alpineConfig = require(`${projectDir}/${CONF_FILENAME}`);
  let { methodsPath } = alpineConfig;
  if (!methodsPath) {
    methodsPath = 'methods'; // Default the methods path to <root>/methods
  }

  // Read the methods directory
  const files = fs.readdirSync(methodsPath);
  const targetFileType = '.js';
  const methodFiles = files.filter((filename) => {
    const endOfName = filename.length - targetFileType.length;
    return filename.indexOf(targetFileType) === endOfName;
  });

  // Build the import strings
  const methodImports = [];
  methodFiles.forEach((filename) => {
    const name = getMethodName(filename);
    methodImports.push(`import ${name} from '${methodsPath}/${filename}';`);
  });

  // Build the methods array
  let methodsString = '[';
  methodFiles.forEach((filename) => {
    const name = getMethodName(filename);
    methodsString += `${name},`;
  });
  if (methodsString.length > 1) {
    methodsString = methodsString.substring(0, methodsString.length - 1);
  }
  methodsString += ']';

  // Template data
  const it = {
    project: {
      imports: methodImports,
      methods: methodsString,
    },
  };

  // Construct the index file
  const indexContent = processTemplate('template.dot.js', it, __dirname);

  return {
    name: 'alpine',
    transform(code, id) {
      if (id.indexOf('index.js') >= 0 && id.indexOf('node_modules') < 0) {
        // Hook file of the project, replace with the constructed code
        return indexContent;
      }
      return code;
    },
  };
};
