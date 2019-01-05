const { AlpineMethod } = require("alpine");

// Method definition
function {{=it.method.name}}() {
  
}

// Alpine method definition and export
module.exports = AlpineMethod({
  name: "{{=it.method.name}}",
  parameters: [],
  value: {{=it.method.name}},
});
