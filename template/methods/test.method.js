const { AlpineMethod } = require('alpine');

module.exports = AlpineMethod({
  name: 'test',
  parameters: [
    {
      name: 'str',
      validate: val => val.string(),
    },
  ],
  value: str => console.log(`Test: ${str}`),
});
