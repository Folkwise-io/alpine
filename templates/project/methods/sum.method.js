const v8n = require('v8n');

// Method definition
function sum(x, y) {
  console.log(x + y); // eslint-disable-line
  return x + y;
}

// Alpine method definition and export
module.exports = {
  name: 'sum',
  parameters: [
    {
      name: 'x',
      type: 'number', // Type validation
      validate: value => value >= 0 && value <= 100, // Additional validation
    },
    {
      name: 'y',
      type: 'number', // Type validation
      validate: [
        value => v8n()
          .number()
          .between(0, 100)
          .test(value), // Additional validation using v8n
        value => value % 2, // Another validation
      ],
    },
  ],
  returns: {
    type: 'number',
    validate: value => value >= 0 && value <= 200,
  },
  value: sum,
};
