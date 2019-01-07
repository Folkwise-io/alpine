const { equal } = require('chai').assert;
const utils = require('../cli/utils');

describe('utils', () => {
  it('can template', () => {
    const output = utils.processTemplate(
      './resources/test_template.dot',
      { place: 'world' },
      __dirname,
    );

    equal(output, 'Hello world!');
  });
});
