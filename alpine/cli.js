const prog = require('caporal');
const { META } = require('../common/constants');
const {
  cast, getPackage, getLibrary,
} = require('../common/utils');

const configure = cli => (method = null) => {
  const { name, description, parameters } = method(META);

  // Construct the command using the name and description
  cli = cli.command(name, description || '');

  // Construct the arguments of the command using the parameters (all are required)
  parameters.forEach((param) => {
    cli = cli.argument(`<${param.name}>`, param.description || '');
  });

  // Define the action of the command to be the target method
  cli = cli.action((args) => {
    const argv = Object.values(args).map((arg, i) => cast(arg, parameters[i].type || 'string'));
    method(...argv);
  });

  return cli;
};

const Cli = (executedCommand = process.argv[2]) => {
  // Get project package.json
  const projectPackageJson = getPackage();

  // Get project library
  const projectLibrary = getLibrary();

  // Initialize the CLI
  let cmds = prog.version(projectPackageJson.version || '0.0.1');

  const cliCommands = Object.keys(projectLibrary).reduce((allCommands, key) => {
    const method = projectLibrary[key];
    const { cli } = method(META);

    if (cli !== false) {
      return {
        ...allCommands,
        [key]: method,
      };
    }

    return allCommands;
  }, {});

  // Seek CLI methods in library
  const foundCommand = Object.keys(cliCommands).find((key) => {
    const method = cliCommands[key];
    const { cli } = method(META);

    const command = cli && cli.command ? cli.command : key.toLowerCase();
    if (command === executedCommand) {
      return true;
    }

    return false;
  });

  // Configure the CLI with the found or all commands
  if (foundCommand) {
    cmds = configure(cmds)(cliCommands[foundCommand]);
  } else {
    const configureCmds = configure(cmds);
    Object.values(cliCommands).forEach((method) => {
      cmds = configureCmds(method);
    });
  }

  prog.parse(process.argv);
};

module.exports = Cli;
