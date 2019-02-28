import { messages } from '../config';

const {
  INVALID_PARAMETERS,
  INVALID_PARAM_TYPE,
  VALIDATION_FAILURE,
} = messages;

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

export function validateMethod({ meta }, next) {
  const { name, value } = meta;

  if (!name) {
    return next(new TypeError('Missing method name'));
  }

  if (!value) {
    return next(new TypeError('Missing method value'));
  }

  return next();
}

export function validateArguments({ args, meta }, next) {
  const { parameters } = meta;
  if (!parameters) {
    return next(); // No validation needed if there is no configuration
  }

  const params = Array.isArray(parameters) ? parameters : [parameters];

  if (args.length > params.length || args.length < params.length) {
    return next(new TypeError(INVALID_PARAMETERS(params.length, args.length)));
  }

  for (let i = 0; i < params.length; i += 1) {
    try {
      testParameter(params[i])(args[i]);
    } catch (e) {
      return next(e);
    }
  }

  return next();
}

export function validateReturn({ result, meta }, next) {
  const { returns } = meta;
  if (!returns) {
    return next();
  }

  try {
    testParameter(returns)(result);
  } catch (e) {
    return next(e);
  }

  return next();
}
