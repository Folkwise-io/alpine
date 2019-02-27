import { META } from '../common/constants';

export default (args, method) => {
  const methodDefinition = method(META);

  return {
    args,
    method,
    methodDefinition,
    result: null,
    errors: [],
  };
};
