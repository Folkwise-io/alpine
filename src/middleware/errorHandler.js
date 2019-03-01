export function errorHandler(err, execDetails, next) {
  if (err instanceof Error) {
    console.log(`ERROR: ${err.message}`); // eslint-disable-line
  }

  next();
}
