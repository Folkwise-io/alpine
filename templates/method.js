// Method definition
function {{=it.method.name}}() {
  return true;
}

// Alpine method definition and export
export default {
  name: "{{=it.method.name}}",
  description: "{{=it.method.description || ''}}",
  parameters: [],
  value: {{=it.method.name}},
};
