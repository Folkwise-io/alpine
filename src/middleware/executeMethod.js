export function executeMethod(execDetails, next) {
  const { args, method } = execDetails;
  let result;

  try {
    result = method(...args);
  } catch (e) {
    return next(e);
  }

  execDetails.result = result;
  return next();
}
