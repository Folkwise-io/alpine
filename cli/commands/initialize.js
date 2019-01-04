const fs = require('fs-extra');
const path = require('path');
const utils = require('../utils');
const shelljs = require('shelljs');
const { bold, green, red, cyan } = require('colors');
const prompt = require('prompt');

const version = require('../../package.json').version;

const TEMPLATE_PATH = path.resolve(__dirname, '../../template');

const ALPINE_TEXT = `
█████╗ ██╗     ██████╗ ██╗███╗   ██╗███████╗
██╔══██╗██║     ██╔══██╗██║████╗  ██║██╔════╝
███████║██║     ██████╔╝██║██╔██╗ ██║█████╗  
██╔══██║██║     ██╔═══╝ ██║██║╚██╗██║██╔══╝  
██║  ██║███████╗██║     ██║██║ ╚████║███████╗
╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝╚═╝  ╚═══╝╚══════╝
A really cool working title for a CLI framework.

Alpine v${version}
https://github.com/ZeroProjectsInc/alpine

by Zero Projects Inc.
https://zeroprojects.ca
`;

/**
 * This method tries to create an empty directory at a relative path.
 * If no directory exists at the path, it's created & the function returns true.
 * If an empty directory already exists at the path, the function returns true.
 * If a non-empty directory already exists at the path, the function returns false.
 * If an error occurs, the function logs the error and returns false.
 * @param {string} filepath a relative path to the target folder
 * @returns {boolean}
 */
function useOrCreateEmptyDirectory(filepath) {
  try {
    const nodeExists = fs.existsSync(filepath);
    const isDirectory = nodeExists && fs.lstatSync(filepath).isDirectory();
    const isEmpty = isDirectory && fs.readdirSync(filepath).length === 0;

    if (!nodeExists) {
      fs.mkdirSync(filepath);
      return true;
    } else if (isDirectory && isEmpty) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.error(e);
    return false;
  }
}

async function projectPrompts(projectName) {
  return await (new Promise((resolve, reject) => {
    const schema = {
      properties: {
        author: {
          description: 'Project author',
          required: true
        },
        name: {
          description: 'Project name',
          default: projectName,
          required: true
        },
        description: {
          description: 'Project description',
          default: 'Alpine CLI Project',
          required: true
        },
        license: {
          //TODO: validate npmjs-supported licenses
          description: 'Project license',
          default: 'UNLICENSED',
          required: true
        },
        private: {
          description: 'Private project?',
          type: 'boolean',
          default: true
        }
      }
    };

    prompt.start();

    prompt.get(schema, function(err, result) {
      if (err) reject(err);
      resolve(result);
    })
  }));
}

module.exports = async ({ projectName }, options, logger) => {
  console.log(`${ALPINE_TEXT}`);
  console.log(bold(cyan(`Creating project ${projectName}`)));
  const dstFolderPath = path.resolve(process.cwd(), projectName);

  if (!useOrCreateEmptyDirectory(dstFolderPath)) {
    const message = `Failed to create directory ${dstFolderPath}`;
    logger.error(`${red(message)}`);
    return;
  }

  // DoT.js templating variables
  const it = {};

  try {
    it.project = await projectPrompts(projectName);
  } catch (e) {
    console.error(e);
    logger.error(`${red('Failed to create project. See error above for details.')}`);
    return;
  }

  // Create src and dst paths for files.
  const filepaths = shelljs
    // -A: all files (include files beginning with ., except for . and ..)
    // -R: recursive
    // -l: list objects representing each file, each with fields containing ls -l output fields. See fs.Stats
    .ls('-ARl', TEMPLATE_PATH)
    .map(({name}) => ({
      name,
      srcPath: path.resolve(TEMPLATE_PATH, name),
      dstPath: path.resolve(dstFolderPath, name)
    }))
    // ignore non-files
    .filter(({srcPath}) => fs.lstatSync(srcPath).isFile())
    // sort by name
    .sort(({name: nameA}, {name: nameB}) => nameA >= nameB ? 1 : -1);

  // process the templates
  filepaths.forEach(file => {
    file.content = utils.processTemplate(file.srcPath, it);
  });

  // write the files
  filepaths.forEach(({name, dstPath, content}) => {
    console.log(`\t${bold(green('create'))}\t${name}`);
    fs.outputFileSync(dstPath, content, 'utf8');
  });

  console.log(bold(cyan('Finished!')));
}

