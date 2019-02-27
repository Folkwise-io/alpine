import { META } from '../common/constants';
import { simpleErrorHandler } from '../middleware/simpleErrorHandler'; // Default error handler
import AlpineExec from './execution';

// Allows an array of middleware to be applied to an AlpineMethod
const AlpineMiddleware = (beforeAllMW = [], afterAllMW = []) => {
  const middleware = [[...beforeAllMW], [...afterAllMW, simpleErrorHandler]];

  // TODO: Middleware on specific methods (hence beforeAll and afterAll naming)

  return {
    beforeAll: (newMiddleware) => {
      middleware[0] = Array.isArray(newMiddleware)
        ? [...middleware[0], ...newMiddleware]
        : [...middleware[0], newMiddleware];
    },
    afterAll: (newMiddleware) => {
      middleware[1] = Array.isArray(newMiddleware)
        ? [...middleware[1].slice(0, -1), ...newMiddleware, simpleErrorHandler]
        : [...middleware[1].slice(0, -1), newMiddleware, simpleErrorHandler];
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
        executePreMiddleware([...middleware[0]]); // Execute pre-method middleware

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
        executePostMiddleware([...middleware[1]]); // Execute post-method middleware

        return execDetails.result;
      };
    },
  };
};

export default AlpineMiddleware;
