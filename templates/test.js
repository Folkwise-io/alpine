const assert = require('assert');
const pkg = require('../package.json');

// Require the built module
const library = require(`../${pkg.main}`);

/**
 * {{=it.method.name}}()
 {{? it.method.description }}* {{=it.method.description}}{{??}}* <description>{{?}}
 */
describe('#{{=it.method.name}}()', () => {
  // Tests
});
