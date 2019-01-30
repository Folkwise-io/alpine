const assert = require('assert');
const pkg = require('../package.json');

// Require the built module
const library = require(`../${pkg.main}`);

// sum() unit testing
describe('#sum()', () => {
  it('should return 3 with parameters 1 and 2', () => {
    assert.equal(library.sum(1, 2), 3);
  });
});
