const { AlpineMethod } = require('alpine');

// Method definition
function sum(x, y) {
  return x + y;
}

// Alpine method definition and export
module.exports = AlpineMethod({
  name: 'sum',
  parameters: [
    {
      name: 'x',
      validate: val => val.number(),
    },
    {
      name: 'y',
      validate: val => val.number(),
    },
  ],
  value: sum,
});
