import AlpineMethod from './method';
import AlpineMiddleware from './middleware';
import { messages } from '../config';

const { DUPLICATE } = messages;

const AlpineLibrary = (config = {}) => {
  const opts = {};

  // Assign project configuration
  Object.assign(opts, config);

  // Destructure important variables
  const { methods, middleware } = opts;
  const mwWrapper = AlpineMiddleware(middleware); // Used to wrap middleware on methods

  // Build the library
  const library = {};
  Object.values(methods).forEach((methodDefinition) => {
    if (library[methodDefinition.name]) {
      throw new Error(DUPLICATE(methodDefinition.name));
    }

    library[methodDefinition.name] = mwWrapper.wrap(AlpineMethod(methodDefinition));
  });

  // Alpine methods
  const beforeAll = mw => mwWrapper.beforeAll(mw);
  const afterAll = mw => mwWrapper.afterAll(mw);
  const init = () => new Promise(resolve => resolve(library));

  return {
    ...library,
    beforeAll: AlpineMethod({ cli: false, value: beforeAll }, true),
    afterAll: AlpineMethod({ cli: false, value: afterAll }, true),
    init: AlpineMethod({ cli: false, value: init }, true),
  };
};

export default AlpineLibrary;
