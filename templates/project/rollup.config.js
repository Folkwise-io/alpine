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
      main: true,
      module: true,
      browser: true,
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
    name: pkg.name,
    file: pkg.main,
    format: 'cjs',
  },
});

const esm = Object.assign({}, baseConfig, {
  output: {
    name: pkg.name,
    file: pkg.module,
    format: 'es',
  },
});

const umd = Object.assign({}, baseConfig, {
  output: {
    name: pkg.name,
    file: pkg.browser,
    format: 'umd',
  },
});

export default [cjs, esm, umd];
