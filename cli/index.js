#!/usr/bin/env node
const prog = require('caporal');

const { version } = require('../package.json');

const initializeCmd = require('./commands/initialize');
const generateCmd = require('./commands/generate');

prog
  .version(version)

  // Create <new> command
  .command('new', 'Create a new Alpine project')
  .argument('<projectName>', 'Name of the project')
  .action(initializeCmd)

  // Generate <generate> command
  .command('generate', 'Generate a new component of the project')
  .argument('<generationType>', 'Type of component')
  .action(generateCmd);

prog.parse(process.argv);
