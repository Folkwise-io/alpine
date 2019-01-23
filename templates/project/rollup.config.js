const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const json = require('rollup-plugin-json');
const fs = require('fs');

const pkg = JSON.parse(fs.readFileSync('./package.json'));
const external = Object.keys(pkg.dependencies || {});

module.exports = [
  {
    input: './index.js',
    output: {
      name: 'Task',
      file: pkg.browser,
      format: 'umd',
    },
    plugins: [resolve(), commonjs({ include: 'node_modules/**' }), json()],
  },
  {
    input: './index.js',
    external,
    output: [{ file: pkg.main, format: 'cjs' }, { file: pkg.module, format: 'es' }],
  },
];
