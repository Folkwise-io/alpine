export function simpleErrorHandler(err, args, method, next) {
  if (err instanceof Error) {
    console.log(`ERROR: ${err.message}`); // eslint-disable-line
  }

  next();
}
