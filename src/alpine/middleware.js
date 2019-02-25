import { META } from '../common/constants';
import { simpleErrorHandler } from '../middleware/simpleErrorHandler'; // Default error handler

// Allows an array of middleware to be applied to an AlpineMethod
const AlpineMiddleware = (fns = []) => {
  const middleware = [[...fns], [simpleErrorHandler]];

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

        // Default result
        let result; // TODO: Allow this to be configurable

        // Store errors that occur
        const errors = [];

        // Pre-method middleware
        const executePreMiddleware = (remainingMw, ...lastArgs) => {
          const err = lastArgs.find(arg => arg instanceof Error);
          if (err) {
            errors.push(err); // Store the error and avoid more pre-method middleware
            return;
          }

          if (!remainingMw || !remainingMw.length) {
            result = method(...args);
            return;
          }

          // Get the next middleware
          const currentMw = remainingMw.shift();

          // Execute the current middleware
          currentMw(args, methodDefinition, (...nextArgs) => {
            executePreMiddleware(remainingMw, ...nextArgs);
          });
        };
        executePreMiddleware([...middleware[0]]); // Execute pre-method middleware

        // Post-method middleware
        const executePostMiddleware = (remainingMw, ...lastArgs) => {
          const err = lastArgs.find(arg => arg instanceof Error);
          if (err) {
            errors.push(err); // Store the error
          }

          if (!remainingMw || !remainingMw.length) {
            return;
          }

          // Get the next middleware
          const currentMw = remainingMw.shift();

          // Skip current if an error has already occurred
          if (errors.length) {
            executePostMiddleware(remainingMw);
            return;
          }

          // Execute the current middleware
          currentMw(result, args, methodDefinition, (...nextArgs) => {
            executePostMiddleware(remainingMw, ...nextArgs);
          });
        };
        executePostMiddleware([...middleware[1]]); // Execute post-method middleware

        return result;
      };
    },
  };
};

export default AlpineMiddleware;
