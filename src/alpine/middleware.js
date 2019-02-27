import { META } from '../common/constants';
import { simpleErrorHandler } from '../middleware/simpleErrorHandler'; // Default error handler
import AlpineExec from './execution';

const DEFAULT_ERR_HANDLER = simpleErrorHandler;

// Append middleware
function appendMiddleware(middleware, newMiddleware) {
  return Array.isArray(newMiddleware)
    ? [...middleware, ...newMiddleware]
    : [...middleware, newMiddleware];
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

        // Pre-method middleware
        const executePreMiddleware = (remainingMw, ...lastArgs) => {
          const err = lastArgs.find(arg => arg instanceof Error);
          if (err) {
            execDetails.errors.push(err); // Store the error and avoid more pre-method middleware
            return;
          }

          if (!remainingMw || !remainingMw.length) {
            execDetails.result = method(...execDetails.args);
            return;
          }

          // Get the next middleware
          const currentMw = remainingMw.shift();

          // Execute the current middleware
          currentMw(execDetails, (...nextArgs) => {
            executePreMiddleware(remainingMw, ...nextArgs);
          });
        };

        // Post-method middleware
        const executePostMiddleware = (remainingMw, ...lastArgs) => {
          const err = lastArgs.find(arg => arg instanceof Error);
          if (err) {
            execDetails.errors.push(err); // Store the error
          }

          if (!remainingMw || !remainingMw.length) {
            return;
          }

          // Get the next middleware
          const currentMw = remainingMw.shift();

          // Execute error handling middleware
          if (currentMw.length > 2 && execDetails.errors.length) {
            currentMw(execDetails.errors[0], execDetails, (...nextArgs) => {
              executePostMiddleware(remainingMw, ...nextArgs);
            });
            return;
          }

          // Execute normal middleware
          if (currentMw.length === 2) {
            currentMw(execDetails, (...nextArgs) => {
              executePostMiddleware(remainingMw, ...nextArgs);
            });
            return;
          }

          executePostMiddleware(remainingMw);
        };

        const finalMW = {
          beforeAll: [...middleware[0]],
          afterAll: [...middleware[1]],
        };

        // If there is no configured error handler, add a default one
        const hasErrorHandler = finalMW.afterAll.find(mw => mw.length > 2);
        if (!hasErrorHandler) {
          finalMW.afterAll = appendMiddleware(finalMW.afterAll, DEFAULT_ERR_HANDLER);
        }

        // Execute middleware and method
        executePreMiddleware([...finalMW.beforeAll]);
        executePostMiddleware([...finalMW.afterAll]);

        return execDetails.result;
      };
    },
  };
};

export default AlpineMiddleware;
