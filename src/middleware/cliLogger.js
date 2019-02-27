export function cliLogger({ cli, result }, next) {
  if (cli) {
    console.log(result);
  }
  next();
}
