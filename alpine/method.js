const v8n = require('v8n');
const { META } = require('../common/constants');

const AlpineMethod = (methodOptions) => {
  const {
    name, parameters, returnValidation, value,
  } = methodOptions;

  if (!name) {
    throw new Error('Missing method name');
  }

  if (!value) {
    throw new Error('Missing method value');
  }

  return (...args) => {
    // If a META symbol is passed, return the meta data of this method
    if (args.length > 0 && args[0] === META) {
      return methodOptions;
    }

    // Validate the parameters that were passed
    if (parameters) {
      let params = parameters;
      if (!Array.isArray(params)) {
        params = [params];
      }

      if (args.length > params.length) {
        throw new Error('Unexpected parameter');
      }

      if (args.length < params.length) {
        throw new Error('Missing parameters');
      }

      params.forEach((parameter, i) => {
        if (parameter.validate != null) {
          const validator = parameter.validate(v8n());
          if (!validator.test(args[i])) {
            throw new Error(`Invalid parameter: [${parameter.name || '<Unknown Method>'}]`);
          }
        }
      });
    }

    // Execute the function
    const result = value(...args);

    // Validate the result of the function
    if (returnValidation) {
      const validator = returnValidation(v8n());
      if (!validator.test(result)) {
        throw new Error('Invalid return type');
      }
    }

    return result;
  };
};

module.exports = AlpineMethod;
