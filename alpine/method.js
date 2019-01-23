const { META } = require('../common/constants');

const testParameter = parameter => (arg) => {
  const { type } = parameter;
  let { validate: validators } = parameter;

  // Check the type
  if (type && typeof arg !== type) {
    throw new Error(`TypeError: [${parameter.name || '<Unknown Method>'}] expected type ${type}`);
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
        throw new Error(`TypeError: [${parameter.name || '<Unknown Method>'}] failed validation`);
      }
    }
  }
};

const AlpineMethod = (methodOptions) => {
  const {
    name, parameters, returns, value,
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
        testParameter(parameter)(args[i]);
      });
    }

    // Execute the function
    const result = value(...args);

    // Validate the result of the function
    if (returns) {
      testParameter(returns)(result);
    }

    return result;
  };
};

module.exports = AlpineMethod;
