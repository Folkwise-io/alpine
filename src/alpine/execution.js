import { META } from '../common/constants';

export default (args, method) => {
  const meta = method(META);

  return {
    args,
    method,
    meta,
    result: null,
    errors: [],
  };
};
