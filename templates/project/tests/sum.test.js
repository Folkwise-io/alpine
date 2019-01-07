const assert = require('assert');

// sum() unit testing
module.exports = (methods) => {
  it('should return 3 with parameters 1 and 2', () => {
    assert.equal(methods.sum(1, 2), 3);
  });
};
