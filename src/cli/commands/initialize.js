import fs from 'fs-extra';
import path from 'path';
import shelljs from 'shelljs';
import prompt from 'prompt';
import {
  bold, green, red, cyan,
} from 'colors';

import { version } from '../../../package.json';
import { PROJECT_TEMPLATE, VARIABLE_REGEX } from '../../common/constants';
import * as utils from '../../common/utils';

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
    }
    if (isDirectory && isEmpty) {
      return true;
    }

    return false;
  } catch (e) {
    console.error(e); // eslint-disable-line
    return false;
  }
}

function projectPrompts(projectName) {
  return new Promise((resolve, reject) => {
    const schema = {
      properties: {
        author: {
          description: 'Project author',
          default: '',
        },
        name: {
          description: 'Project name',
          default: projectName,
          pattern: VARIABLE_REGEX,
          required: true,
        },
        description: {
          description: 'Project description',
          default: 'Alpine CLI Project',
          required: true,
        },
        license: {
          description: 'Project license',
          default: 'UNLICENSED',
          required: true,
        },
        private: {
          description: 'Private project?',
          type: 'boolean',
          default: true,
        },
      },
    };

    prompt.start();
    prompt.message = '';

    prompt.get(schema, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
}

export default async ({ projectName }, { dev }, logger) => {
  logger.info(`${ALPINE_TEXT}`);
  logger.info(bold(cyan(`Creating project ${projectName}`)));
  const dstFolderPath = path.resolve(process.cwd(), projectName);

  if (!useOrCreateEmptyDirectory(dstFolderPath)) {
    const message = `Failed to create directory ${dstFolderPath}`;
    logger.error(`${red(message)}`);
    return;
  }

  // DoT.js templating variables
  const it = {
    options: {
      development: dev,
    },
  };

  try {
    it.project = await projectPrompts(projectName);
  } catch (e) {
    console.error(e); // eslint-disable-line
    logger.error(`${red('Failed to create project. See error above for details.')}`);
    return;
  }

  // Create a safe name and trim the name
  it.project.name = it.project.name.trim();
  it.project.safeName = it.project.name.trim().toLowerCase();

  // Create src and dst paths for files.
  const filepaths = shelljs
    // -A: all files (include files beginning with ., except for . and ..)
    // -R: recursive
    // -l: list objects representing each file, each with fields containing ls -l output fields. See fs.Stats
    .ls('-ARl', PROJECT_TEMPLATE)
    .map(({ name }) => ({
      name,
      srcPath: path.resolve(PROJECT_TEMPLATE, name),
      dstPath: path.resolve(dstFolderPath, name),
    }))
    // ignore non-files
    .filter(({ srcPath }) => fs.lstatSync(srcPath).isFile())
    // sort by name
    .sort(({ name: nameA }, { name: nameB }) => (nameA >= nameB ? 1 : -1));

  // process the templates
  filepaths.forEach(file => Object.assign(file, {
    content: utils.processTemplate(file.srcPath, it),
  }));

  // write the files
  filepaths.forEach(({ name, dstPath, content }) => {
    logger.info(`\t${bold(green('create'))}\t${name}`);
    fs.outputFileSync(dstPath, content, 'utf8');
  });

  logger.log(bold(cyan('Finished!')));
};
