#!/usr/bin/env node
const { META } = require('alpine');
const { cast } = require('./utils');
const prog = require('caporal');

const { version } = require('../package.json');
const library = require('../');

let cmds = prog.version(version);

// The executed command will be the 3rd element of the argv
const executedCommand = process.argv[2];

// Will configure the CLI to the executed method
const configure = cli => (method = null) => {
  const { name, description, parameters } = method(META);

  // Construct the command using the name and description
  cli = cli.command(name, description || '');

  // Construct the arguments of the command using the parameters (all are required)
  parameters.forEach(({ name, description }) => {
    cli = cli.argument(`<${name}>`, description || '');
  });

  // Define the action of the command to be the target method
  cli = cli.action((args, options, logger) => {
    const argv = Object.values(args).map((arg, i) => cast(arg, parameters[i].type || 'string'));
    method(...argv);
  });

  return cli;
};

// Seek CLI methods in the library
let foundCommand = false;
Object.keys(library).forEach(key => {
  const method = library[key];
  const methodMeta = method(META);

  // Check if the method has CLI configuration
  const { cli } = methodMeta;
  if (!cli) {
    return; // Skip the method if no CLI configuration was found
  }

  const command = cli.command || key.toLowerCase();

  // Check if the executed command is the current method
  if (executedCommand === command) {
    foundCommand = true;
    cmds = configure(cmds)(method); // Configure the CLI to only have the executed command's method
  }
});

// If a command was not found, append all the commands for help dialog
if (!foundCommand) {
  Object.keys(library).forEach(key => {
    const method = library[key];
    const { cli } = method(META);

    if (!cli) {
      return; // Skip the method if no CLI configuration was found
    }

    cmds = configure(cmds)(method);
  });
}

prog.parse(process.argv);
