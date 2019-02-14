import prog from 'caporal';
import { version } from '../package.json';

import initializeCmd from './commands/initialize';
import generateCmd from './commands/generate';

prog
  .version(version)

  // Create <new> command
  .command('new', 'Create a new Alpine project')
  .argument('<projectName>', 'Name of the project')
  .option('-y, --default', 'Choose the default for each prompt.')
  .action(initializeCmd)

  // Generate <generate> command
  .command('generate', 'Generate a new component of the project')
  .argument('<generationType>', 'Type of component')
  .action(generateCmd);

prog.parse(process.argv);
