import { META } from '../common/constants';
import { simpleErrorHandler } from '../middleware/simpleErrorHandler'; // Default error handler
import { executeMethod } from '../middleware/executeMethod';
import AlpineExec from './execution';

const DEFAULT_ERR_HANDLER = simpleErrorHandler;

// Append middleware
function appendMiddleware(middleware, newMiddleware) {
  return Array.isArray(newMiddleware)
    ? [...middleware, ...newMiddleware]
    : [...middleware, newMiddleware];
}

// Execute the chain of middleware (expects a 1D array)
function executeMiddlewareChain(execDetails, mwChain = []) {
  const execute = (remainingMw, ...lastArgs) => {
    if (!remainingMw || !remainingMw.length) {
      return; // Base case
    }

    // Get the current middleware
    const currentMw = remainingMw.shift();

    // Store errors from the last middleware
    const err = lastArgs.find(arg => arg instanceof Error);
    if (err) {
      execDetails.errors.push(err);
    }

    // Error handling middleware
    if (currentMw.length > 2 && execDetails.errors.length) {
      currentMw(execDetails.errors[0], execDetails, (...nextArgs) => {
        execute(remainingMw, ...nextArgs);
      });
      return;
    }

    // Normal middleware
    if (currentMw.length === 2) {
      currentMw(execDetails, (...nextArgs) => {
        execute(remainingMw, ...nextArgs);
      });
      return;
    }

    // Skip this middleware
    execute(remainingMw);
  };
  execute(mwChain);
}

// Allows an array of middleware to be applied to an AlpineMethod
const AlpineMiddleware = (beforeAllMW = [], afterAllMW = []) => {
  const middleware = [[...beforeAllMW], [...afterAllMW]];

  // TODO: Middleware on specific methods (hence beforeAll and afterAll naming)

  return {
    beforeAll: (newMiddleware) => {
      middleware[0] = appendMiddleware(middleware[0], newMiddleware);
    },
    afterAll: (newMiddleware) => {
      middleware[1] = appendMiddleware(middleware[0], newMiddleware);
    },
    wrap: (method) => {
      const methodDefinition = method(META);

      // Intercept the method call
      return (...args) => {
        // If a META symbol is passed, return the meta data of this method
        if (args.length > 0 && args[0] === META) {
          return methodDefinition;
        }

        // Save the execution details so they can be passed to middleware
        const execDetails = AlpineExec(args, method);

        // Flatten middleware and construct the middleware chain
        const mwChain = [...middleware[0], executeMethod, ...middleware[1]];

        // If there is no configured error handler, add a default one
        const hasErrorHandler = mwChain.find(mw => mw.length > 2);
        if (!hasErrorHandler) {
          mwChain.push(DEFAULT_ERR_HANDLER);
        }

        // Execute the method with the middleware
        executeMiddlewareChain(execDetails, mwChain);

        return execDetails.result;
      };
    },
  };
};

export default AlpineMiddleware;
