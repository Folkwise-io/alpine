const assert = require('assert');
const library = require('../');

// sum() unit testing
describe('#sum()', () => {
  it('should return 3 with parameters 1 and 2', () => {
    assert.equal(library.sum(1, 2), 3);
  });
});
