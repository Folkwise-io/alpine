const assert = require('assert');

module.exports = (methods) => {
  describe('sum', () => {
    it('should return 3 with parameters 1 and 2', () => {
      assert.equal(methods.sum(1, 2), 3);
    });
  });
};
