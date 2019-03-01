import { META } from '../common/constants';
import AlpineExec from './execution';

// Internal middleware
import { errorHandler } from '../middleware/errorHandler'; // Default error handler
import { executeMethod } from '../middleware/executeMethod';
import { cliLogger } from '../middleware/cliLogger';
import { validateMethod, validateArguments, validateReturn } from '../middleware/validate';

const DEFAULT_ERR_HANDLER = errorHandler;

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

  // Append pre-execution middleware
  const beforeAll = (newMiddleware) => {
    middleware[0] = appendMiddleware(middleware[0], newMiddleware);
  };

  // Append post-execution middleware
  const afterAll = (newMiddleware) => {
    middleware[1] = appendMiddleware(middleware[0], newMiddleware);
  };

  // Wrap the configured middleware around a method
  const wrap = (method) => {
    const methodDefinition = method(META);

    // Intercept the method call
    return (...args) => {
      if (args.length > 0 && args[0] === META) {
        return methodDefinition; // Return meta data if META symbol passed (don't execute)
      }

      // Save the execution details so they can be passed to middleware
      const execDetails = AlpineExec(args, method);

      // Flatten user middleware and construct the middleware chain
      const mwChain = [
        validateMethod,
        ...middleware[0],
        validateArguments,
        executeMethod,
        validateReturn,
        ...middleware[1],
        cliLogger,
      ];

      // If there is no configured error handler, add a default one
      const hasErrorHandler = mwChain.find(mw => mw.length > 2);
      if (!hasErrorHandler) {
        mwChain.push(DEFAULT_ERR_HANDLER);
      }

      // Execute the method with the middleware
      executeMiddlewareChain(execDetails, mwChain);

      return execDetails.result;
    };
  };

  return {
    beforeAll,
    afterAll,
    wrap,
  };
};

export default AlpineMiddleware;
