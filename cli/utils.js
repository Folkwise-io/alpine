const dot = require('dot');
const fs = require('fs');
const path = require('path');

// disable stripping whitespaces
dot.templateSettings.strip = false;

const PATH = path.resolve(__dirname, '../template/');

const utils = {
  readFileAsString: (file, dirname = PATH) => {
    const filePath = path.resolve(dirname, file);
    return fs.readFileSync(filePath).toString('utf8');
  },
  processTemplate: (file, it, dirname = PATH) => {
    const srcContent = utils.readFileAsString(file, dirname);
    const tempFn = dot.template(srcContent);
    const dstContent = tempFn(it);
    return dstContent;
  },
};

module.exports = utils;
