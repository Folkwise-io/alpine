import { META, CLI } from '../common/constants';
import { messages } from '../config';

const { INVALID_PARAM_TYPE, INVALID_PARAMETERS, VALIDATION_FAILURE } = messages;

const testParameter = parameter => (arg) => {
  const { type } = parameter;
  let { validate: validators } = parameter;

  // Check the type
  if (type && typeof arg !== type) {
    throw new TypeError(INVALID_PARAM_TYPE(type, typeof arg));
  }

  // Test the value against validators
  if (validators != null) {
    if (typeof validators === 'function') {
      validators = [validators]; // Turn the validator into a list if just a function
    }

    let targetValidator;
    while (validators.length > 0) {
      targetValidator = validators.pop();
      if (!targetValidator(arg)) {
        throw new TypeError(VALIDATION_FAILURE(parameter.name || 'Unknown method'));
      }
    }
  }
};

const AlpineMethod = (methodOptions) => {
  const {
    name, parameters, returns, value,
  } = methodOptions;

  if (!name) {
    throw new TypeError('Missing method name');
  }

  if (!value) {
    throw new TypeError('Missing method value');
  }

  return (...args) => {
    let cliEnvoked = false;

    // If a META symbol is passed, return the meta data of this method
    if (args.length > 0 && args[0] === META) {
      return methodOptions;
    }

    if (args[args.length - 1] === CLI) {
      args = args.slice(0, -1);
      cliEnvoked = true;
    }

    // Validate the parameters that were passed
    if (parameters) {
      const params = Array.isArray(parameters) ? parameters : [parameters];

      if (args.length > params.length || args.length < params.length) {
        throw new TypeError(INVALID_PARAMETERS(params.length, args.length));
      }

      params.forEach((parameter, i) => {
        testParameter(parameter)(args[i]);
      });
    }

    // Execute the function
    const result = value(...args);

    // Validate the result of the function
    if (returns) {
      testParameter(returns)(result);
    }

    // Log the result if the CLI envoked the call
    if (cliEnvoked) {
      console.log(result); // eslint-disable-line
    }

    return result;
  };
};

export default AlpineMethod;
