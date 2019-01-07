// Method definition
function sum(x, y) {
  console.log(x + y);
}

// Alpine method definition and export
module.exports = {
  name: 'sum',
  parameters: [
    {
      name: 'x',
      type: 'number', // Type validation
      validate: val => val.number().between(0, 100), // Additional validation using v8n
    },
    {
      name: 'y',
      type: 'number', // Type validation
      validate: val => val.number().between(0, 100), // Additional validation using v8n
    },
  ],
  cli: true,
  value: sum,
};
