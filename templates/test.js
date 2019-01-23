const assert = require('assert');
const library = require('../');

/**
 * {{=it.method.name}}()
 {{? it.method.description }}* {{=it.method.description}}{{??}}* <description>{{?}}
 */
describe('#{{=it.method.name}}()', () => {
  // Tests
});
