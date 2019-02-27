import { META, CLI } from '../common/constants';

export default (args, method) => {
  const meta = method(META);
  let cliEnvoked = false;

  if (args[args.length - 1] === CLI) {
    args = args.slice(0, -1);
    cliEnvoked = true;
  }

  return {
    args,
    method,
    meta,
    result: null,
    errors: [],
    cli: cliEnvoked,
  };
};
