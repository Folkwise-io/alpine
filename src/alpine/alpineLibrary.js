import AlpineMethod from './method';
import { messages } from '../config';

const { DUPLICATE } = messages;

const AlpineLibrary = (config = {}) => {
  const opts = {};

  // Assign project configuration
  Object.assign(opts, config);

  // Build the library
  const library = {};
  Object.values(opts.methods).forEach((methodDefinition) => {
    if (library[methodDefinition.name]) {
      throw new Error(DUPLICATE(methodDefinition.name));
    }

    library[methodDefinition.name] = AlpineMethod(methodDefinition);
  });

  return library;
};

export default AlpineLibrary;
