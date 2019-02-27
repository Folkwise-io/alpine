import { messages } from '../config';
import AlpineMethod from './method';
import AlpineMiddleware from './middleware';

const { DUPLICATE } = messages;

const AlpineLibrary = (config = {}) => {
  const opts = {};

  // Assign project configuration
  Object.assign(opts, config);

  // Destructure important variables
  const { methods = {}, beforeAll: beforeAllMW, afterAll: afterAllMW } = opts;
  const middleware = AlpineMiddleware(beforeAllMW, afterAllMW); // Middleware system

  // Build the library
  const library = {};
  Object.values(methods).forEach((methodDefinition) => {
    if (library[methodDefinition.name]) {
      throw new Error(DUPLICATE(methodDefinition.name));
    }

    // Wrap the AlpineMethod in the configured middleware
    library[methodDefinition.name] = middleware.wrap(AlpineMethod(methodDefinition));
  });

  // Don't include Alpine methods in a built version
  if (opts.build) {
    return library;
  }

  return library;
};

export default AlpineLibrary;
