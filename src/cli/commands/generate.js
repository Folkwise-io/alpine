import { red } from 'colors';
import methodGeneration from './method.generate';

export default async ({ generationType, ...args }, options, logger) => {
  switch (generationType.toLowerCase()) {
    case 'method':
      methodGeneration(args, options, logger);
      break;
    default:
      logger.error(red('Unknown generation type.'));
      process.exit(1);
  }
};
