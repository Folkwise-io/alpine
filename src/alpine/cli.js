import prog from 'caporal';
import { META } from '../common/constants';
import { messages } from '../config';
import {
  cast, getPackage, getLibrary, env,
} from '../common/utils';

const { MISSING_DESCRIPTION, MISSING_VERSION } = messages;

const configure = cli => (method) => {
  const { name, description, parameters } = method(META);

  // Construct the command using the name and description
  cli = cli.command(name, description || env('', MISSING_DESCRIPTION()));

  // Construct the arguments of the command using the parameters (all are required)
  parameters.forEach((param) => {
    cli = cli.argument(`<${param.name}>`, param.description || env('', MISSING_DESCRIPTION()));
  });

  // Define the action of the command to be the target method
  cli = cli.action((args) => {
    // Will throw if an invalid/unsupported type is mapped
    const argv = Object.values(args).map((arg, i) => cast(arg, parameters[i].type));
    method(...argv);
  });

  return cli;
};

const Cli = async (executedCommand = process.argv[2]) => {
  // Get project package.json
  const projectPackageJson = await getPackage();

  // Get project library
  const projectLibrary = await getLibrary();

  // Initialize the CLI
  let cmds = prog.version(projectPackageJson.version || env('0.0.1', MISSING_VERSION()));

  const cliCommands = Object.keys(projectLibrary).reduce((allCommands, key) => {
    const method = projectLibrary[key];
    const { cli } = method(META);

    if (cli === false) {
      return allCommands;
    }

    return {
      ...allCommands,
      [key]: method,
    };
  }, {});

  // Seek CLI methods in library
  const foundCommand = Object.keys(cliCommands).find((key) => {
    const method = cliCommands[key];
    const { cli } = method(META);

    const command = (cli && cli.command) || key.toLowerCase();

    // Returns true if the executed command is found
    return command === executedCommand;
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

export default Cli;
