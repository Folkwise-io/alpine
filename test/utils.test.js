const utils = require('../cli/utils');
const { equal } = require('chai').assert;

describe('utils', function() {
  it('can template', function() {
    const output = utils.processTemplate('./resources/test_template.dot', {place: 'world'}, __dirname);
    equal(output, 'Hello world!');
  })
});
