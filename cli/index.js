#!/usr/bin/env node
const prog = require('caporal');

const { version } = require('../package.json');

const initializeCmd = require('./commands/initialize');

prog
  .version(version)

  // Create <new> command
  .command('new', 'Create a new Alpine project')
  .argument('<projectName>', 'Name of the project')
  .action(initializeCmd);

prog.parse(process.argv);
