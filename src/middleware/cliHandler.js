export function cliHandler(execDetails, next) {
  const {
    cli,
    meta: { cli: metaCli },
    result,
  } = execDetails;

  if (!cli) {
    return next();
  }

  if (metaCli && typeof metaCli === 'function') {
    metaCli(execDetails); // Custom CLI handling
  } else {
    // Log the result if there is no handler provided
    console.log(result); // eslint-disable-line
  }

  return next();
}
