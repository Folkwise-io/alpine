const prompt = require('prompt');
const shell = require('shelljs');
const fs = require('fs');
const colors = require('colors/safe');

prompt.message = colors.green();

module.exports = (args, options, logger) => {
  const templatePath = `${__dirname}/../../template`;
  const localPath = process.cwd();

  // Check if the template exists
  if (!fs.existsSync(templatePath)) {
    logger.error('Template is missing.');
    process.exit(1);
  }

  logger.info('Copying files...');

  // Copy the template to the local path
  shell.cp('-R', `${templatePath}/*`, localPath);
  shell.cp('-R', `${templatePath}/.*`, localPath);

  logger.info('The files have been copied!');

  logger.info('Please fill the following values...');

  // Require the variables that will be replaced by user entries
  const variables = require(`${templatePath}/_variables`);
  if (fs.existsSync(`${localPath}/_variables.js`)) {
    shell.rm(`${localPath}/_variables.js`);
  }

  // Replace [VARIABLE] with the corresponding variable value from the prompt
  prompt.start().get(Object.values(variables), (err, result) => {
    shell.ls('-Rl', '.').forEach((entry) => {
      if (entry.isFile()) {
        Object.keys(variables).forEach((variable) => {
          shell.sed(
            '-i',
            `\\[${variable.toUpperCase()}\\]`,
            result[variables[variable]],
            entry.name,
          );
        });

        // Insert current year in files
        shell.sed('-i', '\\[YEAR\\]', new Date().getFullYear(), entry.name);
      }
    });

    logger.info('Success!');
  });
};
