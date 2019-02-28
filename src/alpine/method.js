import { META } from '../common/constants';

const AlpineMethod = (methodOptions = {}) => (...args) => {
  const { value } = methodOptions;

  // Return method meta data when META symbol is passed
  if (args.length > 0 && args[0] === META) {
    return methodOptions;
  }

  // Execute the function
  const result = value(...args);

  return result;
};

export default AlpineMethod;
