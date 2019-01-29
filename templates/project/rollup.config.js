const babel = require('rollup-plugin-babel');
const json = require('rollup-plugin-json');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const alpine = require('rollup-plugin-alpine');
const fs = require('fs');

const pkg = JSON.parse(fs.readFileSync('./package.json'));

const baseConfig = {
  input: 'index.js',
  plugins: [
    alpine(),
    resolve({
      preferBuiltins: false,
    }),
    commonjs({
      include: 'node_modules/**',
    }),
    json(),
    babel({
      exclude: 'node_modules/**',
    }),
  ],
};

const cjs = Object.assign({}, baseConfig, {
  output: {
    name: 'Task',
    file: pkg.browser,
    format: 'cjs',
  },
});

const esm = Object.assign({}, baseConfig, {
  output: {
    name: 'Task',
    file: pkg.module,
    format: 'es',
  },
});

export default [cjs, esm];
